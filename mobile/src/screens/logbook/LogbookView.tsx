import React from 'react';

import { AddDescentFAB } from './AddDescentFAB';
import LogbookList from './LogbookList';
import { LogbookNavProps } from './types';

const LogbookView: React.FC<LogbookNavProps> = ({ navigation }) => {
  return (
    <React.Fragment>
      <LogbookList />
      <AddDescentFAB navigate={navigation.navigate} />
    </React.Fragment>
  );
};

export default LogbookView;
