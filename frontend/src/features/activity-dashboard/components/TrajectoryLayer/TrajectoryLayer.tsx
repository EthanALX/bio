import React from "react";
import { Activity } from "../../types";
import { useTrajectoryLayer } from "./TrajectoryLayer.hook";
import styles from "./TrajectoryLayer.module.css";

interface TrajectoryLayerProps {
  activities: Activity[];
  isVisible?: boolean;
}

export function TrajectoryLayer({
  activities,
  isVisible = true,
}: TrajectoryLayerProps) {
  // Use the hook to process activities and generate trajectories
  const { projectedTrajectories } = useTrajectoryLayer(activities);

  const containerClasses = [
    styles.container,
    isVisible ? styles.visible : styles.hidden,
  ].join(" ");

  return (
    <div className={containerClasses}>
      <svg
        className={styles.svg}
        viewBox="0 0 150 150"
        preserveAspectRatio="xMidYMid meet"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <g className={styles.trajectoryLayer}>
          {projectedTrajectories.map((trajectory) => (
            <polyline
              key={`trajectory-${trajectory.id}`}
              points={trajectory.points}
              className={styles.trajectoryPath}
              fill="none"
              stroke={trajectory.color}
              style={
                {
                  color: trajectory.color,
                  filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))",
                } as React.CSSProperties
              }
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              opacity={1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
