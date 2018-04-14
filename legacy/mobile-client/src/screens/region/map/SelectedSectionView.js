import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { NavigationActions } from 'react-navigation';
import { capitalize, compact, get, trim } from 'lodash';
import { SectionPropType } from '../../../commons/features/sections';
import { durationToString } from '../../../commons/domain';
import stringifySeason from '../../../commons/utils/stringifySeason';
import {
  Body,
  Button,
  DifficultyThumb,
  Icon,
  Left,
  ListItem,
  NAVIGATE_BUTTON_WIDTH,
  NAVIGATE_BUTTON_HEIGHT,
  StarRating,
  Text,
} from '../../../components';
import { withGuideStep } from '../../../guide';
import SelectedElementView from '../../../components/map/SelectedElementView';
import theme from '../../../theme';
import SectionFlowsRow from './SectionFlowsRow';
import I18n from '../../../i18n';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    flex: 1,
  },
  drop: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    width: 2 * NAVIGATE_BUTTON_WIDTH - 8,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
  },
  guide: {
    ...StyleSheet.absoluteFillObject,
    bottom: NAVIGATE_BUTTON_HEIGHT,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  guideBox: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 4,
  },
  guideText: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

class SelectedSectionView extends React.Component {

  static propTypes = {
    selectedSection: SectionPropType,
    navigate: PropTypes.func.isRequired,
    onSectionSelected: PropTypes.func,
    onPOISelected: PropTypes.func,
    guideStep: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    const oldId = this.props.selectedSection && this.props.selectedSection._id;
    const newId = nextProps.selectedSection && nextProps.selectedSection._id;
    const gaugeStatusChanged = nextProps.guideStep.active !== this.props.guideStep.active;
    return oldId !== newId || gaugeStatusChanged;
  }

  onDetails = () => {
    this.props.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: this.props.selectedSection._id },
    });
  };

  onMaximize = () => {
    this.props.guideStep.complete();
  };

  renderBackground = () => {
    if (!this.props.selectedSection || this.props.guideStep.completed) {
      return null;
    }
    return (
      <View style={styles.guide} pointerEvents="none">
        <Animatable.View
          useNativeDriver
          style={styles.guideBox}
          animation="weakSlideInDown"
          iterationCount="infinite"
          direction="alternate"
        >
          <Icon narrow icon="arrow-up" color={theme.colors.textLight} />
          <Text style={styles.guideText}>{I18n.t('region.map.selectedSection.swipeUpTip')}</Text>
        </Animatable.View>
      </View>
    );
  };

  renderHeader = () => {
    const { selectedSection: section } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.body}>
          <Text numberOfLines={1}>{get(section, 'river.name', '_')}</Text>
          <Text numberOfLines={1}>{get(section, 'name', '_')}</Text>
          <View style={styles.starsContainer}>
            <StarRating value={get(section, 'rating', 0)} />
          </View>
        </View>
        <DifficultyThumb
          difficulty={get(section, 'difficulty', 1)}
          difficultyXtra={get(section, 'difficultyXtra', '_')}
          noBorder
        />
      </View>
    );
  };

  render() {
    const { selectedSection: section } = this.props;
    const buttons = [
      { label: I18n.t('commons.putIn'), coordinates: get(section, 'putIn.coordinates', [0, 0]) },
      { label: I18n.t('commons.takeOut'), coordinates: get(section, 'takeOut.coordinates', [0, 0]) },
    ];
    let season = ' \n ';
    if (section) {
      season = [
        capitalize(trim(stringifySeason(section.seasonNumeric, false, I18n.t('locale')))),
        trim(section.season),
      ].join('\n');
    }
    const duration = section && I18n.t('durations.' + durationToString(section.duration));
    const drop = section && section.drop;
    const distance = section && section.distance;
    const distanceStr = compact([distance ? `${distance} ${I18n.t('commons.km')}` : '', duration]).join(' / ');
    return (
      <SelectedElementView
        header={this.renderHeader()}
        background={this.renderBackground()}
        buttons={buttons}
        selected={!!section}
        onMaximize={this.onMaximize}
        {...this.props}
      >
        <View>
          <ListItem>
            <View style={styles.distance}>
              <Text>{I18n.t('commons.length')}</Text>
              <Text note right>{distanceStr}</Text>
            </View>
            <View style={styles.drop}>
              <Text>{I18n.t('commons.drop')}</Text>
              <Text note right>{drop ? `${drop} ${I18n.t('commons.m')}` : I18n.t('commons.unknown')}</Text>
            </View>
          </ListItem>

          <SectionFlowsRow section={section} />

          <ListItem>
            <Left><Text>{I18n.t('commons.season')}</Text></Left>
            <Body>
            <Text note right numberOfLines={2}>
              {season}
            </Text>
            </Body>
          </ListItem>
        </View>
        <Button primary label={I18n.t('region.map.selectedSection.details')} onPress={this.onDetails} />
      </SelectedElementView>
    );
  }

}

export default compose(
  connect(undefined, { navigate: NavigationActions.navigate }),
  withGuideStep(0, state => state.persistent.guidedTour),
)(SelectedSectionView);
