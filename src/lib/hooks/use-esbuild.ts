"use client";

import { useCallback, useEffect, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { createClient } from "@/lib/supabase/client";

const MAX_DEPTH = 5;
const MAX_TOTAL_IMPORTS = 50;

let isInitialized = false;
let initPromise: Promise<void> | null = null;

// Cache for fetched remote components
const remoteComponentCache = new Map<string, string>();

export function useESBuild() {
  const [ready, setReady] = useState(isInitialized);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isInitialized) {
      setReady(true);
      return;
    }

    if (initPromise) {
      initPromise
        .then(() => setReady(true))
        .catch((err) => {
          setError(err.message);
        });
      return;
    }

    initPromise = esbuild
      .initialize({
        wasmURL: "/esbuild.wasm",
      })
      .then(() => {
        isInitialized = true;
        setReady(true);
        console.log("✅ esbuild initialized");
      })
      .catch((err) => {
        console.error("❌ Failed to initialize esbuild:", err);
        setError(err.message);
        throw err;
      });
  }, []);

  // Extract import IDs from code
  const extractImportIds = useCallback((code: string): string[] => {
    const importRegex = /import\s+.*?\s+from\s+['"]\/([a-zA-Z0-9]+)['"]/g;
    const matches = [...code.matchAll(importRegex)];
    return matches.map((m) => m[1]);
  }, []);

  // Fetch remote components from database
  const fetchRemoteComponents = useCallback(
    async (componentIds: string[]): Promise<Map<string, string>> => {
      const fileMap = new Map<string, string>();

      // Filter out already cached components
      const uncachedIds = componentIds.filter(
        (id) => !remoteComponentCache.has(id),
      );

      if (uncachedIds.length === 0) {
        // All components are cached
        componentIds.forEach((id) => {
          fileMap.set(`/${id}.tsx`, remoteComponentCache.get(id)!);
        });
        return fileMap;
      }

      // Fetch uncached components in batch
      const { data: components, error } = await supabase
        .from("components")
        .select("id, code")
        .in("id", uncachedIds);
      // .eq("visibility", "public"); // Only public components can be imported

      if (error) {
        console.error("Error fetching remote components:", error);
        throw new Error(`Failed to fetch components: ${error.message}`);
      }

      if (!components || components.length === 0) {
        throw new Error(
          `Components not found or not accessible: ${uncachedIds.join(", ")}`,
        );
      }

      // Check if we got all requested components
      const foundIds = new Set(components.map((c) => c.id));
      const missingIds = uncachedIds.filter((id) => !foundIds.has(id));
      if (missingIds.length > 0) {
        throw new Error(
          `Components not found or not accessible: ${missingIds.join(", ")}`,
        );
      }

      // Update cache
      components.forEach((comp) => {
        remoteComponentCache.set(comp.id, comp.code);
        fileMap.set(`/${comp.id}.tsx`, comp.code);
      });

      // Add already cached components
      componentIds.forEach((id) => {
        if (!fileMap.has(`/${id}.tsx`) && remoteComponentCache.has(id)) {
          fileMap.set(`/${id}.tsx`, remoteComponentCache.get(id)!);
        }
      });

      return fileMap;
    },
    [supabase],
  );

  // Resolve all dependencies recursively
  const resolveDependencies = useCallback(
    async (
      code: string,
      visited: Set<string> = new Set(),
      depth: number = 0,
    ): Promise<Map<string, string>> => {
      if (depth > MAX_DEPTH) {
        throw new Error(`Import depth exceeds maximum of ${MAX_DEPTH}`);
      }

      if (visited.size > MAX_TOTAL_IMPORTS) {
        throw new Error(
          `Total imports exceed maximum of ${MAX_TOTAL_IMPORTS}`,
        );
      }

      const importIds = extractImportIds(code);

      // Check for circular dependencies
      const circularDeps = importIds.filter((id) => visited.has(id));
      if (circularDeps.length > 0) {
        throw new Error(
          `Circular dependency detected: ${circularDeps.join(", ")}`,
        );
      }

      if (importIds.length === 0) {
        return new Map();
      }

      // Fetch all components at this level
      const fileMap = await fetchRemoteComponents(importIds);

      // Mark as visited
      importIds.forEach((id) => visited.add(id));

      // Recursively resolve dependencies
      for (const [, componentCode] of fileMap.entries()) {
        const nestedDeps = await resolveDependencies(
          componentCode,
          visited,
          depth + 1,
        );
        nestedDeps.forEach((code, nestedPath) => fileMap.set(nestedPath, code));
      }

      return fileMap;
    },
    [extractImportIds, fetchRemoteComponents],
  );

  const bundle = useCallback(
    async (name: string, code: string): Promise<string> => {
      if (!ready) {
        throw new Error("esbuild not initialized yet");
      }

      if (code.length === 0) {
        throw new Error("No component provided");
      }

      try {
        console.log(`📦 Bundling component: ${name}`);

        // Resolve all remote dependencies
        const remoteDeps = await resolveDependencies(code);
        console.log(remoteDeps);
        if (remoteDeps.size > 0) {
          console.log(
            "📥 Resolved dependencies:",
            Array.from(remoteDeps.keys()),
          );
        }

        const result = await esbuild.build({
          stdin: {
            contents: code,
            loader: "tsx",
            resolveDir: "/",
            sourcefile: `${name}.tsx`,
          },
          bundle: true,
          write: false,
          format: "iife",
          globalName: "UserApp",
          jsx: "transform",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
          plugins: [createVirtualFileSystemPlugin(remoteDeps)],
          external: ["react", "react-dom"],
          target: "es2020",
          logLevel: "silent",
        });

        const bundledCode = result.outputFiles[0].text;
        console.log("✅ Bundle successful");
        return bundledCode;
      } catch (err: unknown) {
        console.error("❌ Bundle error:", err);
        if (err instanceof Error) {
          throw err; // Preserve error message
        }
        throw new Error("Failed to bundle component");
      }
    },
    [ready, resolveDependencies],
  );

  return { ready, error, bundle };
}

function createVirtualFileSystemPlugin(
  files: Map<string, string>,
): esbuild.Plugin {
  return {
    name: "virtual-fs",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        // Skip external modules
        if (args.path === "react" || args.path === "react-dom") {
          return { path: args.path, external: true };
        }

        // Handle remote imports (/componentId)
        if (args.path.startsWith("/")) {
          // Try .tsx first, then .ts
          const tsxFileName = `${args.path}.tsx`;
          const tsFileName = `${args.path}.ts`;

          if (files.has(tsxFileName)) {
            return {
              path: tsxFileName,
              namespace: "virtual",
            };
          }

          if (files.has(tsFileName)) {
            return {
              path: tsFileName,
              namespace: "virtual",
            };
          }
        }

        console.warn(`⚠️ File not found: ${args.path}`);
        return undefined;
      });

      build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => {
        const contents = files.get(args.path);

        if (!contents) {
          return {
            errors: [
              {
                text: `File not found: ${args.path}`,
                location: null,
              },
            ],
          };
        }

        // Determine loader based on file extension
        const loader = args.path.endsWith(".tsx") ? "tsx" : "ts";

        return {
          contents,
          loader,
        };
      });
    },
  };
}
