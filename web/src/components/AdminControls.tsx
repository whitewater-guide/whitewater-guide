import IconButton from 'material-ui/IconButton';
import * as React from 'react';

const styles = {
  iconWrapper: {
    paddingLeft: 2,
    paddingRight: 2,
    width: 'auto',
  },
};

interface Props {
  toggleable: boolean;
  isOn: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export class AdminControls extends React.PureComponent<Props> {

  onClick = (e: React.SyntheticEvent<any>) => e.stopPropagation();

  render() {
    const { toggleable, isOn, onToggle, onEdit, onDelete } = this.props;
    return (
      <span onClick={this.onClick}>
        {
          toggleable &&
          <IconButton
            iconClassName="material-icons"
            style={styles.iconWrapper}
            onTouchTap={onToggle}
          >
            {isOn ? 'stop' : 'play_arrow'}
          </IconButton>}
        <IconButton
          iconClassName="material-icons"
          style={styles.iconWrapper}
          onTouchTap={onEdit}
        >
          mode_edit
        </IconButton>
        <IconButton
          iconClassName="material-icons"
          style={styles.iconWrapper}
          onTouchTap={onDelete}
        >
          delete_forever
        </IconButton>
      </span>
    );
  }
}
