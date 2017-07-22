import React from 'react';
import { Icon } from '../../components';

export default class SectionHelpButton extends React.PureComponent {
  onPress = () => this.props.navigation.navigate(
    'Plain', { data: 'fixture', title: 'FAQ', textId: 'faq', format: 'md' }
  );

  render() {
    return (
      <Icon
        width={64}
        height={45}
        primary
        wide
        icon="help-circle"
        onPress={this.onPress}
      />
    );
  }
}