"use server";

import { LogEvents } from "@midday/events/events";
import { setupAnalytics } from "@midday/events/server";
import { getTeamMembers, getUser } from "@solomon/supabase/cached-queries";
import { leaveTeam } from "@solomon/supabase/mutations";
import { createClient } from "@solomon/supabase/server";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { action } from "./safe-action";
import { leaveTeamSchema } from "./schema";

export const leaveTeamAction = action(
  leaveTeamSchema,
  async ({ teamId, role, redirectTo, revalidatePath }) => {
    const supabase = createClient();
    const user = await getUser();
    const { data: teamMembersData } = await getTeamMembers();

    const totalOwners = teamMembersData.filter(
      (member) => member.role === "owner"
    ).length;

    if (role === "owner" && totalOwners === 1) {
      throw Error("Action not allowed");
    }

    const { data, error } = await leaveTeam(supabase, {
      teamId,
      userId: user.data.id,
    });

    revalidateTag(`user_${user.data.id}`);
    revalidateTag(`teams_${user.data.id}`);

    if (revalidatePath) {
      revalidatePathFunc(revalidatePath);
    }

    if (redirectTo) {
      redirect(redirectTo);
    }

    const analytics = await setupAnalytics({
      userId: user.data.id,
      fullName: user.data.full_name,
    });

    analytics.track({
      event: LogEvents.LeaveTeam.name,
      channel: LogEvents.LeaveTeam.channel,
    });

    return data;
  }
);
