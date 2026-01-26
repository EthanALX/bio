/**
 * Get color based on distance range
 * 每5km一个颜色，绿色由浅到深
 */
export function getDistanceColor(distance: number): string {
    if (distance < 5) {
        return '#dcfce7'; // light green (0-5km)
    } else if (distance < 10) {
        return '#86efac'; // medium green (5-10km)
    } else if (distance < 15) {
        return '#22c55e'; // dark green (10-15km)
    } else {
        return '#15803d'; // darkest green (15km+)
    }
}