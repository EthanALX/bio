"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useActivities } from "@/features/homepage/hooks";
import { generateSvgPath } from "@/features/homepage/utils";
import styles from "./MapSection.module.css";

interface MapSectionProps {
  selectedYear?: number;
}

export function MapSection({ selectedYear }: MapSectionProps) {
  const { latestActivity } = useActivities(selectedYear);
  const pathRef = useRef<SVGPathElement>(null);

  const svgPath = latestActivity
    ? generateSvgPath(latestActivity.coordinates)
    : "";

  const endPointCoordinates = useMemo(() => {
    if (!latestActivity?.coordinates?.length) return null;
    const coords = latestActivity.coordinates;
    const last = coords[coords.length - 1];

    const minLng = Math.min(...coords.map(c => c.lng));
    const maxLng = Math.max(...coords.map(c => c.lng));
    const minLat = Math.min(...coords.map(c => c.lat));
    const maxLat = Math.max(...coords.map(c => c.lat));

    const lngRange = maxLng - minLng || 1;
    const latRange = maxLat - minLat || 1;
    const padding = 10;

    const x = padding + ((last.lng - minLng) / lngRange) * (100 - 2 * padding);
    const y = 100 - padding - ((last.lat - minLat) / latRange) * (100 - 2 * padding);

    return { x, y };
  }, [latestActivity]);

  useEffect(() => {
    const path = pathRef.current;
    if (path && svgPath) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.animation = "drawPath 3s ease forwards";
    }
  }, [svgPath]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.zoomControls}>
        <div className={styles.zoomButtonGroup}>
          <button className={styles.zoomButton}>
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className={styles.zoomButton}>
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>

      <svg className={styles.svgContainer} viewBox="0 0 100 100">
        {svgPath && (
          <path
            ref={pathRef}
            d={svgPath}
            className={styles.svgPath}
          />
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
