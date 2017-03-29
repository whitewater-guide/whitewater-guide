import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Content, Spinner, Text } from 'native-base';

class RegionMapScreen extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Map',
  };

  render() {
    // Problem: screen props not updating:
    // https://github.com/react-community/react-navigation/issues/577
    // https://github.com/react-community/react-navigation/issues/849
    const { screenProps: { region, regionLoading } } = this.props;
    return (
      <Container>
        <Content>
          {
            (!region || regionLoading) ? (<Spinner />) : (<Text>{`Region ${region.name}`}</Text>)
          }
        </Content>
      </Container>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionMapScreen);
