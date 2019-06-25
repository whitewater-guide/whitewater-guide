import { SelectFieldProps } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React from 'react';

export type LanguagePickerProps = {
  language: string;
  onLanguageChange: (language: string) => void;
} & Omit<SelectFieldProps, 'value' | 'onChange'>;

export class LanguagePicker extends React.PureComponent<LanguagePickerProps> {
  onChange = (e: any, i: number, value: string) =>
    this.props.onLanguageChange(value);

  render() {
    const { language, onLanguageChange, ...props } = this.props;
    return (
      <SelectField {...props} value={language} onChange={this.onChange}>
        <MenuItem value="en" primaryText="English" />
        <MenuItem value="ru" primaryText="Russian" />
        <MenuItem value="es" primaryText="Spanish" />
        <MenuItem value="fr" primaryText="French" />
        <MenuItem value="de" primaryText="German" />
        <MenuItem value="pt" primaryText="Portuguese" />
        <MenuItem value="it" primaryText="Italian" />
      </SelectField>
    );
  }
}
