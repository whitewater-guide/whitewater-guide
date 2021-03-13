declare module 'victory-native' {
  // eslint-disable-next-line import/export
  export * from 'victory';

  export interface LineProps {
    className?: string;
    clipPath?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events?: any;
    role?: string;
    shapeRendering?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any;
    transform?: string;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
  }

  // eslint-disable-next-line import/export
  export class Line extends React.Component<LineProps> {}
}
