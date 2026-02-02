import { useMemo } from 'react';
import type {
  UseRouteSketchProps,
  UseRouteSketchResult,
} from './RouteSketch.type';

export function useRouteSketch({ coordinates, seed }: UseRouteSketchProps) {
    const pathData = useMemo(() => {
        if (coordinates && coordinates.length > 1) {
            // Normalize real coordinates to fit 100x40 viewBox
            const lats = coordinates.map((c) => c.lat);
            const lngs = coordinates.map((c) => c.lng);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            const latRange = maxLat - minLat || 1;
            const lngRange = maxLng - minLng || 1;

            // Simple projection: invert Lat for Y (SVG origin is top-left)
            return coordinates
                .map((c, i) => {
                    const x = ((c.lng - minLng) / lngRange) * 100;
                    const y = (1 - (c.lat - minLat) / latRange) * 40;
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(' ');
        }

        // Generate deterministic random path
        const random = (s: number) => {
            const x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        };

        const seedNum = seed ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const points = [];
        let curX = 10 + random(seedNum) * 20;
        let curY = 10 + random(seedNum + 1) * 20;
        points.push(`M ${curX} ${curY}`);

        for (let i = 0; i < 8; i++) {
            curX += (random(seedNum + i * 2) - 0.5) * 40;
            curY += (random(seedNum + i * 2 + 1) - 0.5) * 20;
            // Bound checking
            curX = Math.max(5, Math.min(95, curX));
            curY = Math.max(5, Math.min(35, curY));
            points.push(`L ${curX.toFixed(1)} ${curY.toFixed(1)}`);
        }
        return points.join(' ');
    }, [coordinates, seed]);

    return {
        pathData
    };
}
