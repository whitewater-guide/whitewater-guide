import { arrayToLatLngString } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { Paragraph, Subheading } from 'react-native-paper';

import Icon from '~/components/Icon';
import { Left, Right, Row } from '~/components/Row';
import { PremiumSection, useRegionPremiumCallback } from '~/features/purchases';
import copyAndToast from '~/utils/copyAndToast';
import { openGoogleMaps } from '~/utils/maps';

interface Props {
  label: string;
  coordinates: CodegenCoordinates;
  section: PremiumSection;
}

const CoordinatesInfo = memo<Props>((props) => {
  const { coordinates, label, section } = props;
  const prettyCoord = arrayToLatLngString(coordinates);
  const [onCopy, accessAllowed] = useRegionPremiumCallback(section, () =>
    copyAndToast(prettyCoord),
  );
  const [onNavigate] = useRegionPremiumCallback(section, () =>
    openGoogleMaps(coordinates),
  );

  return (
    <Row>
      <Left>
        <Subheading>{label}</Subheading>
      </Left>
      <Right row>
        <Paragraph>{accessAllowed ? prettyCoord : ''}</Paragraph>
        <Icon
          icon="content-copy"
          accessibilityLabel="copy coordinate"
          onPress={onCopy}
        />
        <Icon icon="car" accessibilityLabel="navigate" onPress={onNavigate} />
      </Right>
    </Row>
  );
});

CoordinatesInfo.displayName = 'CoordinatesInfo';

export default CoordinatesInfo;
