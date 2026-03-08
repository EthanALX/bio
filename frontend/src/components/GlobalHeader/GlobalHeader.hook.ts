import { usePathname } from "next/navigation";
import type {
  GlobalHeaderState,
  GlobalHeaderActions,
  NavigationLink,
} from "./GlobalHeader.type";

const NAVIGATION_CONFIG: Record<string, NavigationLink[]> = {
  "/": [
    { href: "/about", label: "关于我" },
    // { href: "/showcase", label: "组件展示" },
  ],
  "/about": [
    { href: "/", label: "首页" },
    // { href: "/homepage", label: "首页" },
    // { href: "/showcase", label: "组件展示" },
  ],
  "/showcase": [
    { href: "/", label: "跑步统计" },
    { href: "/about", label: "关于我" },
  ],
};

export const useGlobalHeader = (): GlobalHeaderState & GlobalHeaderActions => {
  const pathname = usePathname();

  const getActivePageLabel = (): string => {
    if (pathname === "/") return "跑步统计";
    if (pathname === "/about") return "关于我";
    if (pathname === "/showcase") return "组件展示";
    return "未知";
  };

  const navigationLinks = NAVIGATION_CONFIG[pathname] || NAVIGATION_CONFIG["/"];

  return {
    pathname,
    navigationLinks,
    getActivePageLabel,
  };
};
