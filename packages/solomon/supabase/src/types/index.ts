import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db";

export type Client = SupabaseClient<Database>;

export type StorageClient = SupabaseClient<Database, "storage">;

export * from "./db";
