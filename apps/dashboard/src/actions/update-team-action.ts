"use server";

import { getUser } from "@solomon/supabase/cached-queries";
import { updateTeam } from "@solomon/supabase/mutations";
import { createClient } from "@solomon/supabase/server";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { action } from "./safe-action";
import { updateTeamSchema } from "./schema";

export const updateTeamAction = action(
  updateTeamSchema,
  async ({ revalidatePath, ...data }) => {
    const supabase = createClient();
    const team = await updateTeam(supabase, data);
    const user = await getUser();

    if (revalidatePath) {
      revalidatePathFunc(revalidatePath);
    }

    revalidateTag(`user_${user.data.id}`);

    return team;
  }
);
