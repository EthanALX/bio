import { Activity } from "../../types";

export interface GeoData {
  type: string;
  features: any[];
}

export interface ProjectedRoute {
  id: string;
  points: string;
  color: string;
}

export interface ActivityMapProps {
  activities: Activity[];
  isBackground?: boolean;
  isVisible?: boolean;
}

export interface UseActivityMapProps {
  activities: Activity[];
}

export interface UseActivityMapResult {
  geoData: GeoData | null;
  pathGenerator: any;
  projectedRoutes: ProjectedRoute[];
  viewBox: string;
}
