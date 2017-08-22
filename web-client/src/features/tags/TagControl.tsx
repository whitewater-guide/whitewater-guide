import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
};

export default class TagControl extends React.Component {
  static propTypes = {
    tag: PropTypes.shape({
      _id: PropTypes.string,
      category: PropTypes.string,
      name: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    onRemove: PropTypes.func,
    onEdit: PropTypes.func,
  };

  static defaultProps = {
    onEdit: () => {},
    onRemove: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: !props.tag._id,
      tag: { ...props.tag },
    };
  }

  onToggleEditing = () => {
    const { editing, tag } = this.state;
    this.setState({ editing: !editing });
    if (editing) {
      this.props.onEdit(this.state.tag);
      if (!tag._id) {
        this.setState({ tag: { ...tag, name: '', slug: '' } });
      }
    }
  }

  onRemove = () => this.props.onRemove(this.props.tag.category, this.props.tag._id);

  onEditName = (e, name) => this.setState({ tag: { ...this.state.tag, name } });

  onEditSlug = (e, slug) => this.setState({ tag: { ...this.state.tag, slug } });

  render() {
    const { editing, tag } = this.state;
    return (
      <div style={styles.container}>
        <TextField hintText="Name" value={tag.name} onChange={this.onEditName} disabled={!editing} />
        <TextField hintText="URL Slug" value={tag.slug} onChange={this.onEditSlug} disabled={!editing} />
        <IconButton iconClassName="material-icons" onTouchTap={this.onToggleEditing} iconStyle={styles.icon}>
          { this.state.editing ? (tag._id ? 'checkmark' : 'add') : 'mode_edit' }
        </IconButton>
        {
          this.props.tag._id &&
          <IconButton iconClassName="material-icons" onTouchTap={this.onRemove} iconStyle={styles.icon}>
            delete_forever
          </IconButton>
        }
      </div>
  );
  }
}
