import { Activity } from "../../types";

export interface FormattedActivity {
  id: string;
  distance: string;
  pace: string;
  bpm: number;
  time: string;
  route: string;
  coordinates?: Array<{ lat: number; lng: number }>;
  dateDisplay: string;
}

export interface ActivityListProps {
  activities: Activity[];
  columnWidths?: {
    distance?: string;
    pace?: string;
    bpm?: string;
    time?: string;
    route?: string;
    date?: string;
  };
}

export interface UseActivityListProps {
  activities: Activity[];
}

export interface UseActivityListResult {
  state: {
    formattedActivities: FormattedActivity[];
  };
}
