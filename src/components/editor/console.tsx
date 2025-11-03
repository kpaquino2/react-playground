import { type Log } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  CircleAlert,
  CircleXIcon,
  InfoIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface ConsoleProps {
  logs: Array<Log>;
  isCollapsed: boolean;
}

export function Console({ logs, isCollapsed }: ConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (c) {
      c.scrollTop = c.scrollHeight;
    }
  }, [logs]);

  const getLogPrefix = (type: string) => {
    switch (type) {
      case "error":
        return {
          icon: <CircleXIcon className="size-5" />,
          className: "text-red-300 bg-red-950",
        };
      case "warn":
        return {
          icon: <CircleAlert className="size-5" />,
          className: "text-yellow-300 bg-yellow-950",
        };
      case "info":
        return {
          icon: <InfoIcon className="size-5" />,
          className: "text-blue-300 bg-blue-950",
        };
      default:
        return {
          icon: <ChevronRightIcon className="size-5" />,
          className: "",
        };
    }
  };

  return (
    <>
      {!isCollapsed && (
        <div
          ref={containerRef}
          className="bg-card text-card-foreground flex h-full flex-col overflow-y-scroll font-mono"
        >
          {logs.map((l, i) => {
            const t = getLogPrefix(l.type);
            return (
              <div
                key={i}
                className={cn(
                  "flex min-h-8 w-full gap-1.5 border-b px-2 py-0.5 wrap-anywhere",
                  t.className,
                )}
              >
                <div className="min-w-5 pt-0.5">{t.icon}</div>
                <p>{l.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
