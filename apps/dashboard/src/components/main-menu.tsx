"use client";

import { updateMenuAction } from "@/actions/update-menu-action";
import { useMenuStore } from "@/store/menu";
import { Button } from "@midday/ui/button";
import { cn } from "@midday/ui/cn";
import { Icons } from "@midday/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@midday/ui/tooltip";
import { useClickAway } from "@uidotdev/usehooks";
import {
  AnimatePresence,
  Reorder,
  motion,
  useMotionValue,
} from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLongPress } from "use-long-press";

const icons = {
  "/": () => <Icons.Overview size={22} />,
  "/analytics/category": () => <Icons.Category size={22} />,
  "/analytics/expense": () => <Icons.DashboardCustomize size={22} />,
  "/analytics/income": () => <Icons.BrokenImage size={22} />,
  "/analytics/location": () => <Icons.TrendingUp size={22} />,
  "/analytics/merchant": () => <Icons.BaseAnalytics size={22} />,
  "/insights": () => <Icons.Analytics size={22} />,
  "/transactions": () => <Icons.Transactions size={22} />,
  "/invoices": () => <Icons.Invoice size={22} />,
  "/tracker": () => <Icons.Tracker size={22} />,
  "/vault": () => <Icons.Files size={22} />,
  "/settings": () => <Icons.Settings size={22} />,
  "/inbox": () => <Icons.Inbox2 size={22} />,
};

type MenuItem = {
  path: string;
  name: string;
  beta: boolean;
};

const defaultItems: MenuItem[] = [
  {
    path: "/",
    name: "Overview",
    beta: false,
  },
  {
    path: "/inbox",
    name: "Inbox",
    beta: false,
  },
  {
    path: "/transactions",
    name: "Transactions",
    beta: false,
  },
  {
    path: "/invoices",
    name: "Invoices",
    beta: true,
  },
  {
    path: "/tracker",
    name: "Tracker",
    beta: false,
  },
  {
    path: "/vault",
    name: "Vault",
    beta: false,
  },
  // Analytics (Sub Navigation)
  {
    path: "/analytics/category",
    name: "Category Analytics",
    beta: true,
  },
  {
    path: "/analytics/expense",
    name: "Expense Analytics",
    beta: true,
  },
  {
    path: "/analytics/income",
    name: "Income Analytics",
    beta: true,
  },
  {
    path: "/analytics/location",
    name: "Location Analytics",
    beta: true,
  },
  {
    path: "/analytics/merchant",
    name: "Merchant Analytics",
    beta: true,
  },
  // Insights (Sub Navigation)
  {
    path: "/insights",
    name: "Financial Insights",
    beta: true,
  },
  // Solomon (Sub Navigation)
  // Stress Testing (Sub Navigation)
  {
    path: "/settings",
    name: "Settings",
    beta: false,
  },
];

const Item = ({
  item,
  isActive,
  isCustomizing,
  onRemove,
  disableRemove,
  onDragEnd,
  onSelect,
}) => {
  const y = useMotionValue(0);
  const Icon = icons[item.path];

  return (
    <TooltipProvider delayDuration={70}>
      <Link
        prefetch
        href={item.path}
        onClick={(evt) => {
          if (isCustomizing) {
            evt.preventDefault();
          }

          onSelect?.();
        }}
        onMouseDown={(evt) => {
          if (isCustomizing) {
            evt.preventDefault();
          }
        }}
      >
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Reorder.Item
              onDragEnd={onDragEnd}
              key={item.path}
              value={item}
              id={item.path}
              style={{ y }}
              layoutRoot
              className={cn(
                "relative rounded-lg border border-transparent md:w-[45px] h-[45px] flex items-center md:justify-center",
                "hover:bg-accent hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
                isActive &&
                "bg-[#F2F1EF] dark:bg-secondary border-[#DCDAD2] dark:border-[#2C2C2C]",
                isCustomizing &&
                "bg-background border-[#DCDAD2] dark:border-[#2C2C2C]"
              )}
            >
              <motion.div
                className="relative"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {!disableRemove && isCustomizing && (
                  <Button
                    onClick={() => onRemove(item.path)}
                    variant="ghost"
                    size="icon"
                    className="absolute -left-4 -top-4 w-4 h-4 p-0 rounded-full bg-border hover:bg-border hover:scale-150 z-10 transition-all"
                  >
                    <Icons.Remove className="w-3 h-3" />
                  </Button>
                )}

                <div
                  className={cn(
                    "flex space-x-3 p-0 items-center pl-2 md:pl-0",
                    isCustomizing &&
                    "animate-[jiggle_0.3s_ease-in-out_infinite] transform-gpu pointer-events-none"
                  )}
                >
                  <Icon />
                  <span className="flex md:hidden">{item.name}</span>
                </div>
              </motion.div>
            </Reorder.Item>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="px-3 py-1.5 text-xs hidden md:flex  rounded-2xl"
            sideOffset={10}
          >
            <div className="flex flex-1 gap-2">
              <span className="text-sm">
                {item.name}
              </span>
              {item.beta && (
                <span className="text-xs rounded-2xl bg-foreground text-background font-bold px-2 py-1">
                  Beta
                </span>
              )}
            </div>

          </TooltipContent>
        </Tooltip>
      </Link>
    </TooltipProvider>
  );
};

const listVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const CollapsibleSubMenu = ({ isOpen, toggle, children }) => (
  <div>
    <Button onClick={toggle} className="px-4 py-2 w-fit text-left font-bold rounded-sm bg-background text-foreground" variant={"outline"}>
      <span>{isOpen ? '▲' : '▼'}</span>
    </Button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 flex flex-col gap-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);


export function MainMenu({ initialItems, onSelect }) {
  const [items, setItems] = useState<Array<MenuItem>>(initialItems ?? defaultItems);
  const { isCustomizing, setCustomizing } = useMenuStore();
  const pathname = usePathname();
  const part = pathname?.split("/")[1];
  const updateMenu = useAction(updateMenuAction);
  const [isAnalyticsOpen, setAnalyticsOpen] = useState(false);

  const hiddenItems = defaultItems.filter(
    (item) => !items.some((i) => i.path === item.path)
  );


  const onReorder = (items) => {
    setItems(items);
  };

  const onDragEnd = () => {
    updateMenu.execute(items);
  };

  const onRemove = (path: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.path !== path));
    updateMenu.execute(items.filter((item) => item.path !== path));
  };

  const onAdd = (item) => {
    const updatedItems = [...items, item];
    setItems(updatedItems);
    updateMenu.execute(updatedItems);
  };

  const bind = useLongPress(
    () => {
      setCustomizing(true);
    },
    {
      cancelOnMovement: 0,
    }
  );

  const ref = useClickAway<HTMLDivElement>(() => {
    setCustomizing(false);
  });

  const toggleAnalytics = () => setAnalyticsOpen(prev => !prev);

  // Separate analytics items from other items
  const analyticsKeywords = ["/analytics"];
  const analyticsItems = items.filter(item =>
    analyticsKeywords.some(keyword => item.path.includes(keyword))
  );

  const otherItems = items.filter(item =>
    !analyticsKeywords.some(keyword => item.path.includes(keyword))
  );


  return (
    <div className="mt-6" {...bind()} ref={ref}>
      <AnimatePresence>
        <nav>
          <Reorder.Group
            axis="y"
            onReorder={onReorder}
            values={items}
            className="flex flex-col gap-1.5"
          >
            {otherItems.map((item) => {
              const isActive =
                (pathname === "/" && item.path === "/") ||
                (pathname !== "/" && item.path.startsWith(`/${part}`));



              return (
                <Item
                  key={item.path}
                  item={item}
                  isActive={isActive}
                  isCustomizing={isCustomizing}
                  onRemove={onRemove}
                  disableRemove={items.length === 1}
                  onDragEnd={onDragEnd}
                  onSelect={onSelect}
                />
              );
            })}
            {analyticsItems.length > 0 && (
              <CollapsibleSubMenu isOpen={isAnalyticsOpen} toggle={toggleAnalytics}>
                {analyticsItems.map((item) => {
                  return (
                    <Item
                      key={item.path}
                      item={item}
                      isActive={false}
                      isCustomizing={isCustomizing}
                      onRemove={onRemove}
                      disableRemove={analyticsItems.length === 1}
                      onDragEnd={onDragEnd}
                      onSelect={onSelect}
                    />
                  )
                }
                )}
              </CollapsibleSubMenu>
            )}
          </Reorder.Group>
        </nav>
      </AnimatePresence>

      {hiddenItems.length > 0 && isCustomizing && (
        <nav className="border-t-[1px] mt-6 pt-6">
          <motion.ul
            variants={listVariant}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1.5"
          >
            {hiddenItems.map((item) => {
              const Icon = icons[item.path];

              return (
                <motion.li
                  variants={itemVariant}
                  key={item.path}
                  className={cn(
                    "rounded-lg border border-transparent w-[45px] h-[45px] flex items-center md:justify-center",
                    "hover:bg-secondary hover:border-[#DCDAD2] hover:dark:border-[#2C2C2C]",
                    "bg-background border-[#DCDAD2] dark:border-[#2C2C2C]"
                  )}
                >
                  <div className="relative">
                    <Button
                      onClick={() => onAdd(item)}
                      variant="ghost"
                      size="icon"
                      className="absolute -left-4 -top-4 w-4 h-4 p-0 rounded-full bg-border hover:bg-border hover:scale-150 z-10 transition-all"
                    >
                      <Icons.Add className="w-3 h-3" />
                    </Button>

                    <Icon />
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>
      )}
    </div>
  );
}
