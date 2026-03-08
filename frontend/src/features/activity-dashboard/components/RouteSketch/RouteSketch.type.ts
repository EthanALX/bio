export interface RouteSketchProps {
  coordinates?: Array<{ lat: number; lng: number }>;
  seed?: string;
  width?: number;
  height?: number;
}

export interface UseRouteSketchProps {
  coordinates?: Array<{ lat: number; lng: number }>;
  seed?: string;
}

export interface UseRouteSketchResult {
  pathData: string;
}
