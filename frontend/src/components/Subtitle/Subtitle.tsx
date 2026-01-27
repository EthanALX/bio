"use client";

import React from "react";
import { usePathname } from "next/navigation";
import styles from "./Subtitle.module.css";

export function Subtitle() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  return (
    <div className={styles.subtitle}>
      <span className={styles.quote}>
        如果想跑步，<span className={styles.highlight}>一公里</span>就好，如果想体验不一样的人生，去跑场<span className={styles.highlight}>马拉松</span>
      </span>
      <span className={styles.author}>— 艾米尔·扎托佩克</span>
    </div>
  );
}