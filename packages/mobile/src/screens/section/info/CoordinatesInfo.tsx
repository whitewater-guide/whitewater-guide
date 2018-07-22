import React from 'react';
import { Clipboard } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import { compose } from 'recompose';
import { Icon, Left, Right, Row } from '../../../components';
import { connectPremiumDialog, WithPremiumDialog } from '../../../features/purchases';
import { openGoogleMaps } from '../../../utils/maps';
import { consumeRegion, WithRegion } from '../../../ww-clients/features/regions';
import { arrayToDMSString } from '../../../ww-clients/utils';
import { Coordinate, Section } from '../../../ww-commons';

interface OwnProps {
  label: string;
  coordinates: Coordinate;
  section: Section;
}

type InnerProps = OwnProps & WithRegion & WithPremiumDialog;

class CoordinatesInfo extends React.PureComponent<InnerProps> {
  canNavigate = () => {
    const { section, region, canMakePayments } = this.props;
    return (section && section.demo) ||
      !canMakePayments ||
      !region.node ||
      !region.node.premium ||
      region.node.hasPremiumAccess;
  };

  onCopy = () => {
    const { coordinates, region, buyRegion } = this.props;
    if (this.canNavigate()) {
      const prettyCoord = arrayToDMSString(coordinates);
      Clipboard.setString(prettyCoord);
    } else if (region.node) {
      buyRegion(region.node);
    }
  };

  onNavigate = () => {
    const { coordinates, region, buyRegion, section } = this.props;
    if (this.canNavigate()) {
      openGoogleMaps(coordinates);
    } else if (region.node) {
      buyRegion(region.node, section.id);
    }
  };

  render() {
    const { coordinates, label } = this.props;
    const prettyCoord = this.canNavigate() ? arrayToDMSString(coordinates) : '';
    return (
      <Row>
        <Left>
          <Subheading>{label}</Subheading>
        </Left>
        <Right flexDirection="row">
          <Paragraph>{prettyCoord}</Paragraph>
          <Icon icon="content-copy" onPress={this.onCopy} />
          <Icon icon="car" onPress={this.onNavigate} />
        </Right>
      </Row>
    );
  }
}

export default compose<InnerProps, OwnProps>(
  consumeRegion(),
  connectPremiumDialog,
)(CoordinatesInfo);
