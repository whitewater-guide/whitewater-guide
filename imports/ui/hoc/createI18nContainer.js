import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
/**
 * Workaround component for multilingual forms
 * @param options
 * @param Component
 */
export default function createI18nContainer(options = {}, Component){
  const MeteorContainer = createContainer(options, Component);

  class I18nComponent extends React.Component {

    state = {
      language: 'en',
    };

    onLanguageChange = (language) => {
      this.setState({language});
    };

    render() {
      return <MeteorContainer {...this.props} language={this.state.language} onLanguageChange={this.onLanguageChange}/>;
    }
  }

  return I18nComponent;

}