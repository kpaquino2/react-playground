// components/project/Preview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useESBuild } from "@/lib/hooks/useESBuild";
import { type Project } from "@/store/playgroundStore";

interface PreviewProps {
  project: Project;
  className?: string;
}

export function Preview({ project, className }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { ready, error: buildError, bundle } = useESBuild();
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ready || project.components.length === 0) return;

    let isCancelled = false;

    const renderPreview = async () => {
      setIsLoading(true);
      setRuntimeError(null);

      try {
        // Bundle components
        const bundledCode = await bundle(project.components);

        if (isCancelled) return;

        if (!iframeRef.current) return;
        const iframeHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { 
                  box-sizing: border-box; 
                }
                body { 
                  margin: 0; 
                  padding: 0px; 
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: white;
                }
                #root {
                  width: 100%;
                  height: 100%;
                }
              </style>
              
              <!-- Load React from CDN -->
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            </head>
            <body>
              <div id="root"></div>
              
              <script>
                // Setup error handling
                window.addEventListener('error', (e) => {
                  const errorDiv = document.createElement('div');
                  errorDiv.style.cssText = 'color: #dc2626; padding: 20px; margin: 20px; border: 2px solid #dc2626; border-radius: 8px; background: #fef2f2; font-family: monospace;';
                  errorDiv.innerHTML = '<strong>Runtime Error:</strong><br><pre>' + e.message + '</pre>';
                  document.body.innerHTML = '';
                  document.body.appendChild(errorDiv);
                  e.preventDefault();
                  
                  // Send error to parent window
                  window.parent.postMessage({ type: 'error', message: e.message }, '*');
                });

                window.addEventListener('unhandledrejection', (e) => {
                  const errorDiv = document.createElement('div');
                  errorDiv.style.cssText = 'color: #dc2626; padding: 20px; margin: 20px; border: 2px solid #dc2626; border-radius: 8px; background: #fef2f2; font-family: monospace;';
                  errorDiv.innerHTML = '<strong>Promise Rejection:</strong><br><pre>' + e.reason + '</pre>';
                  document.body.innerHTML = '';
                  document.body.appendChild(errorDiv);
                  
                  window.parent.postMessage({ type: 'error', message: String(e.reason) }, '*');
                });

                try {
                  // Execute bundled code
                  ${bundledCode}

                  // UserApp is the global name we defined in esbuild config
                  if (typeof UserApp === 'undefined') {
                    throw new Error('No component exported. Make sure your component exports a default or is named "App".');
                  }

                  // Render the component
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  
                  // UserApp might be the component itself or an object with the component
                  const Component = typeof UserApp === 'function' ? UserApp : UserApp.default;
                  
                  if (!Component) {
                    throw new Error('Could not find component to render');
                  }

                  root.render(React.createElement(Component));
                  
                  // Notify parent of successful render
                  window.parent.postMessage({ type: 'success' }, '*');
                } catch (error) {
                  const errorDiv = document.createElement('div');
                  errorDiv.style.cssText = 'color: #dc2626; padding: 20px; margin: 20px; border: 2px solid #dc2626; border-radius: 8px; background: #fef2f2; font-family: monospace;';
                  errorDiv.innerHTML = '<strong>Initialization Error:</strong><br><pre>' + error.message + '</pre>';
                  document.getElementById('root').appendChild(errorDiv);
                  
                  window.parent.postMessage({ type: 'error', message: error.message }, '*');
                }
              </script>
            </body>
          </html>
        `;
        iframeRef.current.srcdoc = iframeHtml;
      } catch (error) {
        console.error("Preview error:", error);
        setRuntimeError(
          error instanceof Error ? error.message : "Unknown error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    renderPreview();

    return () => {
      isCancelled = true;
    };
  }, [project.components, ready, bundle]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "error") {
        setRuntimeError(event.data.message);
      } else if (event.data.type === "success") {
        setRuntimeError(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (buildError) {
    return (
      <div className={className}>
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-2xl rounded-lg border-2 border-red-600 bg-red-50 p-6 text-red-600">
            <h3 className="mb-2 text-lg font-bold">Build Error</h3>
            <pre className="text-sm whitespace-pre-wrap">{buildError}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className={className}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading compiler...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Bundling components...</p>
          </div>
        </div>
      )}
      {runtimeError && (
        <div className="absolute top-0 right-0 left-0 bg-red-600 px-4 py-2 text-sm text-white">
          <strong>Error:</strong> {runtimeError}
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="h-full w-full border-none"
        sandbox="allow-scripts"
        title="Preview"
      />
    </div>
  );
}
