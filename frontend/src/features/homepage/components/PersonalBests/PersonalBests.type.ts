export interface PersonalBestsProps {
  selectedYear?: number;
}

export interface PersonalBestItem {
  event: string;
  time: string;
}

export interface PersonalBestsData {
  pbs: PersonalBestItem[];
}

export interface UsePersonalBestsProps {
  selectedYear?: number;
}

export interface UsePersonalBestsResult {
  data: PersonalBestsData;
}
