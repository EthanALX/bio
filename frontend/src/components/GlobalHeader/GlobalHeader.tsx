"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Subtitle } from "../Subtitle";
import styles from "./GlobalHeader.module.css";

export function GlobalHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.avatar}>E</div>
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
      <Subtitle />
    </>
  );
}
