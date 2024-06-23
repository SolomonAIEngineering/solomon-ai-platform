"use server";

import { LogEvents } from "@midday/events/events";
import { setupAnalytics } from "@midday/events/server";
import { getUser } from "@solomon/supabase/cached-queries";
import { createClient } from "@solomon/supabase/server";
import { deleteFolder } from "@solomon/supabase/storage";
import { revalidateTag } from "next/cache";
import { action } from "./safe-action";
import { deleteFolderSchema } from "./schema";

export const deleteFolderAction = action(deleteFolderSchema, async (value) => {
  const supabase = createClient();
  const user = await getUser();

  await deleteFolder(supabase, {
    bucket: "vault",
    path: [user.data.team_id, ...value.path],
  });

  await revalidateTag(`vault_${user.data.team_id}`);

  const analytics = await setupAnalytics({
    userId: user.data.id,
    fullName: user.data.full_name,
  });

  analytics.track({
    event: LogEvents.DeleteFolder.name,
    channel: LogEvents.DeleteFolder.channel,
  });

  return value;
});
