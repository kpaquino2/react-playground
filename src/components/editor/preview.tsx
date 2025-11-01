"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { useESBuild } from "@/lib/hooks/use-esbuild";
import type { PreviewSettingsType, Log } from "@/lib/types";

interface PreviewProps {
  name: string;
  code: string;
  addLog: (l: Log) => void;
  previewSettings: PreviewSettingsType;
}

export interface PreviewRef {
  refresh: () => Promise<void>;
}

export const Preview = forwardRef<PreviewRef, PreviewProps>(
  ({ name, code, addLog, previewSettings }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { ready, error: buildError, bundle } = useESBuild();
    const [runtimeError, setRuntimeError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasRenderedRef = useRef(false);

    function getLayoutStyles(settings: PreviewSettingsType): string {
      const { layout, padding } = settings;
      switch (layout) {
        case "center":
          return `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: ${padding}px;
          `;

        case "top-left":
          return `
            display: block;
            padding: ${padding}px;
            width: 100%;
            height: 100%;
          `;
      }
    }

    const renderPreview = useCallback(async () => {
      if (!ready) return;

      setIsLoading(true);
      setRuntimeError(null);

      try {
        // Bundle component
        const bundledCode = await bundle(name, code);

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
                  background: ${previewSettings.background};
                  height: 100svh;
                }
                #root {
                  ${getLayoutStyles(previewSettings)}
                }
              </style>
              
              <!-- Load React from CDN -->
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            </head>
            <body>
              <div id="root"></div>
              
              <script>
                // Intercept console methods
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;
                const originalInfo = console.info;

                console.log = function(...args) {
                  originalLog.apply(console, args);
                  window.parent.postMessage({ 
                    type: 'console', 
                    level: 'log',
                    message: args.map(String).join(' ')
                  }, '*');
                };

                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  window.parent.postMessage({ 
                    type: 'console', 
                    level: 'warn',
                    message: args.map(String).join(' ')
                  }, '*');
                };

                console.error = function(...args) {
                  originalError.apply(console, args);
                  window.parent.postMessage({ 
                    type: 'console', 
                    level: 'error',
                    message: args.map(String).join(' ')
                  }, '*');
                };

                console.info = function(...args) {
                  originalInfo.apply(console, args);
                  window.parent.postMessage({ 
                    type: 'console', 
                    level: 'info',
                    message: args.map(String).join(' ')
                  }, '*');
                };

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
    }, [ready, bundle, name, code, previewSettings]);

    // Initial render only
    useEffect(() => {
      if (ready && !hasRenderedRef.current) {
        hasRenderedRef.current = true;
        renderPreview();
      }
    }, [ready, renderPreview]);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: renderPreview,
    }));

    // Listen for messages from iframe
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "console") {
          addLog({ type: event.data.level, message: event.data.message });
        } else if (event.data.type === "error") {
          setRuntimeError(event.data.message);
        } else if (event.data.type === "success") {
          setRuntimeError(null);
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [addLog]);

    if (buildError) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-2xl rounded-lg border-2 border-red-600 bg-red-50 p-6 text-red-600">
            <h3 className="mb-2 text-lg font-bold">Build Error</h3>
            <pre className="text-sm whitespace-pre-wrap">{buildError}</pre>
          </div>
        </div>
      );
    }

    if (!ready) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="border-foreground mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p>Loading compiler...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Bundling components...</p>
            </div>
          </div>
        )}
        {runtimeError && (
          <div className="absolute top-0 right-0 left-0 z-10 bg-red-600 px-4 py-2 text-sm text-white">
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
  },
);

Preview.displayName = "Preview";
