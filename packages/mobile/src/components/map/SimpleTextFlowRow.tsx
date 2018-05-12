import React from 'react';
import { Paragraph, Subheading } from 'react-native-paper';
import { WithT } from '../../i18n';
import { Row } from '../Row';

interface Props extends WithT {
  flowsText?: string;
}

const SimpleTextFlowRow: React.StatelessComponent<Props> = ({ t, flowsText }) => (
  <Row>
    <Subheading>{t('region:map.selectedSection.flows')}</Subheading>
    <Paragraph>
      {flowsText || t('commons:unknown')}
    </Paragraph>
  </Row>
);

export default SimpleTextFlowRow;
