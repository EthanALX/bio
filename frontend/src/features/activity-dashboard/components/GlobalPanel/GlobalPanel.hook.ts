import type {
  UseGlobalPanelProps,
  UseGlobalPanelResult,
  GlobalPanelState,
} from "./GlobalPanel.type";

export const useGlobalPanel = ({
  globalStats,
  isLoading = false,
}: UseGlobalPanelProps): UseGlobalPanelResult => {
  const state: GlobalPanelState = {
    globalStats,
    isLoading,
  };

  return {
    state,
  };
};
