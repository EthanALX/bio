import { usePathname } from "next/navigation";
import type { SubtitleState } from "./Subtitle.type";

const HIDDEN_PATHS = ["/about"];

export const useSubtitle = (): SubtitleState => {
  const pathname = usePathname();

  const shouldRender = !HIDDEN_PATHS.includes(pathname);

  return {
    shouldRender,
  };
};
