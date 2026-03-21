import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StyleProp, ViewStyle } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import { Row } from '../../Row';

interface Props {
  flowsText?: string | null;
  style?: StyleProp<ViewStyle>;
}

const SimpleTextFlowRow: React.FC<Props> = ({ flowsText, style }) => {
  const [t] = useTranslation();
  return (
    <Row style={style}>
      <Subheading>{t('region:map.selectedSection.flows')}</Subheading>
      <Paragraph adjustsFontSizeToFit>
        {flowsText || t('commons:unknown')}
      </Paragraph>
    </Row>
  );
};

export default SimpleTextFlowRow;
