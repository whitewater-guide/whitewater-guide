import React from 'react';
import { WithI18n } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';
import { Row } from '../Row';

interface Props extends WithI18n {
  flowsText?: string | null;
}

const SimpleTextFlowRow: React.StatelessComponent<Props> = ({
  t,
  flowsText,
}) => (
  <Row>
    <Subheading>{t('region:map.selectedSection.flows')}</Subheading>
    <Paragraph>{!!flowsText || t('commons:unknown')}</Paragraph>
  </Row>
);

export default SimpleTextFlowRow;
