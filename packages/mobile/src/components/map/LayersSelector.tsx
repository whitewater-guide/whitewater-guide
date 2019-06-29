import sortBy from 'lodash/sortBy';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { useMapType } from '../../features/settings';
import theme from '../../theme';
import { Icon } from '../Icon';
import Layers from './layers';

const styles = StyleSheet.create({
  icon: {
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
  },
});

const LAYERS_ARRAY = sortBy(Object.values(Layers), 'order');
const NUM_LAYERS = LAYERS_ARRAY.length;

const LayersSelector: React.FC = React.memo(() => {
  const actionSheet = useRef<ActionSheet | null>(null);

  const { t } = useTranslation();
  const options = useMemo(
    () => LAYERS_ARRAY.map(({ key }) => t(key)).concat(t('commons:cancel')),
    [t],
  );

  const { mapType, setMapType } = useMapType();

  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);

  const onMenu = useCallback(
    (index: number) => {
      if (index === NUM_LAYERS) {
        return;
      }
      setMapType(LAYERS_ARRAY[index].url);
    },
    [setMapType],
  );

  return (
    <React.Fragment>
      <Icon icon="layers" style={styles.icon} onPress={showMenu} />
      <ActionSheet
        ref={actionSheet}
        title={t('region:map.layers.prompt')}
        options={options}
        cancelButtonIndex={NUM_LAYERS}
        onPress={onMenu}
      />
    </React.Fragment>
  );
});

LayersSelector.displayName = 'LayersSelector';

export default LayersSelector;
