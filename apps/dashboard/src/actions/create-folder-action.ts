"use server";

import { LogEvents } from "@midday/events/events";
import { setupAnalytics } from "@midday/events/server";
import { getUser } from "@solomon/supabase/cached-queries";
import { createClient } from "@solomon/supabase/server";
import { createFolder } from "@solomon/supabase/storage";
import { revalidateTag } from "next/cache";
import { action } from "./safe-action";
import { createFolderSchema } from "./schema";

export const createFolderAction = action(createFolderSchema, async (value) => {
  const supabase = createClient();
  const user = await getUser();

  await createFolder(supabase, {
    bucket: "vault",
    path: [user?.data?.team_id, value.path],
    name: value.name,
  });

  await revalidateTag(`vault_${user?.data?.team_id}`);

  const analytics = await setupAnalytics({
    userId: user?.data?.id,
    fullName: user?.data?.full_name,
  });

  analytics.track({
    event: LogEvents.CreateFolder.name,
    channel: LogEvents.CreateFolder.channel,
  });
});
