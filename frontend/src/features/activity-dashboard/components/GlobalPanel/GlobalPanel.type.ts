import { GlobalStats } from "../../api";

export interface GlobalPanelProps {
  globalStats: GlobalStats | null;
  isLoading?: boolean;
}

export interface GlobalPanelState {
  globalStats: GlobalStats | null;
  isLoading: boolean;
}

export interface UseGlobalPanelProps {
  globalStats: GlobalStats | null;
  isLoading?: boolean;
}

export interface UseGlobalPanelResult {
  state: GlobalPanelState;
}
