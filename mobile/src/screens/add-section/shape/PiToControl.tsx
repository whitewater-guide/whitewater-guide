import { arrayToLatLngString } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from 'react-native-fast-image';
import { Subheading, Title } from 'react-native-paper';

import { ICON_SIZE, PUT_IN_ICON, TAKE_OUT_ICON } from '../../../assets';
import theme from '../../../theme';
import { PiToState } from './usePiToState';

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.margin.single,
  },
  selected: {
    backgroundColor: theme.colors.primaryDarker,
  },
  text: {
    color: theme.colors.textLight,
    lineHeight: undefined,
  },
  smallText: {
    fontSize: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: theme.margin.single,
  },
});

interface Props {
  index: 0 | 1;
  state: PiToState;
  select: (selected: PiToState['selected']) => void;
}

const PiToControl: React.FC<Props> = React.memo((props) => {
  const { index, state, select } = props;
  const { selected, shape } = state;
  const isDefined = shape[index] !== undefined;
  const { t } = useTranslation();
  const onPress = useCallback(() => {
    const newIndex = selected === index ? -1 : index;
    select(newIndex);
  }, [select, selected, index]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.touchable}
      testID={`pito-button-${index}`}
    >
      <View style={[styles.container, index === selected && styles.selected]}>
        <View style={styles.titleWrapper}>
          <Image
            source={index === 0 ? PUT_IN_ICON : TAKE_OUT_ICON}
            style={styles.icon}
          />
          <Title style={styles.text}>
            {t(index === 0 ? 'commons:putIn' : 'commons:takeOut')}
          </Title>
        </View>
        <Subheading
          style={[styles.text, isDefined && styles.smallText]}
          numberOfLines={1}
        >
          {isDefined
            ? arrayToLatLngString(shape[index])
            : t('screens:addSection.shape.pressCta')}
        </Subheading>
      </View>
    </TouchableOpacity>
  );
});

PiToControl.displayName = 'PiToControl';

export default PiToControl;
