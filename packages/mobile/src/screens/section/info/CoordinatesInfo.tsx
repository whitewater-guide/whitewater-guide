import { arrayToLatLngString, useRegion } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { Clipboard } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import Icon from '~/components/Icon';
import { Left, Right, Row } from '~/components/Row';

import {
  PremiumSection,
  usePremiumAccess,
  usePremiumGuard,
} from '../../../features/purchases';
import { openGoogleMaps } from '../../../utils/maps';

interface Props {
  label: string;
  coordinates: CodegenCoordinates;
  section: PremiumSection;
}

const CoordinatesInfo: React.FC<Props> = React.memo((props) => {
  const { coordinates, label, section } = props;
  const region = useRegion();
  const isFree = usePremiumAccess(region, section);
  const premiumGuard = usePremiumGuard(region, section);
  const prettyCoord = isFree ? arrayToLatLngString(coordinates) : '';

  const onCopy = useCallback(() => {
    if (premiumGuard()) {
      Clipboard.setString(prettyCoord);
    }
  }, [premiumGuard, prettyCoord]);

  const onNavigate = useCallback(() => {
    if (premiumGuard()) {
      openGoogleMaps(coordinates);
    }
  }, [premiumGuard, coordinates]);

  return (
    <Row>
      <Left>
        <Subheading>{label}</Subheading>
      </Left>
      <Right row>
        <Paragraph>{prettyCoord}</Paragraph>
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
