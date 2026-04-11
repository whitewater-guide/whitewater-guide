import { useActionSheet } from '@expo/react-native-action-sheet';
import sortBy from 'lodash/sortBy';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { useMapType } from '../../features/settings';
import theme from '../../theme';
import Icon from '../Icon';
import Layers from './layers';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: theme.margin.single,
    left: theme.margin.single,
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: theme.rounding.single,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 3,
    ...theme.shadow,
    elevation: theme.elevation,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LAYERS_ARRAY = sortBy(Object.values(Layers), 'order');
const NUM_LAYERS = LAYERS_ARRAY.length;

function LayersSelector() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  const { setMapType } = useMapType();

  const showMenu = useCallback(() => {
    const options = LAYERS_ARRAY.map(({ key }) => t(key)).concat(
      t('commons:cancel'),
    );
    showActionSheetWithOptions(
      {
        title: t('region:map.layers.prompt'),
        options,
        cancelButtonIndex: NUM_LAYERS,
      },
      (i) => {
        if (i !== undefined && i < NUM_LAYERS) {
          setMapType(LAYERS_ARRAY[i].url);
        }
      },
    );
  }, [showActionSheetWithOptions, setMapType, t]);

  return (
    <Pressable style={styles.button} onPress={showMenu}>
      <Icon icon="layers" narrow />
    </Pressable>
  );
}

export default React.memo(LayersSelector);
