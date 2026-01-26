import React from 'react';
import { Activity } from '../../types';
import { TrajectoryLayer } from './TrajectoryLayer';
import { ActivityMap } from '../ActivityMap/ActivityMap';

/**
 * Integration Example: TrajectoryLayer with ActivityMap
 * 
 * This example demonstrates how to overlay TrajectoryLayer on top of ActivityMap
 * to show both the geographic map background and distance-based trajectory colors.
 */
export function TrajectoryIntegrationExample() {
    // Sample activities for demonstration
    const sampleActivities: Activity[] = [
        {
            id: 'run-1',
            date: '2024-01-15',
            distance: 3.2,
            pace: "5'20\"/km",
            bpm: 145,
            time: "17m",
            route: 'Morning Run',
            type: 'run',
            coordinates: [
                { lat: 39.9042, lng: 116.4074 },
                { lat: 39.9142, lng: 116.4174 },
                { lat: 39.9242, lng: 116.4274 }
            ]
        },
        {
            id: 'run-2',
            date: '2024-01-16',
            distance: 8.5,
            pace: "5'45\"/km",
            bpm: 142,
            time: "46m",
            route: 'Evening Run',
            type: 'run',
            coordinates: [
                { lat: 39.9342, lng: 116.4374 },
                { lat: 39.9442, lng: 116.4474 },
                { lat: 39.9542, lng: 116.4574 }
            ]
        },
        {
            id: 'run-3',
            date: '2024-01-17',
            distance: 12.8,
            pace: "5'30\"/km",
            bpm: 148,
            time: "1h 10m",
            route: 'Long Run',
            type: 'run',
            coordinates: [
                { lat: 39.9642, lng: 116.4674 },
                { lat: 39.9742, lng: 116.4774 },
                { lat: 39.9842, lng: 116.4874 }
            ]
        }
    ];

    return (
        <div style={{ position: 'relative', width: '800px', height: '600px' }}>
            {/* Base map layer */}
            <ActivityMap 
                activities={sampleActivities}
                isBackground={false}
                isVisible={true}
            />
            
            {/* Trajectory overlay layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <TrajectoryLayer 
                    activities={sampleActivities}
                    isVisible={true}
                />
            </div>
        </div>
    );
}