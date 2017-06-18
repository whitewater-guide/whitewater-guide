import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import { HTMLView, Screen } from '../../components';

const PlainTextScreen = ({ htmlText }) => (
  <Screen>
    <HTMLView value={htmlText} />
  </Screen>
);

PlainTextScreen.propTypes = {
  htmlText: PropTypes.string.isRequired,
};

PlainTextScreen.navigationOptions = ({ navigation }) => {
  const data = get(navigation, 'state.params.data');
  let title = ' ';
  switch (data) {
    case 'source':
      title = 'About data source';
      break;
    default:
      title = ' ';
  }
  return { title };
};

export default PlainTextScreen;
