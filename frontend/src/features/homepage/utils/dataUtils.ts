export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  date: string;
  distance: number;
  pace: string;
  bpm: number;
  time: string;
  route: string;
  type: string;
  coordinates: Coordinate[];
}

// Generate SVG path from coordinates
export function generateSvgPath(coordinates: Coordinate[]): string {
  if (!coordinates || coordinates.length === 0) {
    return '';
  }

  // Normalize coordinates to a reasonable SVG viewBox
  const minLng = Math.min(...coordinates.map(c => c.lng));
  const maxLng = Math.max(...coordinates.map(c => c.lng));
  const minLat = Math.min(...coordinates.map(c => c.lat));
  const maxLat = Math.max(...coordinates.map(c => c.lat));

  const lngRange = maxLng - minLng || 1;
  const latRange = maxLat - minLat || 1;

  const padding = 10;

  const path = coordinates.map((coord, index) => {
    // Invert y-axis because SVG has y=0 at top, but latitude increases northward
    const x = padding + ((coord.lng - minLng) / lngRange) * (100 - 2 * padding);
    const y = 100 - padding - ((coord.lat - minLat) / latRange) * (100 - 2 * padding);
    const command = index === 0 ? 'M' : 'L';
    return `${command} ${x} ${y}`;
  }).join(' ');

  return path;
}

// Get latest activity (most recent)
export function getLatestActivity(activities: Activity[]): Activity | null {
  if (!activities || activities.length === 0) return null;
  return activities[0];
}

// Calculate total distance
export function calculateTotalDistance(activities: Activity[]): number {
  if (!activities || activities.length === 0) return 0;
  return activities.reduce((sum, a) => sum + a.distance, 0);
}

// Calculate total runs
export function calculateTotalRuns(activities: Activity[]): number {
  return activities?.length || 0;
}

// Calculate active days
export function calculateActiveDays(activities: Activity[]): number {
  if (!activities || activities.length === 0) return 0;
  const uniqueDays = new Set(activities.map(a => a.date.split('T')[0]));
  return uniqueDays.size;
}

// Calculate average pace (simplified)
export function calculateAvgPace(activities: Activity[]): string {
  if (!activities || activities.length === 0) return "0'00\"";
  // This is a simplified version - real implementation would parse pace strings
  return activities[0]?.pace || "0'00\"";
}

// Generate heatmap data from activities
export function generateHeatmapData(activities: Activity[]): number[][] {
  const weeks = 52;
  const days = 7;
  const grid: number[][] = [];

  // Initialize empty grid (all level 0)
  for (let w = 0; w < weeks; w++) {
    grid[w] = [];
    for (let d = 0; d < days; d++) {
      grid[w][d] = 0;
    }
  }

  if (!activities || activities.length === 0) {
    return grid;
  }

  // Fill grid with activity data
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const week = getWeekNumber(date);
    const day = date.getDay();
    const level = getActivityLevel(activity.distance);
    
    // Only set if this activity is more intense
    if (week < weeks && day < days) {
      grid[week][day] = Math.max(grid[week][day], level);
    }
  });

  return grid;
}

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.floor(diff / oneWeek);
}

function getActivityLevel(distance: number): number {
  if (distance >= 15) return 3; // High activity
  if (distance >= 10) return 2; // Medium activity
  if (distance >= 5) return 1; // Low activity
  return 0; // No activity
}

// Calculate personal bests
export function calculatePersonalBests(activities: Activity[]): {
  best5k: string | null;
  best10k: string | null;
  bestHalf: string | null;
} {
  if (!activities || activities.length === 0) {
    return { best5k: null, best10k: null, bestHalf: null };
  }

  const best5k = activities
    .filter(a => a.distance >= 4.5 && a.distance <= 5.5)
    .sort((a, b) => parseTime(a.time) - parseTime(b.time))[0];

  const best10k = activities
    .filter(a => a.distance >= 9 && a.distance <= 11)
    .sort((a, b) => parseTime(a.time) - parseTime(b.time))[0];

  const bestHalf = activities
    .filter(a => a.distance >= 20 && a.distance <= 22)
    .sort((a, b) => parseTime(a.time) - parseTime(b.time))[0];

  return {
    best5k: best5k?.time ? formatTime(best5k.time) : null,
    best10k: best10k?.time ? formatTime(best10k.time) : null,
    bestHalf: bestHalf?.time ? formatTime(bestHalf.time) : null,
  };
}

export function formatTime(timeStr: string): string {
  const totalSeconds = parseTime(timeStr);
  if (totalSeconds === Infinity) return timeStr;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function parseTime(timeStr: string): number {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minMatch = timeStr.match(/(\d+)m/);
  const secMatch = timeStr.match(/(\d+)s/);

  let totalSeconds = 0;
  if (hourMatch) totalSeconds += parseInt(hourMatch[1], 10) * 3600;
  if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60;
  if (secMatch) totalSeconds += parseInt(secMatch[1], 10);

  return totalSeconds;
}
