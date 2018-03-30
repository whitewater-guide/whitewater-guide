import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React from 'react';
import { compose } from 'recompose';
import { Styles } from '../../styles';
import { adminOnly } from '../adminOnly';
import { withLanguage, WithLanguage } from './withLanguage';

const styles: Styles = {
  languageSelect: {
    marginTop: -16,
  },
  selectedMenuItemStyle: {
    color: 'white',
  },
};

class LanguagePickerView extends React.PureComponent<WithLanguage> {
  onChange = (e: any, i: number, value: string) => this.props.onLanguageChange(value);

  render() {
    return (
      <SelectField
        style={styles.languageSelect}
        value={this.props.language}
        onChange={this.onChange}
        labelStyle={styles.selectedMenuItemStyle}
      >
        <MenuItem value="en" primaryText="English" />
        <MenuItem value="ru" primaryText="Russian" />
        <MenuItem value="es" primaryText="Spanish" />
        <MenuItem value="fr" primaryText="French" />
        <MenuItem value="de" primaryText="German" />
        <MenuItem value="pt" primaryText="Portuguese" />
      </SelectField>
    );
  }
}

export const LanguagePicker = compose(
  adminOnly,
  withLanguage,
)(LanguagePickerView);
