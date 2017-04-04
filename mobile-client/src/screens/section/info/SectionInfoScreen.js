import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import StarRating from 'react-native-star-rating';
import { Screen } from '../../../components';

class SectionInfoScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Info',
    },
  };

  render() {
    const { screenProps: { section = { river: {} }, sectionLoading } } = this.props;
    return (
      <Screen loading={sectionLoading}>
        <Grid>

          <Row>
            <Col><Text>Difficulty</Text></Col>
            <Col><Text>{section.difficulty}</Text></Col>
          </Row>

          <Row>
            <Col><Text>Rating</Text></Col>
            <Col>
              <View style={{ width: 80 }}>
                <StarRating disabled rating={section.rating} starSize={14} />
              </View>
            </Col>
          </Row>

          <Row>
            <Col><Text>Drop</Text></Col>
            <Col><Text>{section.drop}</Text></Col>
          </Row>

          <Row>
            <Col><Text>Length, km</Text></Col>
            <Col><Text>{section.distance}</Text></Col>
          </Row>

          <Row>
            <Col><Text>Duration</Text></Col>
            <Col><Text>{section.duration}</Text></Col>
          </Row>

          <Row>
            <Col><Text>Season</Text></Col>
            <Col><Text>{section.season}</Text></Col>
          </Row>

        </Grid>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionInfoScreen);
