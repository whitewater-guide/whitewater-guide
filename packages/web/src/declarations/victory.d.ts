declare module 'victory' {
  import React from 'react';

  export interface CommonPrimitiveProps {
    active?: boolean;
    className?: string;
    clipPath?: string;
    data?: any;
    events?: any;
    id?: number | string;
    index?: number | string;
    origin?: { x: number; y: number };
    polar?: boolean;
    role?: string;
    scale?: any;
    shapeRendering?: string;
    style?: any;
    transform?: string;
  }

  export interface LineSegmentProps extends CommonPrimitiveProps {
    datum?: any;
    lineComponent?: React.ReactElement;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
  }

  export class LineSegment extends React.Component<LineSegmentProps> {}
}
