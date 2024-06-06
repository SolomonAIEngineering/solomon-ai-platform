import { Editor } from "novel";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  MemoryWithImage,
  MemoryWithImages3,
  MemoryWithImages2,
} from "@/assets/MemoryWithImages";
import { Input, InputWithIcon } from "../ui/input";
import {
  ArrowUpRight,
  Edit3,
  Loader,
  Minus,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Text,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useMemo, useRef, useState } from "react";
import { Variant, useAnimate, motion } from "framer-motion";
import { SearchResult, useMemory } from "@/contexts/MemoryContext";
import { SpaceIcon } from "@/assets/Memories";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import useViewport from "@/hooks/useViewport";
import useTouchHold from "@/hooks/useTouchHold";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  AddExistingMemoryToSpace,
  AddMemoryPage,
  MemorySelectedItem,
  NoteAddPage,
  SpaceAddPage,
} from "./AddMemoryDialog";
import { ExpandedSpace } from "./ExpandedSpace";
import { StoredContent, StoredSpace } from "@/server/db/schema";
import { useDebounce } from "@/hooks/useDebounce";
import { NoteEdit } from "./EditNoteDialog";
import DeleteConfirmation from "./DeleteConfirmation";

export function MemoriesBar({ isOpen }: { isOpen: boolean }) {
  const [parent, enableAnimations] = useAutoAnimate();
  const { spaces, deleteSpace, freeMemories, search } = useMemory();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addMemoryState, setAddMemoryState] = useState<
    "page" | "note" | "space" | "existing-memory" | null
  >(null);

  const [expandedSpace, setExpandedSpace] = useState<number | null>(null);

  const [searchQuery, setSearcyQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const query = useDebounce(searchQuery, 500);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    (async () => {
      setSearchResults(await search(q));
      setSearchLoading(false);
    })();
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setExpandedSpace(null);
    }
  }, [isOpen]);

  if (expandedSpace) {
    return (
      <ExpandedSpace
        spaceId={expandedSpace}
        back={() => setExpandedSpace(null)}
        // close={() => setExpandedSpace(null)}
      />
    );
  }

  return (
    <div className="text-rgray-11 flex w-full flex-col items-start py-8 text-left">
      <div className="w-full px-8">
        <h1 className="w-full text-2xl">Your Memories</h1>
        <InputWithIcon
          placeholder="Search"
          icon={
            searchLoading ? (
              <Loader className="text-rgray-11 h-5 w-5 animate-spin opacity-50" />
            ) : (
              <Search className="text-rgray-11 h-5 w-5 opacity-50" />
            )
          }
          className="bg-rgray-4 mt-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearcyQuery(e.target.value)}
        />
      </div>
      <div className="mt-2 flex w-full px-8">
        <AddMemoryModal type={addMemoryState}>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="focus-visible:bg-rgray-4 focus-visible:ring-rgray-7 hover:bg-rgray-4 ml-auto flex items-center justify-center rounded-md px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2">
                <Plus className="mr-2 h-5 w-5" />
                Add
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <DialogTrigger className="block w-full">
                <DropdownMenuItem
                  onClick={() => {
                    setAddMemoryState("page");
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Page to Memory
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger className="block w-full">
                <DropdownMenuItem
                  onClick={() => {
                    setAddMemoryState("note");
                  }}
                >
                  <Text className="mr-2 h-4 w-4" />
                  Note
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger className="block w-full">
                <DropdownMenuItem
                  onClick={() => {
                    setAddMemoryState("space");
                  }}
                >
                  <SpaceIcon className="mr-2 h-4 w-4" />
                  Space
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AddMemoryModal>
      </div>
      <div
        ref={parent}
        className="grid w-full grid-flow-row grid-cols-3 gap-1 px-2 py-5"
      >
        {query.trim().length > 0 ? (
          <>
            {searchResults.map(({ type, space, memory }, i) => (
              <>
                {type === "memory" && (
                  <MemoryItem
                    {...memory!}
                    key={i}
                    onDelete={() => {
                      setSearchResults((prev) =>
                        prev.filter((i) => i.memory?.id !== memory.id),
                      );
                    }}
                  />
                )}
                {type === "space" && (
                  <SpaceItem
                    {...space!}
                    key={i}
                    onDelete={() => {
                      setSearchResults((prev) =>
                        prev.filter((i) => i.space?.id !== space.id),
                      );
                      deleteSpace(space.id);
                    }}
                  />
                )}
              </>
            ))}
          </>
        ) : (
          <>
            {spaces.map((space) => (
              <SpaceItem
                onDelete={() => deleteSpace(space.id)}
                key={space.id}
                onClick={() => setExpandedSpace(space.id)}
                {...space}
              />
            ))}
            {freeMemories.map((m) => (
              <MemoryItem {...m} key={m.id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const SpaceExitVariant: Variant = {
  opacity: 0,
  scale: 0,
  borderRadius: "50%",
  background: "var(--gray-1)",
  transition: {
    duration: 0.2,
  },
};

export function MemoryItem(
  props: StoredContent & {
    onDelete?: () => void;
    removeFromSpace?: () => Promise<void>;
  },
) {
  const { id, title, image, type, url, onDelete, removeFromSpace } = props;

  const { deleteMemory } = useMemory();

  const name = title
    ? title.length > 10
      ? title.slice(0, 10) + "..."
      : title
    : "<no title>";

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const touchEventProps = useTouchHold({
    onHold() {
      setMoreDropdownOpen(true);
    },
  });
  return (
    <Dialog
      open={type === "note" ? isDialogOpen : false}
      onOpenChange={setIsDialogOpen}
    >
      <div
        {...touchEventProps}
        className="hover:bg-rgray-2 has-[[data-state='true']]:bg-rgray-2 has-[[data-space-text]:focus-visible]:bg-rgray-2 has-[[data-space-text]:focus-visible]:ring-rgray-7 [&:has-[[data-space-text]:focus-visible]>[data-more-button]]:opacity-100 relative flex cursor-pointer select-none flex-col-reverse items-center justify-center rounded-md p-2 pb-4 text-center font-normal ring-transparent transition has-[[data-space-text]:focus-visible]:outline-none has-[[data-space-text]:focus-visible]:ring-2 md:has-[[data-state='true']]:bg-transparent [&:hover>[data-more-button]]:opacity-100"
      >
        {type === "note" ? (
          <DialogTrigger asChild>
            <button data-space-text className="focus-visible:outline-none">
              {name}
            </button>
          </DialogTrigger>
        ) : (
          <button
            onClick={() => window.open(url)}
            data-space-text
            className="focus-visible:outline-none"
          >
            {name}
          </button>
        )}

        {type === "page" ? (
          <PageMoreButton
            isOpen={moreDropdownOpen}
            setIsOpen={setMoreDropdownOpen}
            removeFromSpace={removeFromSpace}
            onDelete={() => {
              deleteMemory(id);
              onDelete?.();
            }}
            url={url}
          />
        ) : type === "note" ? (
          <NoteMoreButton
            isOpen={moreDropdownOpen}
            setIsOpen={setMoreDropdownOpen}
            removeFromSpace={removeFromSpace}
            onEdit={() => setIsDialogOpen(true)}
            onDelete={() => {
              deleteMemory(id);
              onDelete?.();
            }}
          />
        ) : null}

        <div className="flex h-24 w-24 items-center justify-center">
          {type === "page" ? (
            <img
              onClick={() => window.open(url)}
              className="h-16 w-16"
              id={id.toString()}
              src={image!}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/icons/white_without_bg.png";
              }}
            />
          ) : type === "note" ? (
            <Text onClick={() => setIsDialogOpen(true)} className="h-16 w-16" />
          ) : (
            <></>
          )}
        </div>
      </div>
      <DialogContent className="w-max max-w-[auto]">
        <NoteEdit
          onDelete={onDelete}
          closeDialog={() => setIsDialogOpen(false)}
          memory={props}
        />
      </DialogContent>
    </Dialog>
  );
}

export function SpaceItem({
  name,
  id,
  onDelete,
  onClick,
}: StoredSpace & { onDelete: () => void; onClick?: () => void }) {
  const { cachedMemories } = useMemory();

  const [itemRef, animateItem] = useAnimate();
  const { width } = useViewport();

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const touchEventProps = useTouchHold({
    onHold() {
      setMoreDropdownOpen(true);
    },
  });

  const spaceMemories = useMemo(() => {
    return cachedMemories.filter((m) => m.space === id);
  }, [cachedMemories]);

  const _name = name.length > 10 ? name.slice(0, 10) + "..." : name;

  return (
    <motion.div
      ref={itemRef}
      {...touchEventProps}
      className="hover:bg-rgray-2 has-[[data-state='true']]:bg-rgray-2 has-[[data-space-text]:focus-visible]:bg-rgray-2 has-[[data-space-text]:focus-visible]:ring-rgray-7 [&:has-[[data-space-text]:focus-visible]>[data-more-button]]:opacity-100 relative flex select-none flex-col-reverse items-center justify-center rounded-md p-2 pb-4 text-center font-normal ring-transparent transition has-[[data-space-text]:focus-visible]:outline-none has-[[data-space-text]:focus-visible]:ring-2 md:has-[[data-state='true']]:bg-transparent [&:hover>[data-more-button]]:opacity-100"
    >
      <button
        onClick={onClick}
        data-space-text
        className="focus-visible:outline-none"
      >
        {_name}
      </button>
      <SpaceMoreButton
        isOpen={moreDropdownOpen}
        setIsOpen={setMoreDropdownOpen}
        onEdit={onClick}
        onDelete={() => {
          onDelete();
          return;
          if (!itemRef.current || width < 768) {
            onDelete();
            return;
          }
          //  const trash = document.querySelector("#trash")! as HTMLDivElement;
          //  const trashBin = document.querySelector("#trash-button")!;
          //  const trashRect = trashBin.getBoundingClientRect();
          //  const scopeRect = itemRef.current.getBoundingClientRect();
          //  const el = document.createElement("div");
          //  el.style.position = "fixed";
          //  el.style.top = "0";
          //  el.style.left = "0";
          //  el.style.width = "15px";
          //  el.style.height = "15px";
          //  el.style.backgroundColor = "var(--gray-7)";
          //  el.style.zIndex = "60";
          //  el.style.borderRadius = "50%";
          //  el.style.transform = "scale(5)";
          //  el.style.opacity = "0";
          //  trash.dataset["open"] = "true";
          //  const initial = {
          //    x: scopeRect.left + scopeRect.width / 2,
          //    y: scopeRect.top + scopeRect.height / 2,
          //  };
          //  const delta = {
          //    x:
          //      trashRect.left +
          //      trashRect.width / 2 -
          //      scopeRect.left +
          //      scopeRect.width / 2,
          //    y:
          //      trashRect.top +
          //      trashRect.height / 4 -
          //      scopeRect.top +
          //      scopeRect.height / 2,
          //  };
          //  const end = {
          //    x: trashRect.left + trashRect.width / 2,
          //    y: trashRect.top + trashRect.height / 4,
          //  };
          //  el.style.offsetPath = `path('M ${initial.x} ${initial.y} Q ${delta.x * 0.01} ${delta.y * 0.01} ${end.x} ${end.y}`;
          //  animateItem(itemRef.current, SpaceExitVariant, {
          //    duration: 0.2,
          //  }).then(() => {
          //    itemRef.current.style.scale = "0";
          //    onDelete();
          //  });
          //  document.body.appendChild(el);
          //  el.animate(
          //    {
          //      transform: ["scale(5)", "scale(1)"],
          //      opacity: [0, 0.3, 1],
          //    },
          //    {
          //      duration: 200,
          //      easing: "cubic-bezier(0.64, 0.57, 0.67, 1.53)",
          //      fill: "forwards",
          //    },
          //  );
          //  el.animate(
          //    {
          //      offsetDistance: ["0%", "100%"],
          //    },
          //    {
          //      duration: 2000,
          //      easing: "cubic-bezier(0.64, 0.57, 0.67, 1.53)",
          //      fill: "forwards",
          //      delay: 200,
          //    },
          //  ).onfinish = () => {
          //    el.animate(
          //      { transform: "scale(0)", opacity: 0 },
          //      { duration: 200, fill: "forwards" },
          //    ).onfinish = () => {
          //      el.remove();
          //    };
          //  };
        }}
      />
      {spaceMemories.length > 2 ? (
        <MemoryWithImages3
          onClick={onClick}
          className="h-24 w-24"
          id={id.toString()}
          images={
            spaceMemories
              .map((c) => (c.type === "note" ? "/note.svg" : c.image))
              .reverse() as string[]
          }
        />
      ) : spaceMemories.length > 1 ? (
        <MemoryWithImages2
          onClick={onClick}
          className="h-24 w-24"
          id={id.toString()}
          images={
            spaceMemories
              .map((c) => (c.type === "note" ? "/note.svg" : c.image))
              .reverse() as string[]
          }
        />
      ) : spaceMemories.length === 1 ? (
        <MemoryWithImage
          onClick={onClick}
          className="h-24 w-24"
          id={id.toString()}
          image={
            spaceMemories[0].type === "note"
              ? "/note.svg"
              : spaceMemories[0].image!
          }
        />
      ) : (
        <div
          onClick={onClick}
          className="bg-rgray-4 shadow- h-24 w-24 scale-50 rounded-full opacity-30"
        ></div>
      )}
    </motion.div>
  );
}

export function SpaceMoreButton({
  onDelete,
  isOpen,
  setIsOpen,
  onEdit,
}: {
  onDelete?: () => void;
  isOpen?: boolean;
  onEdit?: () => void;
  setIsOpen?: (open: boolean) => void;
}) {
  return (
    <DeleteConfirmation onDelete={onDelete} trigger={false}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            data-more-button
            className="hover:bg-rgray-3 focus-visible:bg-rgray-3 focus-visible:ring-rgray-7 absolute right-2 top-2 scale-0 rounded-md p-1 opacity-0 ring-transparent transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 md:block md:scale-100 md:bg-transparent"
          >
            <MoreHorizontal className="text-rgray-11 h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onEdit}>
            <Edit3 className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Edit
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="focus:bg-red-100 focus:text-red-400 dark:focus:bg-red-100/10">
              <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteConfirmation>
  );
}

export function PageMoreButton({
  onDelete,
  isOpen,
  setIsOpen,
  url,
  removeFromSpace,
}: {
  onDelete?: () => void;
  isOpen?: boolean;
  url: string;
  setIsOpen?: (open: boolean) => void;
  removeFromSpace?: () => Promise<void>;
}) {
  return (
    <DeleteConfirmation onDelete={onDelete} trigger={false}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            data-more-button
            className="hover:bg-rgray-3 focus-visible:bg-rgray-3 focus-visible:ring-rgray-7 absolute right-2 top-2 scale-0 rounded-md p-1 opacity-0 ring-transparent transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 md:block md:scale-100 md:bg-transparent"
          >
            <MoreHorizontal className="text-rgray-11 h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => window.open(url)}>
            <ArrowUpRight
              className="mr-2 h-4 w-4 scale-125"
              strokeWidth={1.5}
            />
            Open
          </DropdownMenuItem>
          {removeFromSpace && (
            <DropdownMenuItem onClick={removeFromSpace}>
              <Minus className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Remove from space
            </DropdownMenuItem>
          )}
          <DialogTrigger asChild>
            <DropdownMenuItem className="focus:bg-red-100 focus:text-red-400 dark:focus:bg-red-100/10">
              <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteConfirmation>
  );
}

export function NoteMoreButton({
  onDelete,
  isOpen,
  setIsOpen,
  onEdit,
  removeFromSpace,
}: {
  onDelete?: () => void;
  isOpen?: boolean;
  onEdit?: () => void;
  setIsOpen?: (open: boolean) => void;
  removeFromSpace?: () => Promise<void>;
}) {
  return (
    <DeleteConfirmation onDelete={onDelete} trigger={false}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            data-more-button
            className="hover:bg-rgray-3 focus-visible:bg-rgray-3 focus-visible:ring-rgray-7 absolute right-2 top-2 scale-0 rounded-md p-1 opacity-0 ring-transparent transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 md:block md:scale-100 md:bg-transparent"
          >
            <MoreHorizontal className="text-rgray-11 h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onEdit}>
            <Edit3 className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Edit
          </DropdownMenuItem>
          {removeFromSpace && (
            <DropdownMenuItem onClick={removeFromSpace}>
              <Minus className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Remove from space
            </DropdownMenuItem>
          )}
          <DialogTrigger asChild>
            <DropdownMenuItem className="focus:bg-red-100 focus:text-red-400 dark:focus:bg-red-100/10">
              <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteConfirmation>
  );
}

export function AddMemoryModal({
  type,
  children,
  defaultSpaces,
  onAdd,
  data,
}: {
  type: "page" | "note" | "space" | "existing-memory" | null;
  children?: React.ReactNode | React.ReactNode[];
  defaultSpaces?: number[];
  data?: {
    space?: {
      title: string;
      id: number;
    };
    fromSpaces?: number[];
    notInSpaces?: number[];
  };
  onAdd?: (data?: StoredSpace | StoredContent | StoredContent[]) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {children}
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const novel = document.querySelector('[contenteditable="true"]') as
            | HTMLDivElement
            | undefined;
          if (novel) {
            novel.autofocus = false;
            novel.onfocus = () => {
              (
                document.querySelector("[data-modal-autofocus]") as
                  | HTMLInputElement
                  | undefined
              )?.focus();
              novel.onfocus = null;
            };
          }
          (
            document.querySelector("[data-modal-autofocus]") as
              | HTMLInputElement
              | undefined
          )?.focus();
        }}
        className="w-max max-w-[auto]"
      >
        {type === "page" ? (
          <AddMemoryPage
            onAdd={onAdd}
            defaultSpaces={defaultSpaces}
            closeDialog={() => setIsDialogOpen(false)}
          />
        ) : type === "note" ? (
          <NoteAddPage
            onAdd={onAdd}
            defaultSpaces={defaultSpaces}
            closeDialog={() => setIsDialogOpen(false)}
          />
        ) : type === "space" ? (
          <SpaceAddPage
            onAdd={onAdd}
            closeDialog={() => setIsDialogOpen(false)}
          />
        ) : type === "existing-memory" ? (
          <AddExistingMemoryToSpace
            onAdd={onAdd}
            fromSpaces={data?.fromSpaces}
            notInSpaces={data?.notInSpaces}
            space={data!.space!}
            closeDialog={() => setIsDialogOpen(false)}
          />
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
}
