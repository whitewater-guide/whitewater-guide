import * as casual from 'casual';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { MockingProvider } from '../../test/MockingProvider';
import { withRegion } from './withRegion';

beforeEach(() => {
  casual.seed(1);
})

it('has a loading state', done => {
  class Container extends React.PureComponent<WithRegion> {
    ticks = 0;

    componentWillMount() {
      expect(this.props.regionLoading).toBe(true);
    }
    componentWillReceiveProps(next: WithRegion) {
      // This is weird cahce-and network behavior, takes 2 ticks to set loading to false
      expect(next.regionLoading).toBe(this.ticks ? false : true);
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
    <MockingProvider>
      <ContainerWithData regionId={'7fbe024f-3316-4265-a6e8-c65a837e308a'}/>
    </MockingProvider>
  );
});
