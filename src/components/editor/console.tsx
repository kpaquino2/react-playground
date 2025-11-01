import { type Log } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  CircleAlert,
  CircleXIcon,
  InfoIcon,
} from "lucide-react";

interface ConsoleProps {
  logs: Array<Log>;
}

export function Console({ logs }: ConsoleProps) {
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
    <div className="flex h-1/2 w-full flex-col overflow-y-scroll font-mono">
      {logs.map((l, i) => {
        const t = getLogPrefix(l.type);
        return (
          <div
            key={i}
            className={cn(
              "flex min-h-8 w-full gap-1.5 border-y px-2 py-0.5 wrap-anywhere",
              t.className,
            )}
          >
            <div className="min-w-5 pt-0.5">{t.icon}</div>
            <p>{l.message}</p>
          </div>
        );
      })}
    </div>
  );
}
