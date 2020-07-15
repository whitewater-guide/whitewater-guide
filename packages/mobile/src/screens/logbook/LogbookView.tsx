import React from 'react';
import { LogbookNavProps } from './types';
import useMyDescents from './useMyDescents';
import LogbookList from './LogbookList';
import { AddDescentFAB } from './AddDescentFAB';

const LogbookView: React.FC<LogbookNavProps> = ({ navigation }) => {
  const { descents } = useMyDescents();
  return (
    <React.Fragment>
      <LogbookList descents={descents} />
      <AddDescentFAB navigate={navigation.navigate} />
    </React.Fragment>
  );
};

export default LogbookView;
