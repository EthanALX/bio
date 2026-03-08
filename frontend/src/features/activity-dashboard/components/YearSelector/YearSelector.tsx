import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { YearSelectorProps } from "./YearSelector.type";
import styles from "./YearSelector.module.css";

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={String(selectedYear)}
      onValueChange={(val) => {
        if (val) onYearChange(Number(val));
      }}
      className={styles.root}
      aria-label="Select year"
    >
      {years.map((year) => (
        <ToggleGroup.Item
          key={year}
          value={String(year)}
          className={styles.item}
          aria-label={String(year)}
        >
          {year}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
