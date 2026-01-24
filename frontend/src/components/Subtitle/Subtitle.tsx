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
    <p className={styles.subtitle}>
      如果想跑步，一公里就好，如果想体验不一样的人生，去跑场马拉松
      --艾米尔·扎托佩克
    </p>
  );
}