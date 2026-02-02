"use client";

import React from "react";
import Link from "next/link";
import { useGlobalHeader } from "./GlobalHeader.hook";
import { Subtitle } from "../Subtitle";
import styles from "./GlobalHeader.module.css";

export function GlobalHeader() {
  const { pathname, navigationLinks } = useGlobalHeader();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.avatar}>W</div>
        <div className={styles.name}>追风者 · Wind Chaser</div>
        <div className={styles.navContainer}>
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.aboutLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </header>
      <Subtitle />
    </>
  );
}
