// tslint:disable:max-classes-per-file
import * as casual from 'casual';
import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { MockingProvider } from '../../test/MockingProvider';
import { shallowRecursively } from '../../test/shallowRecursively';
import { NEW_REGION, withRegion, WithRegion } from './withRegion';

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
    <MockingProvider>
      <ContainerWithData regionId="7fbe024f-3316-4265-a6e8-c65a837e308a" />
    </MockingProvider>);
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
    <MockingProvider>
      <ContainerWithData regionId="7fbe024f-3316-4265-a6e8-c65a837e308a" />
    </MockingProvider>);
});

test('should pass new region when regionId not found', () => {
  const Wrapped: React.ComponentType<any> = withRegion()('div' as any);
  const wrapped = shallow(<Wrapped />);
  const deep = shallowRecursively(wrapped, 'div');
  expect(deep.prop('region').data).toEqual(NEW_REGION);
});
