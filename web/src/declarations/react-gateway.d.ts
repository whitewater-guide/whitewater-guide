/* tslint:disable:max-classes-per-file */
declare module 'react-gateway' {
  import * as React from 'react';

  export class GatewayProvider extends React.Component {
  }

  export interface GatewayProps {
    into: string;
  }

  export class Gateway extends React.Component<GatewayProps> {
  }

  export interface GatewayDestProps {
    name: string;
    component?: React.ReactType;
    className?: string;
  }

  export class GatewayDest extends React.Component<GatewayDestProps> {
  }
}
