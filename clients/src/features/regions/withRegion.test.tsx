// tslint:disable:max-classes-per-file
import * as casual from 'casual';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { createMockedProvider } from '../../test';
import { withRegion, WithRegion } from './withRegion';

const MockedProvider = createMockedProvider();

beforeEach(() => casual.seed(1));

it('has a loading state', done => {
  class Container extends React.PureComponent<WithRegion> {
    // tslint:disable-next-line:no-inferrable-types
    ticks: number = 0;

    componentWillMount() {
      expect(this.props.region.loading).toBe(true);
    }
    componentWillReceiveProps(next: WithRegion) {
      // This is weird cache-and network behavior, takes 2 ticks to set loading to false
      expect(next.region.loading).toBe(!this.ticks);
      if (this.ticks) {
        done();
      }
      this.ticks += 1;
    }
    render() {
      return null;
    }
  }

  const ContainerWithData = withRegion()(Container);
  renderer.create(
    <MockedProvider>
      <ContainerWithData regionId="7fbe024f-3316-4265-a6e8-c65a837e308a" />
    </MockedProvider>);
});

it('should match snapshot', done => {
  class Container extends React.PureComponent<WithRegion> {
    // tslint:disable-next-line:no-inferrable-types
    ticks: number = 0;

    componentWillReceiveProps(next: WithRegion) {
      this.ticks += 1;
      if (this.ticks === 2) {
        expect(next).toMatchSnapshot();
        done();
      }
    }

    render() {
      return null;
    }
  }

  const ContainerWithData = withRegion()(Container);
  renderer.create(
    <MockedProvider>
      <ContainerWithData regionId="7fbe024f-3316-4265-a6e8-c65a837e308a" />
    </MockedProvider>);
});
