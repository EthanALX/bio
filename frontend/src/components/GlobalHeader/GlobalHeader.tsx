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
        <div className={styles.avatar}>W</div>
        <div className={styles.name}>追风者 · Wind Chaser</div>
        <div className={styles.navContainer}>
          {pathname === "/about" ? (
            <Link href="/" className={styles.aboutLink}>
              Running Stats
            </Link>
          ) : (
            <Link href="/about" className={styles.aboutLink}>
              About Me
            </Link>
          )}
        </div>
      </header>
      <Subtitle />
    </>
  );
}
