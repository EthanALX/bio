import { useMemo } from "react";
import { Activity } from "../../types";
import { getDistanceColor } from "../utils/colorMapping";

interface ProjectedTrajectory {
  id: string;
  points: string;
  color: string;
  distance: number;
}

// Predefined route patterns to simulate different running routes
const ROUTE_PATTERNS = [
  // Small loop
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY}`,
      `${baseX + 8},${baseY - 4}`,
      `${baseX + 15},${baseY}`,
      `${baseX + 15},${baseY + 8}`,
      `${baseX + 8},${baseY + 12}`,
      `${baseX},${baseY + 8}`,
      `${baseX},${baseY}`,
    ].join(" "),

  // Figure-eight pattern
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY}`,
      `${baseX + 10},${baseY - 5}`,
      `${baseX + 18},${baseY}`,
      `${baseX + 18},${baseY + 8}`,
      `${baseX + 10},${baseY + 13}`,
      `${baseX},${baseY + 8}`,
      `${baseX - 8},${baseY + 13}`,
      `${baseX - 16},${baseY + 8}`,
      `${baseX - 16},${baseY}`,
      `${baseX - 8},${baseY - 5}`,
      `${baseX},${baseY}`,
    ].join(" "),

  // Out-and-back route
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY}`,
      `${baseX + 6},${baseY - 3}`,
      `${baseX + 12},${baseY - 6}`,
      `${baseX + 18},${baseY - 3}`,
      `${baseX + 24},${baseY}`,
      `${baseX + 18},${baseY + 3}`,
      `${baseX + 12},${baseY + 6}`,
      `${baseX + 6},${baseY + 3}`,
      `${baseX},${baseY}`,
    ].join(" "),

  // Zigzag route
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY}`,
      `${baseX + 5},${baseY - 4}`,
      `${baseX + 10},${baseY + 2}`,
      `${baseX + 15},${baseY - 4}`,
      `${baseX + 20},${baseY + 2}`,
      `${baseX + 18},${baseY + 8}`,
      `${baseX + 12},${baseY + 6}`,
      `${baseX + 6},${baseY + 8}`,
      `${baseX},${baseY + 4}`,
      `${baseX},${baseY}`,
    ].join(" "),

  // Large loop
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY}`,
      `${baseX + 10},${baseY - 8}`,
      `${baseX + 25},${baseY - 8}`,
      `${baseX + 35},${baseY}`,
      `${baseX + 35},${baseY + 15}`,
      `${baseX + 25},${baseY + 23}`,
      `${baseX + 10},${baseY + 23}`,
      `${baseX},${baseY + 15}`,
      `${baseX},${baseY}`,
    ].join(" "),

  // Heart-shaped route
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY + 10}`,
      `${baseX - 5},${baseY + 5}`,
      `${baseX - 10},${baseY}`,
      `${baseX - 10},${baseY - 5}`,
      `${baseX - 5},${baseY - 8}`,
      `${baseX},${baseY - 5}`,
      `${baseX + 5},${baseY - 8}`,
      `${baseX + 10},${baseY - 5}`,
      `${baseX + 10},${baseY}`,
      `${baseX + 5},${baseY + 5}`,
      `${baseX},${baseY + 10}`,
    ].join(" "),

  // Star-shaped route
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY - 15}`,
      `${baseX + 5},${baseY - 5}`,
      `${baseX + 15},${baseY - 5}`,
      `${baseX + 7},${baseY + 3}`,
      `${baseX + 10},${baseY + 15}`,
      `${baseX},${baseY + 7}`,
      `${baseX - 10},${baseY + 15}`,
      `${baseX - 7},${baseY + 3}`,
      `${baseX - 15},${baseY - 5}`,
      `${baseX - 5},${baseY - 5}`,
      `${baseX},${baseY - 15}`,
    ].join(" "),

  // Diamond route
  (baseX: number, baseY: number) =>
    [
      `${baseX},${baseY - 20}`,
      `${baseX + 10},${baseY - 10}`,
      `${baseX + 20},${baseY}`,
      `${baseX + 10},${baseY + 10}`,
      `${baseX},${baseY + 20}`,
      `${baseX - 10},${baseY + 10}`,
      `${baseX - 20},${baseY}`,
      `${baseX - 10},${baseY - 10}`,
      `${baseX},${baseY - 20}`,
    ].join(" "),
];

export function useTrajectoryLayer(activities: Activity[]) {
  // Generate mock trajectory for each activity
  console.log("Generating trajectories...", activities);
  const projectedTrajectories = useMemo(() => {
    return activities.map((activity, index) => {
      // Distribute trajectories across the viewBox in a 5x5 grid for more capacity
      const gridX = index % 5; // 0, 1, 2, 3, 4
      const gridY = Math.floor(index / 5); // 0, 1, 2, 3, 4
      const baseX = 15 + gridX * 25; // 15, 40, 65, 90, 115 - better spacing in 150x150 viewbox
      const baseY = 15 + gridY * 25; // 15, 40, 65, 90, 115 - better spacing in 150x150 viewbox

      // Select route pattern based on activity distance with more variety
      const routePatternIndex = Math.min(
        Math.floor(activity.distance / 300) + (index % 3), // Add some variety even for same distances
        ROUTE_PATTERNS.length - 1,
      );

      // Generate points using the selected pattern
      const points = ROUTE_PATTERNS[routePatternIndex](baseX, baseY);

      return {
        id: activity.id,
        points,
        color: getDistanceColor(activity.distance),
        distance: activity.distance,
      };
    });
  }, [activities]);

  return {
    projectedTrajectories,
  };
}
