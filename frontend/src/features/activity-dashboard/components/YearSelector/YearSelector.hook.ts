export interface UseYearSelectorProps {
    years: number[];
    selectedYear: number;
    onYearChange: (year: number) => void;
}

export interface UseYearSelectorResult {
    actions: {
        handleYearChange: (year: number) => void;
    };
}

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
