/* eslint-disable */
declare module '@react-native-mapbox-gl/maps' {
  import { Feature, Geometry, Point } from '@turf/helpers';
  import { Component } from 'react';
  import { ViewProperties, ViewStyle } from 'react-native';

  export interface ScreenPoint {
    screenPointX: number;
    screenPointY: number;
  }

  export interface OnPressEvent {
    features: Array<Feature<Geometry, any>>;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    point: {
      x: number;
      y: number;
    };
  }

  export type RegionChangeEvent = Feature<
    Point,
    {
      animated: boolean;
      heading: number;
      isUserInteraction: boolean;
      pitch: number;
      visibleBounds: [[number, number], [number, number]];
      zoomLevel: number;
    }
  >;

  /**
   * These are the typings for the Mapbox React Native module.
   * They are modelled after the documentation and may not be 100% accurate.
   *
   * Generated by Ryan Pope (https://github.com/RyPope)
   */

  type Anchor =
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  type Visibility = 'visible' | 'none';
  type Alignment = 'map' | 'viewport';
  type AutoAlignment = Alignment | 'auto';

  type NamedStyles<T> = {
    [P in keyof T]:
      | SymbolLayerStyle
      | RasterLayerStyle
      | LineLayerStyle
      | FillLayerStyle
      | FillExtrusionLayerStyle
      | CircleLayerStyle
      | BackgroundLayerStyle;
  };

  export interface LightStyle {
    anchor?: Alignment;
    position?: Array<number>;
    color?: string;
    intensity?: number;
  }

  export interface BackgroundLayerStyle {
    visibility?: Visibility;
    backgroundColor?: string;
    backgroundPattern?: string;
    backgroundOpacity?: number;
  }

  export interface CircleLayerStyle {
    visibility?: Visibility;
    circleRadius?: number | any[];
    circleColor?: string;
    circleBlur?: number;
    circleOpacity?: number;
    circleTranslate?: Array<number>;
    circleTranslateAnchor?: Alignment;
    circlePitchScale?: Alignment;
    circlePitchAlignment?: Alignment;
    circleStrokeWidth?: number;
    circleStrokeColor?: string;
    circleStrokeOpacity?: number;
  }

  export interface FillExtrusionLayerStyle {
    visibility?: Visibility;
    fillExtrusionColor?: string;
    fillExtrusionOpacity?: number;
    fillExtrusionTranslate?: Array<number>;
    fillExtrusionTranslateAnchor?: Alignment;
    fillExtrusionPattern?: string;
    fillExtrusionHeight?: number;
    fillExtrusionBase?: number;
  }

  export interface FillLayerStyle {
    visibility?: Visibility;
    fillAntialias?: boolean;
    fillOpacity?: number;
    fillColor?: string;
    fillOutlineColor?: string;
    fillTranslate?: Array<number>;
    fillTranslateAnchor?: Alignment;
    fillPattern?: string;
  }

  export interface LineLayerStyle {
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'bevel' | 'round' | 'miter';
    lineMiterLimit?: number;
    lineRoundLimit?: number;
    visibility?: Visibility;
    lineOpacity?: number;
    lineColor?: string | ['get', string];
    lineTranslate?: Array<number>;
    lineTranslateAnchor?: Alignment;
    lineWidth?: number;
    lineGapWidth?: number;
    lineOffset?: number;
    lineBlur?: number;
    lineDasharray?: Array<number>;
    linePattern?: string;
  }

  export interface RasterLayerStyle {
    visibility?: Visibility;
    rasterOpacity?: number;
    rasterHueRotate?: number;
    rasterBrightnessMin?: number;
    rasterBrightnessMax?: number;
    rasterSaturation?: number;
    rasterContrast?: number;
    rasterFadeDuration?: number;
  }

  export interface SymbolLayerStyle {
    symbolPlacement?: 'point' | 'line' | 'line-center';
    symbolSpacing?: number;
    symbolAvoidEdges?: boolean;
    iconAllowOverlap?: boolean;
    iconIgnorePlacement?: boolean;
    iconOptional?: boolean;
    iconRotationAlignment?: AutoAlignment;
    iconSize?: number;
    iconTextFit?: 'none' | 'width' | 'height' | 'both';
    iconTextFitPadding?: Array<number>;
    iconImage?: string;
    iconRotate?: number;
    iconPadding?: number;
    iconKeepUpright?: boolean;
    iconOffset?: Array<number>;
    iconAnchor?: Anchor;
    iconPitchAlignment?: AutoAlignment;
    textPitchAlignment?: AutoAlignment;
    textRotationAlignment?: AutoAlignment;
    textField?: string;
    textFont?: Array<string>;
    textSize?: number | any[];
    textMaxWidth?: number;
    textLineHeight?: number;
    textLetterSpacing?: number;
    textJustify?: 'left' | 'center' | 'right';
    textAnchor?: Anchor;
    textMaxAngle?: number;
    textRotate?: number | ['get', string];
    textPadding?: number;
    textKeepUpright?: boolean;
    textTransform?: 'none' | 'uppercase' | 'lowercase';
    textOffset?: Array<number>;
    textAllowOverlap?: boolean;
    textIgnorePlacement?: boolean;
    textOptional?: boolean;
    visibility?: Visibility;
    iconOpacity?: number;
    iconColor?: string;
    iconHaloColor?: string;
    iconHaloWidth?: number;
    iconHaloBlur?: number;
    iconTranslate?: Array<number>;
    iconTranslateAnchor?: Alignment;
    textOpacity?: number;
    textColor?: string | ['get', string];
    textHaloColor?: string;
    textHaloWidth?: number;
    textHaloBlur?: number;
    textTranslate?: Array<number>;
    textTranslateAnchor?: Alignment;
  }

  export interface CameraBounds {
    ne: [number, number];
    sw: [number, number];
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  }

  export interface CameraSettings {
    /**
     * Center coordinate on map [lng, lat]
     */
    centerCoordinate?: [number, number];

    /**
     * Heading on map
     */
    heading?: number;

    /**
     * Pitch on map
     */
    pitch?: number;

    bounds?: CameraBounds;

    /**
     * Zoom level of the map
     */
    zoomLevel?: number;
  }

  export interface CameraProps extends ViewProperties, CameraSettings {
    animationDuration?: number;
    animationMode?: 'flyTo' | 'easeTo' | 'moveTo';
    defaultSettings: CameraSettings;
    minZoomLevel?: number;
    maxZoomLevel?: number;

    followUserLocation?: boolean;
    followUserMode?: 'normal' | 'compass' | 'course';

    followZoomLevel?: number;
    followPitch?: number;
    followHeading?: number;

    // manual update
    triggerKey?: any;

    // position
    alignment?: [number, number];
  }

  export interface UserLocationProps {
    animated?: boolean;
    renderMode?: 'normal' | 'custom';
    visible?: boolean;

    onPress?: (e: any) => void;
    onUpdate?: (e: any) => void;
  }

  export interface OfflinePackStatus {
    completedResourceCount: number;
    completedResourceSize: number;
    completedTileCount: number;
    completedTileSize: number;
    name: string;
    percentage: number;
    requiredResourceCount: number;
    state: number;
  }

  export interface OfflinePack {
    name: string;
    bounds: [[number, number], [number, number]];
    metadata: any;
    status: () => Promise<OfflinePackStatus | undefined>;
    pause: () => void;
    resume: () => void;
  }

  export interface OfflineError {
    message: string;
    name: string;
  }

  export class OfflineManager {
    createPack(
      options: OfflineCreatePackOptions,
      progressListener?: (
        pack: OfflinePack,
        progress: OfflinePackStatus,
      ) => void,
      errorListener?: (pack: OfflinePack, error: OfflineError) => void,
    ): void;

    deletePack(name: string): Promise<void>;

    getPacks(): Promise<OfflinePack[]>;

    getPack(name: string): Promise<OfflinePack | null>;

    setTileCountLimit(limit: number): void;

    setProgressEventThrottle(throttleValue: number): void;

    subscribe(
      packName: string,
      progressListener: (
        pack: OfflinePack,
        progress: OfflinePackStatus,
      ) => void,
      errorListener: (pack: OfflinePack, error: any) => void,
    ): void;

    unsubscribe(packName: string): void;
  }

  declare namespace MapboxGL {
    function setAccessToken(accessToken: string): void;

    function getAccessToken(): Promise<void>;

    function setTelemetryEnabled(telemetryEnabled: boolean): void;

    function requestAndroidLocationPermissions(): Promise<boolean>;

    /**
     * Components
     */
    class MapView extends Component<MapboxViewProps> {
      getPointInView(coordinate: Array<number>): Promise<void>;

      getCoordinateFromView(point: Array<number>): Promise<void>;

      getVisibleBounds(): Promise<void>;

      queryRenderedFeaturesAtPoint(
        coordinate: Array<number>,
        filter?: Array<string>,
        layerIds?: Array<string>,
      ): Promise<void>;

      queryRenderedFeaturesInRect(
        coordinate: Array<number>,
        filter?: Array<string>,
        layerIds?: Array<string>,
      ): Promise<void>;

      fitBounds(
        northEastCoordinates: Array<number>,
        southWestCoordinates: Array<number>,
        padding?: number,
        duration?: number,
      ): void;

      flyTo(coordinates: Array<number>, duration?: number): void;

      moveTo(coordinates: Array<number>, duration?: number): void;

      zoomTo(zoomLevel: number, duration?: number): void;

      setCamera(config: any): void;

      takeSnap(writeToDisk: boolean): Promise<string>;

      getZoom(): Promise<number>;

      getCenter(): Promise<Array<number>>;
    }

    class Camera extends Component<CameraProps> {
      moveTo(coordinates: number[], duration?: number): void;
      setCamera(
        settings: CameraSettings & { animationDuration?: number },
      ): void;
      fitBounds(
        ne: [number, number],
        sw: [number, number],
        padding?: number | [number, number],
        animationDuration?: number,
      ): void;
    }
    class UserLocation extends Component<UserLocationProps> {}

    class Light extends Component<LightProps> {}

    class PointAnnotation extends Component<PointAnnotationProps> {}

    class Callout extends Component<CalloutProps> {}

    /**
     * Sources
     */
    class VectorSource extends Component<VectorSourceProps> {}

    class ShapeSource<P = any> extends Component<ShapeSourceProps<P>> {}

    class RasterSource extends Component<RasterSourceProps> {}

    /**
     * Layers
     */
    class BackgroundLayer extends Component<BackgroundLayerProps> {}

    class CircleLayer extends Component<CircleLayerProps> {}

    class FillExtrusionLayer extends Component<FillExtrusionLayerProps> {}

    class FillLayer extends Component<FillLayerProps> {}

    class LineLayer extends Component<LineLayerProps> {}

    class RasterLayer extends Component<RasterLayerProps> {}

    class SymbolLayer extends Component<SymbolLayerProps> {}

    class Images extends Component<{ images: Record<string, any> }> {}

    const offlineManager: OfflineManager;

    interface LocationManagerLocation {
      coords: {
        accuracy: number;
        altitude: number;
        heading: number;
        latitude: number;
        longitude: number;
        speed: number;
      };
      timestamp: number;
    }

    class LocationManager {
      getLastKnownLocation(): Promise<LocationManagerLocation | null>;
    }

    const locationManager: LocationManager;

    class SnapshotManager extends Component {
      takeSnap(options: SnapshotOptions): Promise<string>;
    }

    const snapshotManager: SnapshotManager;

    /**
     * Constants
     */
    enum UserTrackingModes {
      None = 0,
      Follow = 1,
      FollowWithCourse = 2,
      FollowWithHeading = 3,
    }

    enum InterpolationMode {
      Exponential = 0,
      Categorical = 1,
      Interval = 2,
      Identity = 3,
    }

    enum StyleSource {
      DefaultSourceID = 0,
    }
  }

  export interface MapboxViewProps extends ViewProperties {
    animated?: boolean;
    centerCoordinate?: Array<number>;
    showUserLocation?: boolean;
    userTrackingMode?: number;
    userLocationVerticalAlignment?: number;
    contentInset?: Array<number>;
    heading?: number;
    pitch?: number;
    style?: any;
    styleURL?: string;
    zoomLevel?: number;
    minZoomLevel?: number;
    maxZoomLevel?: number;
    localizeLabels?: boolean;
    zoomEnabled?: boolean;
    scrollEnabled?: boolean;
    pitchEnabled?: boolean;
    rotateEnabled?: boolean;
    attributionEnabled?: boolean;
    attributionPosition?: any;
    logoEnabled?: boolean;
    compassEnabled?: boolean;
    surfaceView?: boolean;
    regionWillChangeDebounceTime?: number;
    regionDidChangeDebounceTime?: number;

    onPress?: (f: Feature<Point, ScreenPoint>) => void;
    onLongPress?: () => void;
    onRegionWillChange?: (e: RegionChangeEvent) => void;
    onRegionIsChanging?: (e: RegionChangeEvent) => void;
    onRegionDidChange?: (e: RegionChangeEvent) => void;
    onUserLocationUpdate?: () => void;
    onWillStartLoadingMap?: () => void;
    onDidFinishLoadingMap?: () => void;
    onDidFailLoadingMap?: () => void;
    onWillStartRenderingFrame?: () => void;
    onDidFinishRenderingFrame?: () => void;
    onDidFinishRenderingFrameFully?: () => void;
    onWillStartRenderingMap?: () => void;
    onDidFinishRenderingMap?: () => void;
    onDidFinishRenderingMapFully?: () => void;
    onDidFinishLoadingStyle?: () => void;
    onUserTrackingModeChange?: () => void;
  }

  interface XYPoint {
    x: number;
    y: number;
  }

  interface LightProps {
    style: LightStyle;
  }

  interface PointAnnotationProps {
    id: string;
    title?: string;
    snippet?: string;
    selected?: boolean;
    coordinate: Array<number>;
    anchor?: XYPoint;
    onSelected?: () => void;
    onDeselected?: () => void;
  }

  interface CalloutProps {
    id?: string;
    url?: string;
    onPress?: () => void;
    hitbox?: any;
  }

  interface VectorSourceProps {
    title?: string;
    style?: ViewStyle;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    tipStyle?: ViewStyle;
    textStyle?: ViewStyle;
  }

  interface ShapeSourceProps {
    id?: string;
    url?: string;
    shape?: any;
    cluter?: boolean;
    clusterRadius?: number;
    clusterMaxZoomLevel?: number;
    maxZoomLevel?: number;
    buffer?: number;
    tolerance?: number;
    images?: any;
    onPress?: (e: OnPressEvent<any>) => void;
    hitbox?: any;
  }

  interface RasterSourceProps {
    id?: MapboxGL.StyleSource;
    url?: string;
    minZoomLevel?: number;
    maxZoomLevel?: number;
    tileSize?: number;
    tms?: boolean;
    attribution?: string;
  }

  interface LayerBaseProps {
    id?: string;
    sourceID?: MapboxGL.StyleSource;
    sourceLayerID?: string;
    aboveLayerID?: string;
    belowLayerID?: string;
    layerIndex?: number;
    filter?: Array<any>;
    minZoomLevel?: number;
    maxZoomLevel?: number;
  }

  interface BackgroundLayerProps extends LayerBaseProps {
    style?: BackgroundLayerStyle;
  }

  interface CircleLayerProps extends LayerBaseProps {
    style?: CircleLayerStyle;
  }

  interface FillExtrusionLayerProps extends LayerBaseProps {
    style?: FillExtrusionLayerStyle;
  }

  interface FillLayerProps extends LayerBaseProps {
    style?: FillLayerStyle;
  }

  interface LineLayerProps extends LayerBaseProps {
    style?: LineLayerStyle;
  }

  interface RasterLayerProps extends LayerBaseProps {
    style?: RasterLayerStyle;
  }

  interface SymbolLayerProps extends LayerBaseProps {
    style?: SymbolLayerStyle;
  }

  interface OfflineCreatePackOptions {
    name?: string;
    styleURL?: MapboxGL.StyleURL;
    bounds?: [[number, number], [number, number]];
    minZoom?: number;
    maxZoom?: number;
    metadata?: any;
  }

  interface SnapshotOptions {
    centerCoordinate?: Array<number>;
    bounds?: [[number, number], [number, number]];
    width?: number;
    height?: number;
    zoomLevel?: number;
    pitch?: number;
    heading?: number;
    styleURL?: MapboxGL.StyleURL;
    writeToDisk?: boolean;
  }

  export default MapboxGL;
}
