"use client";

import { useEffect, useState, useCallback } from "react";
import * as esbuild from "esbuild-wasm";
import { Component } from "@/store/playgroundStore";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export function useESBuild() {
  const [ready, setReady] = useState(isInitialized);
  const [error, setError] = useState<string | null>(null);

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

  const bundle = useCallback(
    async (components: Component[]): Promise<string> => {
      if (!ready) {
        throw new Error("esbuild not initialized yet");
      }

      if (!components || components.length === 0) {
        throw new Error("No components provided");
      }

      try {
        const fileMap = new Map<string, string>();
        components.forEach((component) => {
          const fileName = `${component.name}.jsx`;
          fileMap.set(fileName, component.code);
        });

        const entryComponent =
          components.find((c) => c.name === "App") ||
          components.find((c) => c.name === "index") ||
          components[0];

        if (!entryComponent) {
          throw new Error("No entry component found");
        }

        console.log("📦 Bundling components:", Array.from(fileMap.keys()));

        const result = await esbuild.build({
          stdin: {
            contents: entryComponent.code,
            loader: "jsx",
            resolveDir: "/",
            sourcefile: `${entryComponent.name}.jsx`,
          },
          bundle: true,
          write: false,
          format: "iife",
          globalName: "UserApp",
          jsx: "transform",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
          plugins: [createVirtualFileSystemPlugin(fileMap)],
          external: ["react", "react-dom"], // Don't bundle React
          target: "es2020",
          logLevel: "silent",
        });

        const bundledCode = result.outputFiles[0].text;
        console.log("✅ Bundle successful");
        return bundledCode;
      } catch (err: any) {
        console.error("❌ Bundle error:", err);
        throw new Error(err.message || "Failed to bundle components");
      }
    },
    [ready],
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
        if (args.path === "react" || args.path === "react-dom") {
          return { path: args.path, external: true };
        }

        let fileName = args.path;

        if (fileName.startsWith("./")) {
          fileName = fileName.slice(2);
        }

        if (!fileName.endsWith(".jsx") && !fileName.endsWith(".js")) {
          fileName += ".jsx";
        }

        if (files.has(fileName)) {
          return {
            path: fileName,
            namespace: "virtual",
          };
        }

        console.warn(`⚠️ File not found: ${fileName}`);
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

        return {
          contents,
          loader: "jsx",
        };
      });
    },
  };
}
