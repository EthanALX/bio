import { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3-geo';
import { Activity } from '../../types';
import { getDistanceColor } from '../utils/colorMapping';

interface ProjectedTrajectory {
    id: string;
    points: string;
    color: string;
    distance: number;
}

export function useTrajectoryLayer(activities: Activity[]) {
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

    const projectedTrajectories = useMemo(() => {
        return activities
            .filter((activity) => activity.coordinates && activity.coordinates.length > 0)
            .map((activity) => {
                const points = activity.coordinates!.map((coord) => {
                    const projected = projection([coord.lng, coord.lat]);
                    return projected ? `${projected[0]},${projected[1]}` : null;
                }).filter(Boolean);

                return {
                    id: activity.id,
                    points: points.join(' '),
                    color: getDistanceColor(activity.distance),
                    distance: activity.distance,
                };
            });
    }, [activities, projection]);

    return {
        projectedTrajectories,
    };
}