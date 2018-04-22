import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import { WithT } from '../../i18n';
import theme from '../../theme';

const styles = StyleSheet.create({
  listItem: {
    padding: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.rowHeight,
  },
});

interface Props extends WithT {
  flowsText?: string;
}

const SimpleTextFlowRow: React.StatelessComponent<Props> = ({ t, flowsText }) => (
  <View style={styles.listItem}>
    <Subheading>{t('region:map.selectedSection.flows')}</Subheading>
    <Paragraph>
      {flowsText || t('commons:unknown')}
    </Paragraph>
  </View>
);

export default SimpleTextFlowRow;
