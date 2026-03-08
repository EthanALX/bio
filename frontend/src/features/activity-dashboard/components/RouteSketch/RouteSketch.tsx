"use client";

import React from "react";
import { useRouteSketch } from "./RouteSketch.hook";
import type { RouteSketchProps } from "./RouteSketch.type";
import styles from "./RouteSketch.module.css";

export function RouteSketch({ coordinates, seed, width, height }: RouteSketchProps) {
  const { pathData } = useRouteSketch({ coordinates, seed });

  const vw = width ?? 100;
  const vh = height ?? 40;

  return (
    <div className={styles.container} style={width ? { width, height: vh } : undefined}>
      <svg viewBox={`0 0 ${vw} ${vh}`} className={styles.svg} width={width} height={height}>
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
