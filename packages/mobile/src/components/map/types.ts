export interface MapboxBounds {
  ne: CodegenCoordinates;
  sw: CodegenCoordinates;
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
