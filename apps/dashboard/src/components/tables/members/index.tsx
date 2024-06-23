import { getTeamUser } from "@solomon/supabase/cached-queries";
import { getTeamMembersQuery } from "@solomon/supabase/queries";
import { createClient } from "@solomon/supabase/server";
import { DataTable } from "./table";

export async function MembersTable() {
  const supabase = createClient();
  const user = await getTeamUser();
  const teamMembers = await getTeamMembersQuery(supabase, user.data.team_id);

  return <DataTable data={teamMembers?.data} currentUser={user?.data} />;
}
