import { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3-geo';
import { Activity } from '../../types';
import type {
  GeoData,
  ProjectedRoute,
  UseActivityMapResult,
} from './ActivityMap.type';

export function useActivityMap(activities: Activity[]) {
    const [geoData, setGeoData] = useState<GeoData | null>(null);

    useEffect(() => {
        fetch('/data/china.json')
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error('Failed to load map data:', err));
    }, []);

    // Width and height for the SVG container (from viewBox)
    const width = 800;
    const height = 600;

    const projection = useMemo(() => {
        // Center on China [104.1954, 35.8617]
        return d3.geoMercator()
            .center([105, 36])
            .scale(500)
            .translate([width / 2, height / 2]);
    }, [width, height]);

    const pathGenerator = useMemo(() => {
        return d3.geoPath().projection(projection);
    }, [projection]);

    const TRACE_COLORS = [
        '#ff4d4f', // Red
        '#ffa940', // Orange
        '#36cfc9', // Cyan
        '#b37feb', // Purple
        '#ffec3d', // Yellow
        '#73d13d', // Green
    ];

    const projectedRoutes = useMemo(() => {
        return activities
            .filter((activity) => activity.coordinates && activity.coordinates.length > 0)
            .map((activity, index) => {
                const points = activity.coordinates!.map((coord) => {
                    const projected = projection([coord.lng, coord.lat]);
                    return projected ? `${projected[0]},${projected[1]}` : null;
                }).filter(Boolean);

                return {
                    id: activity.id,
                    points: points.join(' '),
                    color: TRACE_COLORS[index % TRACE_COLORS.length],
                };
            });
    }, [activities, projection]);

    return {
        geoData,
        pathGenerator,
        projectedRoutes,
        viewBox: `0 0 ${width} ${height}`,
    };
}
