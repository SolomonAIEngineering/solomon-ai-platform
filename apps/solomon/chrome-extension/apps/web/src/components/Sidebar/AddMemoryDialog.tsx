import { Editor } from "novel";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef, useState } from "react";
import { FilterMemories, FilterSpaces } from "./FilterCombobox";
import { useMemory } from "@/contexts/MemoryContext";
import { Loader, Plus, X } from "lucide-react";
import { StoredContent, StoredSpace } from "@/server/db/schema";
import { cleanUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { getMetaData } from "@/server/helpers";

export function AddMemoryPage({
  closeDialog,
  defaultSpaces,
  onAdd,
}: {
  closeDialog: () => void;
  defaultSpaces?: number[];
  onAdd?: (addedData: StoredContent) => void;
}) {
  const { addMemory } = useMemory();

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedSpacesId, setSelectedSpacesId] = useState<number[]>(
    defaultSpaces ?? [],
  );

  return (
    <div className="w-[80vw] max-w-[80vw] md:w-[40vw]">
      <DialogHeader>
        <DialogTitle>Add a web page to memory</DialogTitle>
        <DialogDescription>
          This will fetch the content of the web page and add it to the memory
        </DialogDescription>
      </DialogHeader>
      <Label className="mt-5 block">URL</Label>
      <Input
        placeholder="Enter the URL of the page"
        type="url"
        data-modal-autofocus
        className="bg-rgray-4 mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
      />
      <DialogFooter>
        <FilterSpaces
          selectedSpaces={selectedSpacesId}
          setSelectedSpaces={setSelectedSpacesId}
          className="hover:bg-rgray-5 mr-auto bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
          name={"Spaces"}
          disabled={loading}
        />
        <button
          type={"submit"}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const metadata = await getMetaData(url);
            const data = await addMemory(
              {
                title: metadata.title,
                description: metadata.description,
                content: "",
                type: "page",
                url: url,
                image: metadata.image,
                savedAt: new Date(),
              },
              selectedSpacesId,
            );
            if (data) onAdd?.(data.memory);
            closeDialog();
          }}
          className="bg-rgray-4 hover:bg-rgray-5 focus-visible:bg-rgray-5 focus-visible:ring-rgray-7 relative rounded-md px-4 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <motion.div
            initial={{ x: "-50%", y: "-100%" }}
            animate={loading && { y: "-50%", x: "-50%", opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0"
          >
            <Loader className="text-rgray-11 h-5 w-5 animate-spin" />
          </motion.div>
          <motion.div
            initial={{ y: "0%" }}
            animate={loading && { opacity: 0, y: "30%" }}
          >
            Add
          </motion.div>
        </button>
        <DialogClose
          disabled={loading}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 focus-visible:ring-rgray-7 rounded-md px-3 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

export function NoteAddPage({
  closeDialog,
  defaultSpaces,
  onAdd,
}: {
  closeDialog: () => void;
  defaultSpaces?: number[];
  onAdd?: (addedData: StoredContent) => void;
}) {
  const { addMemory } = useMemory();

  const [selectedSpacesId, setSelectedSpacesId] = useState<number[]>(
    defaultSpaces ?? [],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  function check(): boolean {
    const data = {
      name: name.trim(),
      content,
    };
    if (!data.name || data.name.length < 1) {
      if (!inputRef.current) {
        alert("Please enter a name for the note");
        return false;
      }
      inputRef.current.value = "";
      inputRef.current.placeholder = "Please enter a title for the note";
      inputRef.current.dataset["error"] = "true";
      setTimeout(() => {
        inputRef.current!.placeholder = "Title of the note";
        inputRef.current!.dataset["error"] = "false";
      }, 500);
      inputRef.current.focus();
      return false;
    }
    return true;
  }

  return (
    <div className="w-[80vw] md:w-auto">
      <Input
        ref={inputRef}
        data-error="false"
        className="w-full border-none p-0 text-xl ring-0 placeholder:text-white/30 placeholder:transition placeholder:duration-500 focus-visible:ring-0 data-[error=true]:placeholder:text-red-400"
        placeholder="Title of the note"
        data-modal-autofocus
        value={name}
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
      />
      <Editor
        disableLocalStorage
        defaultValue={""}
        onUpdate={(editor) => {
          if (!editor) return;
          setContent(editor.storage.markdown.getMarkdown());
        }}
        extensions={[Markdown]}
        className="novel-editor bg-rgray-4 border-rgray-7 dark mt-5 max-h-[60vh] min-h-[40vh] w-full overflow-y-auto rounded-lg border md:w-[50vw] [&>div>div]:p-5"
      />
      <DialogFooter>
        <FilterSpaces
          selectedSpaces={selectedSpacesId}
          setSelectedSpaces={setSelectedSpacesId}
          className="hover:bg-rgray-5 mr-auto bg-white/5"
          name={"Spaces"}
        />
        <button
          onClick={() => {
            if (check()) {
              setLoading(true);
              addMemory(
                {
                  content,
                  title: name,
                  type: "note",
                  url: `https://notes.supermemory.dhr.wtf/`,
                  image: "",
                  savedAt: new Date(),
                },
                selectedSpacesId,
              ).then((data) => {
                if (data?.memory) onAdd?.(data.memory);
                closeDialog();
              });
            }
          }}
          disabled={loading}
          className="bg-rgray-4 hover:bg-rgray-5 focus-visible:bg-rgray-5 focus-visible:ring-rgray-7 relative rounded-md px-4 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <motion.div
            initial={{ x: "-50%", y: "-100%" }}
            animate={loading && { y: "-50%", x: "-50%", opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0"
          >
            <Loader className="text-rgray-11 h-5 w-5 animate-spin" />
          </motion.div>
          <motion.div
            initial={{ y: "0%" }}
            animate={loading && { opacity: 0, y: "30%" }}
          >
            Add
          </motion.div>
        </button>
        <DialogClose
          type={undefined}
          disabled={loading}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 focus-visible:ring-rgray-7 rounded-md px-3 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

export function SpaceAddPage({
  closeDialog,
  onAdd,
}: {
  closeDialog: () => void;
  onAdd?: (addedData: StoredSpace) => void;
}) {
  const { addSpace } = useMemory();

  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<StoredContent[]>([]);

  function check(): boolean {
    const data = {
      name: name.trim(),
    };
    if (!data.name || data.name.length < 1) {
      if (!inputRef.current) {
        alert("Please enter a name for the note");
        return false;
      }
      inputRef.current.value = "";
      inputRef.current.placeholder = "Please enter a title for the space";
      inputRef.current.dataset["error"] = "true";
      setTimeout(() => {
        inputRef.current!.placeholder = "Enter the name of the space";
        inputRef.current!.dataset["error"] = "false";
      }, 500);
      inputRef.current.focus();
      return false;
    }
    return true;
  }

  return (
    <div className="w-[80vw] md:w-[40vw]">
      <DialogHeader>
        <DialogTitle>Add a space</DialogTitle>
      </DialogHeader>
      <Label className="mt-5 block">Name</Label>
      <Input
        ref={inputRef}
        placeholder="Enter the name of the space"
        type="url"
        data-modal-autofocus
        value={name}
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
        className="bg-rgray-4 mt-2 w-full placeholder:transition placeholder:duration-500 data-[error=true]:placeholder:text-red-400 focus-visible:data-[error=true]:ring-red-500/10"
      />
      {selected.length > 0 && (
        <>
          <Label className="mt-5 block">Add Memories</Label>
          <div className="flex min-h-5 flex-col items-center justify-center py-2">
            {selected.map((i) => (
              <MemorySelectedItem
                key={i.id}
                onRemove={() =>
                  setSelected((prev) => prev.filter((p) => p.id !== i.id))
                }
                {...i}
              />
            ))}
          </div>
        </>
      )}
      <DialogFooter>
        <FilterMemories
          selected={selected}
          setSelected={setSelected}
          disabled={loading}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 mr-auto bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Plus className="h-5 w-5" />
          Memory
        </FilterMemories>
        <button
          type={undefined}
          onClick={() => {
            if (check()) {
              setLoading(true);
              addSpace(
                name,
                selected.map((s) => s.id),
              ).then((data) => {
                if (data) onAdd?.(data.space);
                closeDialog();
              });
            }
          }}
          disabled={loading}
          className="bg-rgray-4 hover:bg-rgray-5 focus-visible:bg-rgray-5 focus-visible:ring-rgray-7 relative rounded-md px-4 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <motion.div
            initial={{ x: "-50%", y: "-100%" }}
            animate={loading && { y: "-50%", x: "-50%", opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0"
          >
            <Loader className="text-rgray-11 h-5 w-5 animate-spin" />
          </motion.div>
          <motion.div
            initial={{ y: "0%" }}
            animate={loading && { opacity: 0, y: "30%" }}
          >
            Add
          </motion.div>
        </button>
        <DialogClose
          disabled={loading}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 focus-visible:ring-rgray-7 rounded-md px-3 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

export function MemorySelectedItem({
  id,
  title,
  url,
  type,
  image,
  onRemove,
}: StoredContent & { onRemove: () => void }) {
  return (
    <div className="hover:bg-rgray-4 focus-within-bg-rgray-4 flex w-full items-center justify-start gap-2 rounded-md p-2 px-3 text-sm [&:hover_[data-icon]]:block [&:hover_img]:hidden">
      <button
        onClick={onRemove}
        className="ring-rgray-7 ring-offset-rgray-3 m-0 h-5 w-5 rounded-sm p-0 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 [&:focus-visible>[data-icon]]:block [&:focus-visible>img]:hidden"
      >
        <img
          src={
            type === "note"
              ? "/note.svg"
              : image ?? "/icons/logo_without_bg.png"
          }
          className="h-5 w-5"
        />
        <X data-icon className="hidden h-5 w-5 scale-90" />
      </button>
      <span>{title}</span>
      <span className="ml-auto block opacity-50">
        {type === "note" ? "Note" : cleanUrl(url)}
      </span>
    </div>
  );
}

export function AddExistingMemoryToSpace({
  space,
  closeDialog,
  fromSpaces,
  notInSpaces,
  onAdd,
}: {
  space: { title: string; id: number };
  closeDialog: () => void;
  fromSpaces?: number[];
  notInSpaces?: number[];
  onAdd?: () => void;
}) {
  const { addMemoriesToSpace } = useMemory();

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<StoredContent[]>([]);

  return (
    <div className="w-[80vw] md:w-[40vw]">
      <DialogHeader>
        <DialogTitle>Add an existing memory to {space.title}</DialogTitle>
        <DialogDescription>
          Pick the memories you want to add to this space
        </DialogDescription>
      </DialogHeader>
      {selected.length > 0 && (
        <>
          <Label className="mt-5 block">Add Memories</Label>
          <div className="flex min-h-5 flex-col items-center justify-center py-2">
            {selected.map((i) => (
              <MemorySelectedItem
                key={i.id}
                onRemove={() =>
                  setSelected((prev) => prev.filter((p) => p.id !== i.id))
                }
                {...i}
              />
            ))}
          </div>
        </>
      )}
      <DialogFooter>
        <FilterMemories
          selected={selected}
          setSelected={setSelected}
          disabled={loading}
          fromSpaces={fromSpaces}
          notInSpaces={notInSpaces}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 mr-auto bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Plus className="h-5 w-5" />
          Memory
        </FilterMemories>
        <button
          type={undefined}
          onClick={() => {
            setLoading(true);
            addMemoriesToSpace(
              space.id,
              selected.map((i) => i.id),
            ).then(() => {
              onAdd?.();
              closeDialog();
            });
          }}
          disabled={loading}
          className="bg-rgray-4 hover:bg-rgray-5 focus-visible:bg-rgray-5 focus-visible:ring-rgray-7 relative rounded-md px-4 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <motion.div
            initial={{ x: "-50%", y: "-100%" }}
            animate={loading && { y: "-50%", x: "-50%", opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-100%] opacity-0"
          >
            <Loader className="text-rgray-11 h-5 w-5 animate-spin" />
          </motion.div>
          <motion.div
            initial={{ y: "0%" }}
            animate={loading && { opacity: 0, y: "30%" }}
          >
            Add
          </motion.div>
        </button>
        <DialogClose
          disabled={loading}
          className="hover:bg-rgray-4 focus-visible:bg-rgray-4 focus-visible:ring-rgray-7 rounded-md px-3 py-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
