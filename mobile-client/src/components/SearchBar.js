import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../theme/variables/platform';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    right: 32,
  },
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    width: 40,
  },
  input: {
    flex: 1,
  },
});

class SearchBar extends React.Component {

  static propTypes = {
    searchString: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    searchString: '',
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      searchOn: !!props.searchString,
      width: 0,
      position: new Animated.Value(props.searchString ? 1 : 0),
    };
  }

  onHeaderLayout = ({ nativeEvent: { layout: { width } } }) => this.setState({ width });

  onPressSearch = () => {
    if (this.state.searchOn) {
      return;
    }
    this.setState({ searchOn: true });
    Animated.timing(
      this.state.position,
      { toValue: 1, easing: Easing.out(Easing.ease), useNativeDriver: true },
    ).start();
    this._input.focus();
  };

  onCancelSearch = () => {
    this.setState({ searchOn: false });
    this.props.onChange('');
    Animated.timing(
      this.state.position,
      { toValue: 0, easing: Easing.out(Easing.ease), useNativeDriver: true },
    ).start();
    this._input.blur();
  };

  setInputRef = (input) => { this._input = input; };

  render() {
    const { position, searchOn, width } = this.state;
    const headerTranslate = position.interpolate({ inputRange: [0, 1], outputRange: [0, -width + 32] });
    const searchTranslate = position.interpolate({ inputRange: [0, 1], outputRange: [width, 32] });
    const headerStyle = [styles.header, { transform: [{ translateX: headerTranslate }] }];
    const searchStyle = [styles.search, { transform: [{ translateX: searchTranslate }] }];
    const rotate = { transform: [{
      rotate: position.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
    ] };
    return (
      <View style={styles.container}>
        <Animated.View style={headerStyle} onLayout={this.onHeaderLayout}>
          { this.props.children }
          <TouchableOpacity style={styles.button} onPress={this.onPressSearch} disabled={searchOn}>
            <AnimatedIcon
              style={rotate}
              name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
              size={20}
              color={variables.btnPrimaryBg}
            />
          </TouchableOpacity>
        </Animated.View >
        {
          this.state.width > 0 &&
          <Animated.View style={searchStyle}>
            <TextInput
              ref={this.setInputRef}
              style={styles.input}
              value={this.props.searchString}
              onChangeText={this.props.onChange}
            />
            <TouchableOpacity style={styles.button} onPress={this.onCancelSearch}>
              <AnimatedIcon
                name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                size={24}
                color={variables.btnPrimaryBg}
              />
            </TouchableOpacity>
          </Animated.View>
        }
      </View>
    );
  }
}

export default SearchBar;
