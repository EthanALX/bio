"use client";

import React from "react";
import { Icon } from "@/components/Icon";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  /** Icon name from Material Symbols */
  icon?: string;
  /** Primary message */
  title: string;
  /** Secondary description */
  description?: string;
  /** Optional action element (button, link, etc.) */
  action?: React.ReactNode;
  /** Optional className */
  className?: string;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <Icon name={icon} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
