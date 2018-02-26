import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';
import { Styles } from '../../styles';
import { WithLanguage } from './withLanguage';

const styles: Styles = {
  languageSelect: {
    marginTop: -16,
  },
  selectedMenuItemStyle: {
    color: 'white',
  },
};

export class LanguagePicker extends React.PureComponent<WithLanguage> {
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
