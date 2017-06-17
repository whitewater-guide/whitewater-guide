import PropTypes from 'prop-types';
import React from 'react';
import { HTMLView, Screen } from '../../components';

const PlainTextScreen = ({ htmlText }) => (
  <Screen>
    <HTMLView value={htmlText} />
  </Screen>
);

PlainTextScreen.propTypes = {
  htmlText: PropTypes.string.isRequired,
};

PlainTextScreen.navigationOptions = {
  title: 'Guide',
};

export default PlainTextScreen;
