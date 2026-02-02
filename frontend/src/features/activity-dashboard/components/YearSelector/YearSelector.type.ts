export interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export interface YearSelectorActions {
  handleYearChange: (year: number) => void;
}

export interface UseYearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export interface UseYearSelectorResult {
  actions: YearSelectorActions;
}
