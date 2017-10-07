import * as React from 'react';
import Mock = jest.Mock;

export class Receiver extends React.PureComponent<any> {
  static cwm: Mock<any> = jest.fn();
  static cdm: Mock<any> = jest.fn();
  static cwrp: Mock<any> = jest.fn();

  static clearMocks = () => {
    Receiver.cwm.mockClear();
    Receiver.cdm.mockClear();
    Receiver.cwrp.mockClear();
  };

  componentWillMount() {
    Receiver.cwm(this.props);
  }

  componentDidMount() {
    Receiver.cdm(this.props);
  }

  componentWillReceiveProps(next: any) {
    Receiver.cwrp(next);
  }

  render() {
    return null;
  }
}
