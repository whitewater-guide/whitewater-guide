import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import { HTMLView, Markdown, Screen } from '../../components';

const PlainTextScreen = ({ htmlText, format }) => (
  <Screen>
    {
      format === 'html' ?
        <HTMLView value={htmlText} /> :
        <Markdown>{htmlText}</Markdown>
    }
  </Screen>
);

PlainTextScreen.propTypes = {
  htmlText: PropTypes.string.isRequired,
  format: PropTypes.oneOf(['html', 'md']).isRequired,
};

PlainTextScreen.navigationOptions = ({ navigation }) => {
  const title = get(navigation, 'state.params.title', ' ');
  return { title };
};

export default PlainTextScreen;
