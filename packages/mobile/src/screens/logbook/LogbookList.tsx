import { Descent } from '@whitewater-guide/commons';
import React from 'react';
import { FlatList } from 'react-native';
import {
  getItemLayout,
  useRenderDescent,
} from '~/screens/logbook/LogbookListItem';

const keyExtractor = (descent: Descent) => descent.id;

interface Props {
  descents: Descent[];
}

const LogbookList: React.FC<Props> = ({ descents }) => {
  const renderItem = useRenderDescent();
  return (
    <FlatList
      data={descents}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      keyExtractor={keyExtractor}
      testID="descents-list"
    />
  );
};

export default LogbookList;
