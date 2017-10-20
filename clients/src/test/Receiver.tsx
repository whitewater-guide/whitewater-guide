import * as React from 'react';

export interface WithCalls<P> {
  cwrp: P[];
  cdm: P;
}

export class Receiver<P> extends React.PureComponent<P> implements WithCalls<P> {
  public cwrp: P[] = [];
  public cdm: P;

  componentDidMount() {
    this.cdm = this.props;
  }

  componentWillReceiveProps(next: P) {
    this.cwrp = [...this.cwrp, next];
  }

  render() {
    return null;
  }
}
