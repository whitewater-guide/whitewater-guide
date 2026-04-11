import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { Row } from '../../Row';

interface Props {
  flowsText?: string | null;
  style?: StyleProp<ViewStyle>;
}

function SimpleTextFlowRow({ flowsText, style }: Props) {
  const [t] = useTranslation();
  return (
    <Row style={style}>
      <Text variant="titleSmall">{t('region:map.selectedSection.flows')}</Text>
      <Text variant="bodyMedium" adjustsFontSizeToFit>
        {flowsText || t('commons:unknown')}
      </Text>
    </Row>
  );
}

export default SimpleTextFlowRow;
