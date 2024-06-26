import { getCategories } from "@solomon/supabase/cached-queries";
import { DataTable } from "./table";

export async function CategoriesTable() {
  const categories = await getCategories();

  return <DataTable data={categories?.data} />;
}
