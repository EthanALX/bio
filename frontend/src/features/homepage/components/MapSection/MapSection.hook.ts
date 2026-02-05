import { useMemo, useRef, useCallback } from "react";
import { useActivities } from "@/features/homepage/hooks";
import { generateSvgPath } from "@/features/homepage/utils";
import type {
  UseMapSectionProps,
  UseMapSectionResult,
  MapSectionData,
  EndPointCoordinates,
} from "./MapSection.type";

export const useMapSection = (
  props: UseMapSectionProps
): UseMapSectionResult => {
  const { selectedYear } = props;
  const { latestActivity } = useActivities(selectedYear);
  const pathRef = useRef<SVGPathElement>(null);

  const svgPath = useMemo(() => {
    return latestActivity ? generateSvgPath(latestActivity.coordinates) : "";
  }, [latestActivity]);

  const endPointCoordinates = useMemo((): EndPointCoordinates | null => {
    if (!latestActivity?.coordinates?.length) return null;
    const coords = latestActivity.coordinates;
    const last = coords[coords.length - 1];

    const minLng = Math.min(...coords.map((c) => c.lng));
    const maxLng = Math.max(...coords.map((c) => c.lng));
    const minLat = Math.min(...coords.map((c) => c.lat));
    const maxLat = Math.max(...coords.map((c) => c.lat));

    const lngRange = maxLng - minLng || 1;
    const latRange = maxLat - minLat || 1;
    const padding = 10;

    const x = padding + ((last.lng - minLng) / lngRange) * (100 - 2 * padding);
    const y =
      100 - padding - ((last.lat - minLat) / latRange) * (100 - 2 * padding);

    return { x, y };
  }, [latestActivity]);

  const data: MapSectionData = {
    latestActivity,
    svgPath,
    endPointCoordinates,
  };

  const handlePathRef = useCallback((ref: SVGPathElement | null) => {
    pathRef.current = ref;
  }, []);

  return {
    data,
    actions: { handlePathRef },
  };
};
