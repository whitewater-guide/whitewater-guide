import { formatDistanceToNow, prettyNumber } from '@whitewater-guide/clients';
import { NodeRef } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import * as i18next from 'i18next';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import theme from '../../../theme';
import { ListedGauge } from './types';

const styles = StyleSheet.create({
  row: {
    height: 56,
    padding: theme.margin.single,
    flexDirection: 'row',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  value: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: theme.colors.textMain,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textNote,
  },
});

interface Props {
  gauge: ListedGauge;
  onPress: (ref: NodeRef) => void;
}

const getValue = (gauge: ListedGauge, t: i18next.TFunction) => {
  const { flowUnit, levelUnit, latestMeasurement } = gauge;
  if (!latestMeasurement || (!flowUnit && !levelUnit)) {
    return null;
  }
  const fromNow = formatDistanceToNow(parseISO(latestMeasurement.timestamp), {
    addSuffix: true,
  });
  if (flowUnit && latestMeasurement.flow) {
    return [
      prettyNumber(latestMeasurement.flow) + ' ' + t('commons:' + flowUnit),
      fromNow,
    ];
  }
  if (levelUnit && latestMeasurement.level) {
    return [
      prettyNumber(latestMeasurement.level) + ' ' + t('commons:' + levelUnit),
      fromNow,
    ];
  }
  return null;
};

const GaugesListItem: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { gauge, onPress } = props;
  const { id, code, name } = gauge;
  const onSelect = useCallback(() => onPress({ id, name }), [
    id,
    name,
    onPress,
  ]);
  const value = useMemo(() => getValue(gauge, t), [gauge, t]);
  return (
    <TouchableRipple onPress={onSelect}>
      <View style={styles.row}>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {code}
          </Text>
        </View>
        {!!value && (
          <View style={styles.value}>
            <Text style={styles.title}>{value[0]}</Text>
            <Text style={styles.subtitle}>{value[1]}</Text>
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};

GaugesListItem.displayName = 'GaugesListItem';

export default GaugesListItem;
