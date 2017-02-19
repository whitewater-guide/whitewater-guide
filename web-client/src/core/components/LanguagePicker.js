import React, {PropTypes} from "react";
import MenuItem from "material-ui/MenuItem";
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import FlatButton from 'material-ui/FlatButton';
import {LANGUAGES, LANGS_TO_FLAGS} from '../../i18n';
import Flag from "react-flags";
import _ from "lodash";

export class LanguagePicker extends React.Component {

  static propTypes = {
    value: PropTypes.string,//Language code, not country code (i.e. 'en' and not 'us')
    onChange: PropTypes.func,//Receives language code
  };

  state = {
    open: false,
  };

  render() {
    return (
      <div>
        <FlatButton style={styles.button} onTouchTap={this.handleTouchTap} disableTouchRipple={true}>
          <Flag name={LANGS_TO_FLAGS[this.props.value]} format="png" pngSize={24} basePath="/static/media/flags"/>
          <DropDownArrow/>
        </FlatButton>
        <Popover open={this.state.open} anchorEl={this.state.anchorEl} onRequestClose={this.handleRequestClose}>
          <Menu>
            {_.map(LANGUAGES, (v, langCode) => this.renderMenuItem(langCode, v.en))}
          </Menu>
        </Popover>
      </div>
    );
  }

  renderMenuItem = (langCode, langName) => {
    const countryCode = LANGS_TO_FLAGS[langCode];
    return (
      <MenuItem key={langCode} value={langCode} onTouchTap={() => this.props.onChange(langCode)}
                disableTouchRipple={true} style={styles.menuItem}>
        <Flag name={countryCode} format="png" pngSize={24} basePath="/static/media/flags"/>
        <span style={styles.langName}>{langName}</span>
      </MenuItem>
    );
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

}

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 48,
    paddingLeft: 8,
  },
  menuItem: {
    minWidth: 48,
    alignItems: 'center',
  },
  langName: {
    paddingLeft: 8,
  },
};
