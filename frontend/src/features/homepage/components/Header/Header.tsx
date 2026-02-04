"use client";

import React from "react";
import styles from "./Header.module.css";

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
const CURRENT_YEAR = 2024;

interface HeaderProps {
  selectedYear?: number;
  onYearChange: (year: number | undefined) => void;
}

export function Header({ selectedYear, onYearChange }: HeaderProps) {
  const activeYear = selectedYear ?? CURRENT_YEAR;

  const handleYearClick = (year: number) => {
    if (year === CURRENT_YEAR) {
      onYearChange(undefined);
    } else {
      onYearChange(year);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.iconBox}>
            <span className="material-symbols-outlined">terminal</span>
          </div>
          <h1 className={styles.title}>
            Running<span className={styles.titlePrimary}>OS</span>
            <span className={styles.titleVersion}>v2.0</span>
          </h1>
        </div>

        <nav className={styles.nav}>
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              className={
                year === activeYear ? styles.navItemActive : styles.navItem
              }
            >
              {year}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.iconButton}>
            <span className="material-symbols-outlined">settings</span>
          </button>

          <button className={styles.notificationButton}>
            <span className="material-symbols-outlined">notifications</span>
            <span className={styles.notificationDotPing} />
            <span className={styles.notificationDot} />
          </button>

          <div className={styles.avatar}>
            <div className={styles.avatarInner}>
              <div
                className={styles.avatarImage}
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPQvYKlZ68vwXRnPjsPPKdpvjNiWIcNEB5MQuCjNCWKXCQrRm-6GF2r89aG_aL8fFiJIN9dqg1DkRJjulKPSnO0I5HSSvp_HQEv2vH7FfSO5Y9vTVJBDPp3awRLgDZY6jrAq-HZ2gYozzRAUB7z_D5Nw0nWwJcai1Q1R3-bSXRLBhcY7mJOxitHaR5Dg9xU0RdyFxa0yMdJe5V0-0dCGr013ycR-cWyRRuGbNjdKI96cGAj6RdKQrZGradXKDgZ5Kxn4VvexMPhKtn')",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
