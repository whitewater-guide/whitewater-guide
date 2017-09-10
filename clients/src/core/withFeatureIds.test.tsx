import { shallow } from 'enzyme';
import * as React from 'react';
import { isNative } from '../utils/isNative';
import { withFeatureIds } from './withFeatureIds';

jest.mock('../utils/isNative', () => ({ isNative: jest.fn() }));

describe('default', () => {
  beforeAll(() => {
    (isNative as any).mockImplementation(() => false);
  });

  test('should keep explicit props', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const div = shallow(<Wrapped regionId="fff" riverId="rrr" />);
    expect(div.prop('regionId')).toBe('fff');
  });

  test('should support multiple props', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds(['region', 'section'])('div' as any);
    const div = shallow(<Wrapped regionId="fff" sectionId="sss" />);
    expect(div.prop('regionId')).toBe('fff');
    expect(div.prop('sectionId')).toBe('sss');
  });

  test('should not set props when no data is given', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const div = shallow(<Wrapped riverId="fff" />);
    expect(div.props()).toEqual({ riverId: 'fff' });
  });

  test('should handle react-router matches', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const match = { params: { regionId: 'fff' } };
    const div = shallow(<Wrapped match={match} />);
    expect(div.prop('regionId')).toBe('fff');
  });

  test('should handle react-router query string', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const location = {
      key: 'ac3df4',
      pathname: '/somewhere',
      search: '?regionId=fff&other=foo',
      hash: '#howdy',
    };
    const div = shallow(<Wrapped location={location} />);
    expect(div.prop('regionId')).toBe('fff');
  });

  test('should prefer explicit id', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const match = { params: { regionId: 'aaa' } };
    const div = shallow(<Wrapped regionId="fff" match={match} />);
    expect(div.prop('regionId')).toBe('fff');
  });
});

describe('react-native', () => {
  beforeAll(() => {
    (isNative as any).mockImplementation(() => true);
  });

  test('should handle react-navigation state in react-native', () => {
    const Wrapped: React.ComponentType<any> = withFeatureIds('region')('div' as any);
    const navigation = {
      key: 'ac3df4',
      routes: [],
      index: 0,
      state: {
        params: {
          regionId: 'fff',
        },
      },
    };
    const div = shallow(<Wrapped navigation={navigation} />);
    expect(div.prop('regionId')).toBe('fff');
  });
});
