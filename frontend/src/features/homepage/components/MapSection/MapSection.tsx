"use client";

import React, { useEffect, useRef } from "react";
import { useMapSection } from "./MapSection.hook";
import type { MapSectionProps } from "./MapSection.type";
import styles from "./MapSection.module.css";

export function MapSection(props: MapSectionProps) {
  const { data, actions } = useMapSection(props);
  const { latestActivity, svgPath, endPointCoordinates } = data;
  const { handlePathRef } = actions;

  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (path && svgPath) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.animation = "drawPath 3s ease forwards";
    }
  }, [svgPath, handlePathRef]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.zoomControls}>
        <div className={styles.zoomButtonGroup}>
          <button className={styles.zoomButton}>
            <span className="material-symbols-outlined">+</span>
          </button>
          <button className={styles.zoomButton}>
            <span className="material-symbols-outlined">-</span>
          </button>
        </div>
      </div>

      <svg className={styles.svgContainer} viewBox="0 0 100 100">
        {svgPath && (
          <path ref={handlePathRef} d={svgPath} className={styles.svgPath} />
        )}
        {endPointCoordinates && (
          <circle
            cx={endPointCoordinates.x}
            cy={endPointCoordinates.y}
            r="1.5"
            className={styles.point}
          />
        )}
      </svg>

      <div className={styles.badge}>
        <div className={styles.badgeIcon}>
          <span className={styles.badgeDotPing} />
          <span className={styles.badgeDot} />
        </div>
        <div className={styles.badgeText}>
          <p className={styles.badgeLabel}>最新活动</p>
          <p className={styles.badgeRoute}>
            {latestActivity?.route || "暂无活动"} -{" "}
            {latestActivity?.distance
              ? `${latestActivity.distance.toFixed(2)}km`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
