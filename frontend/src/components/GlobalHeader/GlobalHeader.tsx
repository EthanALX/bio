"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./GlobalHeader.module.css";

export function GlobalHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.avatar}>E</div>
      <div className={styles.headerText}>
        <p className={styles.subtitle}>
          如果想跑步，一公里就好，如果想体验不一样的人生，去跑场马拉松
          --艾米尔·扎托佩克
        </p>
      </div>
      <div className={styles.navContainer}>
        {pathname === "/about" ? (
          <Link href="/" className={styles.aboutLink}>
            Running Stats
          </Link>
        ) : (
          <Link href="/about" className={styles.aboutLink}>
            about me
          </Link>
        )}
      </div>
    </header>
  );
}
