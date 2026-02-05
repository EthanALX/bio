"use client";

import React from "react";
import type { FooterProps } from "./Footer.type";
import styles from "./Footer.module.css";

export function Footer(_props: FooterProps) {
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
