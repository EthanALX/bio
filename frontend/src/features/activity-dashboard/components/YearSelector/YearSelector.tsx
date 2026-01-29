import React from "react";
import { useYearSelector } from "./YearSelector.hook";
import styles from "./YearSelector.module.css";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearSelector(props: YearSelectorProps) {
  const { actions } = useYearSelector(props);
  const { handleYearChange } = actions;
  console.log("ye", props.selectedYear);

  return (
    <div className={styles.container}>
      <div className={styles.yearList}>
        {props.years.map((year) => (
          <div
            key={year}
            className={`${styles.yearBlock} ${year === props.selectedYear ? styles.active : ""}`}
            onClick={() => handleYearChange(year)}
          >
            {year
              .toString()
              .split("")
              .map((char, index) => (
                <span
                  key={index}
                  className={styles.yearChar}
                  style={{
                    transitionDelay: `${index * 0.05}s`,
                  }}
                >
                  {char}
                </span>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
