import sortBy from 'lodash/sortBy';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { RectButton } from 'react-native-gesture-handler';
import { useMapType } from '../../features/settings';
import theme from '../../theme';
import { Icon } from '../Icon';
import { useActionSheet } from '../useActionSheet';
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
    elevation: theme.elevation,
  },
  rectButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LAYERS_ARRAY = sortBy(Object.values(Layers), 'order');
const NUM_LAYERS = LAYERS_ARRAY.length;

const LayersSelector: React.FC = React.memo(() => {
  const [actionSheet, showMenu] = useActionSheet();

  const { t } = useTranslation();
  const options = useMemo(
    () => LAYERS_ARRAY.map(({ key }) => t(key)).concat(t('commons:cancel')),
    [t],
  );

  const { mapType, setMapType } = useMapType();

  const onMenu = useCallback(
    (index: number) => {
      if (index === NUM_LAYERS) {
        return;
      }
      setMapType(LAYERS_ARRAY[index].url);
    },
    [setMapType],
  );

  // TODO: works on android only: https://github.com/kmagiera/react-native-gesture-handler/pull/537
  const icon =
    Platform.OS === 'ios' ? (
      <Icon icon="layers" style={styles.icon} onPress={showMenu} />
    ) : (
      <RectButton onPress={showMenu} style={[styles.icon, styles.rectButton]}>
        <Icon icon="layers" />
      </RectButton>
    );

  return (
    <React.Fragment>
      {icon}
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
