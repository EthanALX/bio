import { Activity } from "../../types";

export interface CalendarDay {
  day: number;
  date: string;
  hasActivity: boolean;
  distance?: number;
  level: number;
}

export interface CalendarWeek {
  weekNumber: number;
  days: (CalendarDay | null)[];
}

export interface CalendarMonth {
  name: string;
  weeks: CalendarWeek[];
}

export interface ActivityCalendarProps {
  activities: Activity[];
  year: number;
}

export interface ActivityCalendarState {
  months: CalendarMonth[];
}

export interface UseActivityCalendarProps {
  activities: Activity[];
  year: number;
}

export interface UseActivityCalendarResult {
  state: {
    months: CalendarMonth[];
  };
}
