"use client";

import React from "react";
import styles from "./LoadingSkeleton.module.css";

interface LoadingSkeletonProps {
  /** Number of skeleton rows */
  rows?: number;
  /** Variant controls the visual pattern */
  variant?: "card" | "list" | "stat";
  /** Optional className for outer container */
  className?: string;
}

export function LoadingSkeleton({
  rows = 3,
  variant = "card",
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={`${styles.container} ${styles[variant]} ${className ?? ""}`}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={styles.line}
          style={{ width: i === rows - 1 ? "60%" : undefined }}
        />
      ))}
    </div>
  );
}
