"use client";

import React from "react";
import { Icon } from "@/components/Icon";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  /** Error object or message */
  error: Error | string;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Optional className */
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className={`${styles.container} ${className ?? ""}`} role="alert">
      <Icon name="error" className={styles.icon} />
      <p className={styles.title}>Something went wrong</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          <Icon name="refresh" className={styles.retryIcon} />
          Try again
        </button>
      )}
    </div>
  );
}
