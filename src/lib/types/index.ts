// lib/types.ts
import { Database } from "./database.types";

export type Component = Database["public"]["Tables"]["components"]["Row"];
export type ComponentInsert =
  Database["public"]["Tables"]["components"]["Insert"];
export type ComponentUpdate =
  Database["public"]["Tables"]["components"]["Update"];

export type Collaborator =
  Database["public"]["Tables"]["component_collaborators"]["Row"];
