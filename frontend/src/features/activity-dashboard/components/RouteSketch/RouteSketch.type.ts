export interface RouteSketchProps {
  coordinates?: Array<{ lat: number; lng: number }>;
  seed?: string;
}

export interface UseRouteSketchProps {
  coordinates?: Array<{ lat: number; lng: number }>;
  seed?: string;
}

export interface UseRouteSketchResult {
  pathData: string;
}
