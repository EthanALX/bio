'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '../../types';
import styles from './EnhancedActivityMap.module.css';

// 设置 Mapbox token (需要在环境变量中配置)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

interface EnhancedActivityMapProps {
  activities: Activity[];
  selectedActivityId?: string;
}

export function EnhancedActivityMap({ activities, selectedActivityId }: EnhancedActivityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.warn('Mapbox token not configured');
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 2,
      pitch: 0,
      bearing: 0,
    });

    map.current.on('load', () => {
      setMapLoaded(true);

      if (map.current) {
        // 自定义地图样式
        map.current.setPaintProperty('water', 'fill-color', '#0a1929');
        map.current.setPaintProperty('water', 'fill-opacity', 0.8);

        // 添加 3D 建筑
        if (!map.current.getLayer('3d-buildings')) {
          map.current.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#0f172a',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          });
        }
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // 绘制路线
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // 过滤有坐标的活动
    const activitiesWithCoords = activities.filter(
      a => a.coordinates && a.coordinates.length > 0
    );

    if (activitiesWithCoords.length === 0) return;

    activitiesWithCoords.forEach((activity) => {
      if (!activity.coordinates || activity.coordinates.length === 0) return;

      const sourceId = `route-${activity.id}`;
      const layerId = `route-layer-${activity.id}`;
      const glowLayerId = `${layerId}-glow`;

      // 移除旧图层
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
      if (map.current!.getLayer(glowLayerId)) {
        map.current!.removeLayer(glowLayerId);
      }
      if (map.current!.getSource(sourceId)) {
        map.current!.removeSource(sourceId);
      }

      // 添加路线数据源
      const coordinates = activity.coordinates.map(c => [c.lng, c.lat]);
      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      // 发光层
      map.current!.addLayer({
        id: glowLayerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0ea5e9',
          'line-width': selectedActivityId === activity.id ? 12 : 8,
          'line-blur': 4,
          'line-opacity': selectedActivityId === activity.id ? 0.4 : 0.2,
        },
      });

      // 基础路线层
      map.current!.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0ea5e9',
          'line-width': selectedActivityId === activity.id ? 6 : 4,
          'line-opacity': selectedActivityId === activity.id ? 1 : 0.6,
        },
      });
    });

    // 调整视角以显示所有路线
    if (activitiesWithCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      activitiesWithCoords.forEach(activity => {
        activity.coordinates?.forEach(coord => {
          bounds.extend([coord.lng, coord.lat]);
        });
      });
      map.current!.fitBounds(bounds, { padding: 50 });
    }
  }, [activities, selectedActivityId, mapLoaded]);

  const toggle3D = () => {
    if (!map.current) return;
    const newIs3D = !is3D;
    setIs3D(newIs3D);

    map.current.flyTo({
      pitch: newIs3D ? 60 : 0,
      bearing: newIs3D ? -20 : 0,
      duration: 1000,
    });
  };

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>
            Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div ref={mapContainer} className={styles.map} />

      {/* 地图控制层 */}
      <div className={styles.controls}>
        <button
          className={`${styles.controlButton} ${!is3D ? styles.active : ''}`}
          onClick={() => !is3D || toggle3D()}
        >
          2D View
        </button>
        <button
          className={`${styles.controlButton} ${is3D ? styles.active : ''}`}
          onClick={() => is3D || toggle3D()}
        >
          3D View
        </button>
      </div>

      {/* 速度图例 */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Route Intensity</div>
        <div className={styles.legendGradient}>
          <div className={styles.legendDot} style={{ background: '#10b981' }} />
          <span className={styles.legendLabel}>Fast</span>
          <div className={styles.legendBar} />
          <span className={styles.legendLabel}>Slow</span>
          <div className={styles.legendDot} style={{ background: '#ef4444' }} />
        </div>
      </div>
    </div>
  );
}
