declare module 'victory-native' {
  // eslint-disable-next-line import/export
  export * from 'victory';

  export interface LineProps {
    className?: string;
    clipPath?: string;
    events?: any;
    role?: string;
    shapeRendering?: string;
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
