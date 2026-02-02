import { usePathname } from "next/navigation";
import type {
  GlobalHeaderState,
  GlobalHeaderActions,
  NavigationLink,
} from "./GlobalHeader.type";

const NAVIGATION_CONFIG: Record<string, NavigationLink[]> = {
  "/": [
    { href: "/about", label: "About Me" },
    // { href: "/showcase", label: "Components" },
  ],
  "/about": [
    { href: "/", label: "Running Stats" },
    // { href: "/showcase", label: "Components" },
  ],
  "/showcase": [
    { href: "/", label: "Running Stats" },
    { href: "/about", label: "About Me" },
  ],
};

export const useGlobalHeader = (): GlobalHeaderState & GlobalHeaderActions => {
  const pathname = usePathname();

  const getActivePageLabel = (): string => {
    if (pathname === "/") return "Running Stats";
    if (pathname === "/about") return "About Me";
    if (pathname === "/showcase") return "Components";
    return "Unknown";
  };

  const navigationLinks = NAVIGATION_CONFIG[pathname] || NAVIGATION_CONFIG["/"];

  return {
    pathname,
    navigationLinks,
    getActivePageLabel,
  };
};
