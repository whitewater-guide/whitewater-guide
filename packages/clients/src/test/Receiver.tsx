import { ReactWrapper } from 'enzyme';
import React from 'react';

export interface WithCalls<P> {
  cdu: P[];
  cdm: P;
}

export class Receiver<P> extends React.PureComponent<P>
  implements WithCalls<P> {
  public cdu: P[] = [];
  public cdm!: P;

  componentDidMount() {
    this.cdm = this.props;
  }

  componentDidUpdate() {
    this.cdu = [...this.cdu, this.props];
  }

  render() {
    return null;
  }
}

export function genericReceiver<P>(): React.ComponentType<P> {
  return Receiver as any;
}

export function findReceiver<P>(wrapped: ReactWrapper<P>): Receiver<P> {
  return wrapped
    .find(Receiver)
    .first()
    .instance() as any;
}
