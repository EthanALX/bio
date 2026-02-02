import type {
  YearSelectorActions,
  UseYearSelectorProps,
  UseYearSelectorResult,
} from './YearSelector.type';

export const useYearSelector = ({ onYearChange }: UseYearSelectorProps): UseYearSelectorResult => {
    const handleYearChange = (year: number) => {
        onYearChange(year);
    };

    return {
        actions: {
            handleYearChange,
        },
    };
};
