import { Tag, TagInput } from '@whitewater-guide/commons';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import React from 'react';
import { DeleteButton } from '../../components';
import { Styles } from '../../styles';
import { WithTagMutations } from './types';

const styles: Styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

interface Props extends WithTagMutations {
  tag: Tag;
}

class TagForm extends React.PureComponent<Props, TagInput> {
  constructor(props: Props) {
    super(props);
    const { __typename, ...tag } = props.tag;
    this.state = { ...tag };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { __typename, ...nextTag }: Tag = nextProps.tag;
    if (
      nextTag.id !== this.state.id ||
      nextTag.name !== this.state.name ||
      nextTag.category !== this.state.category
    ) {
      this.setState({ ...nextTag });
    }
  }

  onIdChange = (e: any, id: string) => this.setState({ id });
  onNameChange = (e: any, name: string) => this.setState({ name });

  onSave = () => this.props.upsertTag(this.state);

  render() {
    const { id, name } = this.state;
    const { tag, removeTag } = this.props;
    return (
      <div style={styles.row}>
        <TextField
          fullWidth={true}
          value={id}
          floatingLabelText="id"
          hintText="id"
          onChange={this.onIdChange}
        />
        <TextField
          fullWidth={true}
          value={name}
          floatingLabelText="Name"
          hintText="Name"
          onChange={this.onNameChange}
        />
        <IconButton
          iconClassName="material-icons"
          onClick={this.onSave}
          disabled={tag.id === id && tag.name === name}
        >
          {tag.id ? 'save' : 'add'}
        </IconButton>
        <DeleteButton
          id={tag.id}
          disabled={!tag.id}
          deleteHandler={removeTag}
        />
      </div>
    );
  }
}

export default TagForm;
