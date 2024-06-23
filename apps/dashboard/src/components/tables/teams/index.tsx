import { getUser } from "@solomon/supabase/cached-queries";
import {
  getTeamsByUserIdQuery,
  getUserInvitesQuery,
} from "@solomon/supabase/queries";
import { createClient } from "@solomon/supabase/server";
import { DataTable } from "./table";

export async function TeamsTable() {
  const supabase = createClient();
  const user = await getUser();

  const [teams, invites] = await Promise.all([
    getTeamsByUserIdQuery(supabase, user.data?.id),
    getUserInvitesQuery(supabase, user.data?.email),
  ]);

  return (
    <DataTable
      data={[
        ...teams?.data,
        ...invites?.data?.map((invite) => ({ ...invite, isInvite: true })),
      ]}
    />
  );
}
