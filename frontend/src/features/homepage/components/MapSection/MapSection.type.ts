export interface MapSectionProps {
  selectedYear?: number;
}

export interface EndPointCoordinates {
  x: number;
  y: number;
}

export interface MapSectionData {
  latestActivity: {
    route: string;
    distance?: number;
    coordinates?: Array<{ lat: number; lng: number }>;
  } | null;
  svgPath: string;
  endPointCoordinates: EndPointCoordinates | null;
}

export interface UseMapSectionProps {
  selectedYear?: number;
}

export interface UseMapSectionResult {
  data: MapSectionData;
  actions: {
    handlePathRef: (ref: SVGPathElement | null) => void;
  };
}
