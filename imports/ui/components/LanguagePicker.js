import React, {PropTypes} from 'react';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { TAPi18n } from 'meteor/tap:i18n';
import _ from 'lodash';

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

  state = {
    open: false,
  };

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div>
        <DropDownMenu value={LANGS_TO_FLAGS[this.props.value]} onChange={(e,k,v) => this.props.onChange(v)}>
          {_.map(TAPi18n.getLanguages(), (v, langName) => this.renderMenuItem(langName))}
        </DropDownMenu>
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
