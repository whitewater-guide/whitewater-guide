import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

import theme from '../../../theme';

interface Props {
  search: string;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: theme.rowHeight,
    paddingLeft: theme.margin.single,
  },
});

function EmptyListPlaceholder({ search }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Caption>
        {t(
          search
            ? 'screens:addSection.gauge.listNotFound'
            : 'screens:addSection.gauge.listNoInput',
        )}
      </Caption>
    </View>
  );
}

export default EmptyListPlaceholder;
