import React from 'react';
import { View } from 'react-native';

const MockPager = ({ children }: any) => {
  return children({
    position: 0,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    jumpTo: jest.fn(),
    render: (childrn: any) => <View>{childrn}</View>,
  });
};

const getPager = (props: any) => <MockPager {...props} />;

export default getPager;
