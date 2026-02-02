"use client";

import React from "react";
import { useRouteSketch } from "./RouteSketch.hook";
import type { RouteSketchProps } from "./RouteSketch.type";
import styles from "./RouteSketch.module.css";

export function RouteSketch({ coordinates, seed }: RouteSketchProps) {
  const { pathData } = useRouteSketch({ coordinates, seed });

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 100 40" className={styles.svg}>
        <path
          d={pathData}
          fill="none"
          className={styles.path}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
