import React, {PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';

export class AdminControls extends React.Component {
  static propTypes = {
    toggleable: PropTypes.bool,
    isOn: PropTypes.bool,
    onToggle: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    toggleable: false,
    onToggle: () => {},
    onEdit: () => {},
    onDelete: () => {},
  };

  render() {
    const {toggleable, isOn, onToggle, onEdit, onDelete} = this.props;
    return (
      <span onClick={(event) => event.stopPropagation()}>
        {toggleable && <IconButton iconClassName="material-icons" style={styles.iconWrapper}
                                  onTouchTap={onToggle}>{isOn ? 'stop' : 'play_arrow'}</IconButton>}
        <IconButton iconClassName="material-icons" style={styles.iconWrapper}
                    onTouchTap={onEdit}>mode_edit</IconButton>
        <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={onDelete}>delete_forever</IconButton>
      </span>
    );
  }
}

const styles = {
  iconWrapper: {
    paddingLeft: 2,
    paddingRight: 2,
    width: 'auto',
  },
};