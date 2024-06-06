"use server";
import { cookies, headers } from "next/headers";
import { db } from "@/server/db";
import {
  contentToSpace,
  sessions,
  storedContent,
  users,
  space,
  StoredContent,
} from "@/server/db/schema";
import { SearchResult } from "@/contexts/MemoryContext";
import {
  like,
  eq,
  and,
  sql,
  exists,
  asc,
  notExists,
  inArray,
  notInArray,
} from "drizzle-orm";
import { union } from "drizzle-orm/sqlite-core";
import { env } from "@/env";

// @todo: (future) pagination not yet needed
export async function searchMemoriesAndSpaces(
  query: string,
  opts?: {
    filter?: { memories?: boolean; spaces?: boolean };
    range?: { offset: number; limit: number };
    memoriesRelativeToSpace?: {
      fromSpaces?: number[];
      notInSpaces?: number[];
    };
  },
): Promise<SearchResult[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const defaultWhere = and(
    eq(storedContent.user, user.id),
    like(storedContent.title, `%${query}%`),
  );
  const extraWheres = [];

  if (opts?.memoriesRelativeToSpace) {
    if (opts.memoriesRelativeToSpace.fromSpaces) {
      extraWheres.push(
        exists(
          db
            .select()
            .from(contentToSpace)
            .where(
              and(
                eq(contentToSpace.contentId, storedContent.id),
                inArray(
                  contentToSpace.spaceId,
                  opts.memoriesRelativeToSpace.fromSpaces,
                ),
              ),
            ),
        ),
      );
    }
    if (opts.memoriesRelativeToSpace.notInSpaces) {
      extraWheres.push(
        notExists(
          db
            .select()
            .from(contentToSpace)
            .where(
              and(
                eq(contentToSpace.contentId, storedContent.id),
                inArray(
                  contentToSpace.spaceId,
                  opts.memoriesRelativeToSpace.notInSpaces,
                ),
              ),
            ),
        ),
      );
    }
  }

  try {
    let searchMemoriesQuery = db
      .select({
        type: sql<string>`'memory'`,
        space: sql`NULL`,
        memory: storedContent as any,
      })
      .from(storedContent)
      .where(
        extraWheres.length == 2
          ? and(and(...extraWheres), defaultWhere)
          : extraWheres.length == 1
            ? and(...extraWheres, defaultWhere)
            : defaultWhere,
      )
      .orderBy(asc(storedContent.savedAt));

    let searchSpacesQuery = db
      .select({
        type: sql<string>`'space'`,
        space: space as any,
        memory: sql`NULL`,
      })
      .from(space)
      .where(and(eq(space.user, user.id), like(space.name, `%${query}%`)))
      .orderBy(asc(space.name));

    let queries = [];

    console.log("adding");

    [undefined, true].includes(opts?.filter?.memories) &&
      queries.push(searchMemoriesQuery);
    [undefined, true].includes(opts?.filter?.spaces) &&
      queries.push(searchSpacesQuery);

    if (opts?.range) {
      queries = queries.map((q) =>
        q.offset(opts.range!.offset).limit(opts.range!.limit),
      );
    } else {
      queries = queries.map((q) => q.all());
    }

    const data = await Promise.all(queries);

    console.log("resp", data);

    return data.reduce((acc, i) => [...acc, ...i]) as SearchResult[];
  } catch {
    return [];
  }
}

export async function getMemoriesFromUrl(urls: string[]) {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return urls.length > 0
    ? await db
        .select()
        .from(storedContent)
        .where(
          and(
            inArray(storedContent.url, urls),
            eq(storedContent.user, user.id),
          ),
        )
        .all()
    : [];
}

async function getUser() {
  const token =
    cookies().get("next-auth.session-token")?.value ??
    cookies().get("__Secure-authjs.session-token")?.value ??
    cookies().get("authjs.session-token")?.value ??
    headers().get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token!));

  if (!session || session.length === 0) {
    return null;
  }

  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, session[0].userId))
    .limit(1);

  if (!userData) {
    return null;
  }

  return userData;
}

export async function getSpace(id: number) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    await db
      .select()
      .from(space)
      .where(and(eq(space.id, id), eq(space.user, user.id)))
  )[0];
}

export async function addSpace(name: string, memories: number[]) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const [addedSpace] = await db
    .insert(space)
    .values({
      name: name,
      user: user.id,
    })
    .returning();

  const addedMemories =
    memories.length > 0
      ? await db
          .insert(contentToSpace)
          .values(
            memories.map((m) => ({
              contentId: m,
              spaceId: addedSpace.id,
            })),
          )
          .returning()
      : [];

  return {
    space: addedSpace,
    addedMemories,
  };
}

export async function fetchContent(id: number) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const fetchedMemory = await db
    .select()
    .from(storedContent)
    .where(and(eq(storedContent.id, id), eq(storedContent.user, user.id)));

  const memory = fetchedMemory.length > 0 ? fetchedMemory[0] : null;

  const spaces = memory
    ? await db
        .select()
        .from(contentToSpace)
        .where(eq(contentToSpace.contentId, memory.id))
    : [];

  return {
    memory,
    spaces: spaces.map((s) => s.spaceId),
  };
}

export async function fetchContentForSpace(
  spaceId: number,
  range?: {
    offset: number;
    limit: number;
  },
) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const query = db
    .select()
    .from(storedContent)
    .where(
      exists(
        db
          .select()
          .from(contentToSpace)
          .where(
            and(
              and(
                eq(contentToSpace.spaceId, spaceId),
                eq(contentToSpace.contentId, storedContent.id),
              ),
              exists(
                db
                  .select()
                  .from(space)
                  .where(
                    and(
                      eq(space.user, user.id),
                      eq(space.id, contentToSpace.spaceId),
                    ),
                  ),
              ),
            ),
          ),
      ),
    )
    .orderBy(asc(storedContent.savedAt));

  return range
    ? await query.limit(range.limit).offset(range.offset)
    : await query.all();
}

export async function fetchFreeMemories(range?: {
  offset: number;
  limit: number;
}) {
  const user = await getUser();

  if (!user) {
    return [];
  }

  try {
    const query = db
      .select()
      .from(storedContent)
      .where(
        and(
          notExists(
            db
              .select()
              .from(contentToSpace)
              .where(eq(contentToSpace.contentId, storedContent.id)),
          ),
          eq(storedContent.user, user.id),
        ),
      )
      .orderBy(asc(storedContent.savedAt));

    return range
      ? await query.limit(range.limit).offset(range.offset)
      : await query.all();
  } catch {
    return [];
  }
}

export async function updateSpaceTitle(id: number, title: string) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    await db
      .update(space)
      .set({ name: title })
      .where(and(eq(space.id, id), eq(space.user, user.id)))
      .returning()
  )[0];
}

export async function addMemory(
  content: typeof storedContent.$inferInsert,
  spaces: number[],
) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  if (!content.content || content.content.trim() === "") {
    const resp = await fetch(
      `https://cf-ai-backend.yoanyomba.workers.dev/getPageContent?url=${content.url}`,
      {
        headers: {
          "X-Custom-Auth-Key": env.BACKEND_SECURITY_KEY,
        },
      },
    );

    const data = await resp.text();

    console.log(data);

    content.content = data;
  }

  if (!content.content || content.content == "") {
    return null;
  }

  let [addedMemory] = await db
    .insert(storedContent)
    .values({
      user: user.id,
      ...content,
    })
    .returning();

  const addedToSpaces =
    spaces.length > 0
      ? await db
          .insert(contentToSpace)
          .values(
            spaces.map((s) => ({
              contentId: addedMemory.id,
              spaceId: s,
            })),
          )
          .returning()
      : [];

  if (content.type === "note") {
    addedMemory = (
      await db
        .update(storedContent)
        .set({
          url: addedMemory.url + addedMemory.id,
        })
        .where(eq(storedContent.id, addedMemory.id))
        .returning()
    )[0];
  }

  console.log("adding with:", `${addedMemory.url}-${user.email}`);
  // Add to vectorDB
  const res = (await Promise.race([
    fetch("https://cf-ai-backend.yoanyomba.workers.dev/add", {
      method: "POST",
      headers: {
        "X-Custom-Auth-Key": env.BACKEND_SECURITY_KEY,
      },
      body: JSON.stringify({
        pageContent: addedMemory.content,
        title: addedMemory.title,
        url: addedMemory.url,
        user: user.email,
      }),
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 40000),
    ),
  ])) as Response;

  return {
    memory: addedMemory,
    addedToSpaces,
  };
}

export async function addContentInSpaces(id: number, contents: number[]) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const data =
    contents.length > 0
      ? await db
          .insert(contentToSpace)
          .values(
            contents.map((i) => ({
              spaceId: id,
              contentId: i,
            })),
          )
          .returning()
      : [];

  return data;
}

export async function updateMemory(
  id: number,
  {
    title,
    content,
    spaces,
    removedFromSpaces: removeSpaces,
  }: {
    title?: string;
    content?: string;
    spaces?: number[];
    removedFromSpaces?: number[];
  },
) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  let updatedMemory: StoredContent | null = null;

  if (title && content) {
    const [prev] = await db
      .select()
      .from(storedContent)
      .where(and(eq(storedContent.user, user.id), eq(storedContent.id, id)));

    if (!prev) {
      return null;
    }

    const newContent = {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
    };

    const updated = {
      ...newContent,
      ...prev,
    };

    console.log("adding with:", `${updated.url}-${user.email}`);
    // Add to vectorDB
    const res = (await Promise.race([
      fetch("https://cf-ai-backend.yoanyomba.workers.dev/edit", {
        method: "POST",
        headers: {
          "X-Custom-Auth-Key": env.BACKEND_SECURITY_KEY,
        },
        body: JSON.stringify({
          pageContent: updated.content,
          title: updated.title,
          url: updated.url,
          user: user.email,
          uniqueUrl: updated.url,
        }),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 40000),
      ),
    ])) as Response;

    [updatedMemory] = await db
      .update(storedContent)
      .set(newContent)
      .where(and(eq(storedContent.id, id), eq(storedContent.user, user.id)))
      .returning();

    console.log(updatedMemory, newContent);
  }

  if (!updatedMemory) {
    [updatedMemory] = await db
      .select()
      .from(storedContent)
      .where(and(eq(storedContent.id, id), eq(storedContent.user, user.id)));
  }

  const removedFromSpaces = removeSpaces
    ? removeSpaces.length > 0
      ? await db
          .delete(contentToSpace)
          .where(
            and(
              inArray(contentToSpace.spaceId, removeSpaces),
              eq(contentToSpace.contentId, id),
            ),
          )
          .returning()
      : []
    : spaces
      ? spaces.length > 0
        ? await db
            .delete(contentToSpace)
            .where(
              and(
                notInArray(contentToSpace.spaceId, spaces),
                eq(contentToSpace.contentId, id),
              ),
            )
            .returning()
        : await db
            .delete(contentToSpace)
            .where(eq(contentToSpace.contentId, id))
      : [];

  const addedToSpaces =
    spaces && spaces.length > 0
      ? await db
          .insert(contentToSpace)
          .values(
            spaces.map((s) => ({
              contentId: id,
              spaceId: s,
            })),
          )
          .onConflictDoNothing()
          .returning()
      : [];

  const resultedSpaces =
    (
      await db
        .select()
        .from(contentToSpace)
        .where(eq(contentToSpace.contentId, id))
        .all()
    ).map((i) => i.spaceId) ?? [];

  return {
    memory: updatedMemory,
    addedToSpaces,
    removedFromSpaces,
    resultedSpaces,
  };
}

export async function deleteSpace(id: number) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  await db.delete(contentToSpace).where(eq(contentToSpace.spaceId, id));

  const [deleted] = await db
    .delete(space)
    .where(and(eq(space.user, user.id), eq(space.id, id)))
    .returning();

  return deleted;
}

export async function deleteMemory(id: number) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  await db.delete(contentToSpace).where(eq(contentToSpace.contentId, id));

  const [deleted] = await db
    .delete(storedContent)
    .where(and(eq(storedContent.user, user.id), eq(storedContent.id, id)))
    .returning();

  if (deleted) {
    console.log("adding with:", `${deleted.url}-${user.email}`);
    const res = (await Promise.race([
      fetch(`https://cf-ai-backend.yoanyomba.workers.dev/delete`, {
        method: "DELETE",
        headers: {
          "X-Custom-Auth-Key": env.BACKEND_SECURITY_KEY,
        },
        body: JSON.stringify({
          websiteUrl: deleted.url,
          user: user.email,
        }),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 40000),
      ),
    ])) as Response;
  }

  return deleted;
}
