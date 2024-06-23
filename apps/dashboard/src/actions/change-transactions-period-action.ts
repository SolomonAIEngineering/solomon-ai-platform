"use server";

import { Cookies } from "@/utils/constants";
import { getUser } from "@solomon/supabase/cached-queries";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { action } from "./safe-action";
import { changeTransactionsPeriodSchema } from "./schema";

export const changeTransactionsPeriodAction = action(
  changeTransactionsPeriodSchema,
  async (value) => {
    const user = await getUser();

    cookies().set({
      name: Cookies.TransactionsPeriod,
      value,
    });

    revalidateTag(`transactions_${user.data.team_id}`);

    return value;
  }
);
