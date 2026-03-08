import { Activity } from "../../types";

export interface FormattedActivity {
  id: string;
  distance: string;
  distanceNum: number;
  pace: string;
  paceSeconds: number;
  bpm: number;
  time: string;
  route: string;
  coordinates?: Array<{ lat: number; lng: number }>;
  dateDisplay: string;
  dateISO: string;
}

export interface ActivityListProps {
  activities: Activity[];
}

export type SortField = "distance" | "pace" | "bpm" | "time" | "date";
export type SortDir = "asc" | "desc";

export interface ActivityListState {
  formattedActivities: FormattedActivity[];
  sorted: FormattedActivity[];
  sortField: SortField;
  sortDir: SortDir;
  selectedActivity: FormattedActivity | null;
  dialogOpen: boolean;
}

export interface ActivityListActions {
  handleSort: (field: SortField) => void;
  handleRowClick: (activity: FormattedActivity) => void;
  handleDialogClose: () => void;
}

export interface UseActivityListProps {
  activities: Activity[];
}

export interface UseActivityListResult {
  state: ActivityListState;
  actions: ActivityListActions;
}
