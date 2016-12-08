import React, {PropTypes} from "react";
import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";
import {TAPi18n} from "meteor/tap:i18n";
import _ from "lodash";

const LANGS_TO_FLAGS = {
  ru: 'ru',
  en: 'us',
  es: 'es',
};

export default class LanguagePicker extends React.Component {

  static propTypes = {
    value: PropTypes.string,//Language code, not country code (i.e. 'en' and not 'us')
    onChange: PropTypes.func,//Receives language code
  };

  render() {
    return (
      <div>
        <IconMenu
          iconButtonElement={this.renderMenuItem(this.props.value)}
          onChange={(e,v) => this.props.onChange(v)}
          value={LANGS_TO_FLAGS[this.props.value]}
        >
          {_.map(TAPi18n.getLanguages(), (v, langName) => this.renderMenuItem(langName))}
        </IconMenu>
      </div>
    );
  }

  renderMenuItem = (langName) => {
    const countryCode = LANGS_TO_FLAGS[langName];
    const className = `flag-icon flag-icon-${countryCode}`;
    return (
      <MenuItem key={langName} value={langName}>
        <span className={className}/>
      </MenuItem>
    );
  };

  onChange = (langName) => {
    this.props.onChange(langName);
  };

};
