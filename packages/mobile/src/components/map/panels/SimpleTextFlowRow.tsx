import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';
import { Row } from '../../Row';

interface Props {
  flowsText?: string | null;
}

const SimpleTextFlowRow: React.FC<Props> = ({ flowsText }) => {
  const [t] = useTranslation();
  return (
    <Row>
      <Subheading>{t('region:map.selectedSection.flows')}</Subheading>
      <Paragraph>{!!flowsText || t('commons:unknown')}</Paragraph>
    </Row>
  );
};

export default SimpleTextFlowRow;
