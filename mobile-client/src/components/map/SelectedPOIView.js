import React from "react";
import PropTypes from "prop-types";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "native-base";
import { connect } from "react-redux";
import { get } from 'lodash';
import { NavigateButton } from "../../components";

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  body: {
    flex: 1,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
});

class SelectedPOIView extends React.PureComponent {
  
  static propTypes = {
    selectedPOI: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    slideAnimated: PropTypes.any,
  };
  
  static defaultProps = {
    selectedPOI: null,
    slideAnimated: new Animated.Value(0),
  };
  
  render() {
    const { selectedPOI: poi, slideAnimated } = this.props;
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.body}>
            <Text>{get(poi, 'name', '_')}</Text>
          </View>
          <NavigateButton
            label="Navigate"
            driver={slideAnimated}
            inputRange={[100, 66]}
            coordinates={get(poi, 'coordinates', [0,0])}
          />
        </View>
      </View>
    );
  };
}

export default connect()(SelectedPOIView);
