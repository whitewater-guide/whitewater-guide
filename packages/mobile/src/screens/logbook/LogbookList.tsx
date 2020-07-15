import { LogbookDescent } from '@whitewater-guide/logbook-schema';
import React from 'react';
import { FlatList } from 'react-native';
import {
  getItemLayout,
  useRenderDescent,
} from '~/screens/logbook/LogbookListItem';

const keyExtractor = (descent: LogbookDescent) => descent.id;

interface Props {
  descents: LogbookDescent[];
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
