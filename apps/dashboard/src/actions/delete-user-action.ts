"use server";

import { LogEvents } from "@midday/events/events";
import { setupAnalytics } from "@midday/events/server";
import { getUser } from "@solomon/supabase/cached-queries";
import { deleteUser } from "@solomon/supabase/mutations";
import { createClient } from "@solomon/supabase/server";
import { redirect } from "next/navigation";

export const deleteUserAction = async () => {
  const supabase = createClient();
  const user = await getUser();

  const { data: membersData } = await supabase
    .from("users_on_team")
    .select("team_id, team:team_id(id, name, members:users_on_team(id))")
    .eq("user_id", user?.data?.id);

  const teamIds = membersData
    ?.filter(({ team }) => team?.members.length === 1)
    .map(({ team_id }) => team_id);

  if (teamIds?.length) {
    // Delete all teams with only one member
    await supabase.from("teams").delete().in("id", teamIds);
  }

  const userId = await deleteUser(supabase);

  const analytics = await setupAnalytics({
    userId,
  });

  analytics.track({
    event: LogEvents.DeleteUser.name,
    user_id: userId,
    channel: LogEvents.DeleteUser.channel,
  });

  redirect("/");
};
