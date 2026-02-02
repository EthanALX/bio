import { Activity } from "../../types";

export type ActivityLevel = 'level-0' | 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6' | 'level-7';

export interface GitHubDay {
  date: string;
  distance: number;
  level: ActivityLevel;
}

export interface GitHubWeek {
  days: (GitHubDay | null)[];
}

export interface GitHubMonth {
  name: string;
  startWeek: number;
  endWeek: number;
}

export interface GitHubCalendarProps {
  activities: Activity[];
  year: number;
}

export interface GitHubCalendarState {
  weeks: GitHubWeek[];
  months: GitHubMonth[];
  dayLabels: string[];
  dayLabelColors: string[][];
  dayLabelDates: string[];
}

export interface UseGitHubCalendarProps {
  activities: Activity[];
  year: number;
}

export interface UseGitHubCalendarResult {
  state: GitHubCalendarState;
}
