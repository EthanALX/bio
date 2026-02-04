"use client";

import React from "react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="#" className={styles.link}>
          Privacy
        </a>
        <a href="#" className={styles.link}>
          Terms
        </a>
        <a href="#" className={styles.link}>
          Data Export
        </a>
      </div>
      <p className={styles.copyright}>
        © 2025 RunningOS v2.0. All systems nominal.
      </p>
    </footer>
  );
}
