export interface MapboxBounds {
  ne: [number, number];
  sw: [number, number];
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface MapViewProps {
  mapType: string;
  detailed?: boolean;
  locationPermissionGranted: boolean;
  initialBounds: CodegenCoordinates[];
  testID?: string;
}
