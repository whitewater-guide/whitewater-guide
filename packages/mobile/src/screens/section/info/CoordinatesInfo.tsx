import React from 'react';
import { Clipboard } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Icon, Left, Right, Row } from '../../../components';
import { purchaseActions } from '../../../features/purchases';
import { openGoogleMaps } from '../../../utils/maps';
import { consumeRegion, WithRegion } from '../../../ww-clients/features/regions';
import { arrayToDMSString } from '../../../ww-clients/utils';
import { Coordinate, Region, Section } from '../../../ww-commons';

interface OwnProps {
  label: string;
  coordinates: Coordinate;
  section: Section;
}

interface InnerProps extends OwnProps, WithRegion {
  buyRegion: (region: Region) => void;
}

class CoordinatesInfo extends React.PureComponent<InnerProps> {
  canNavigate = () => {
    const { section, region } = this.props;
    return (section && section.demo) || !region.node || !region.node.premium || region.node.hasPremiumAccess;
  };

  onCopy = () => {
    const { coordinates, region, buyRegion } = this.props;
    if (this.canNavigate()) {
      const prettyCoord = arrayToDMSString(coordinates);
      Clipboard.setString(prettyCoord);
    } else {
      buyRegion(region.node);
    }
  };

  onNavigate = () => {
    const { coordinates, region, buyRegion } = this.props;
    if (this.canNavigate()) {
      openGoogleMaps(coordinates);
    } else {
      buyRegion(region.node);
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
  connect(
    undefined,
    { buyRegion: (region: Region) => purchaseActions.openDialog({ region }) },
  ),
)(CoordinatesInfo);
