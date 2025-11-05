import { type Database } from "./database.types";

export type Component = Database["public"]["Tables"]["components"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface Log {
  type: string;
  message: string;
}

export interface PreviewSettingsType {
  layout: "center" | "top-left";
  padding: number;
  background: string;
}
