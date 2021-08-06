import React from 'react';

import { AddDescentFAB } from './AddDescentFAB';
import LogbookList from './LogbookList';
import { LogbookNavProps } from './types';

const LogbookView: React.FC<LogbookNavProps> = ({ navigation }) => (
  <>
    <LogbookList />
    <AddDescentFAB navigate={navigation.navigate} />
  </>
);

export default LogbookView;
