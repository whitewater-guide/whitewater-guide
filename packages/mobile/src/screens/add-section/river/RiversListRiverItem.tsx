import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import type { NamedNode } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { Subheading } from 'react-native-paper';

import RiversListItemBody from './RiversListItemBody';

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
  },
});

interface Props {
  id: string;
  name: string;
  onSelect?: (node: NamedNode) => void;
}

const RiversListRiverItem: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { id, name, onSelect } = props;
  const onPress = useCallback(() => {
    onSelect?.({ id, name });
  }, [id, name, onSelect]);
  const disabled = name.length < 2;

  return (
    <RiversListItemBody onPress={onPress} disabled={disabled}>
      <Subheading>
        {id === NEW_RIVER_ID ? (
          <>
            {t('screens:addSection.river.addItemPlaceholder')}
            <Text style={styles.name}>{` «${name}»`}</Text>
          </>
        ) : (
          name
        )}
      </Subheading>
    </RiversListItemBody>
  );
};

export default RiversListRiverItem;
