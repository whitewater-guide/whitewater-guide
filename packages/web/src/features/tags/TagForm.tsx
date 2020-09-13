import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { Tag, TagInput } from '@whitewater-guide/commons';
import React from 'react';

import { DeleteButton } from '../../components';

interface Props {
  tag: Tag;
  onAdd: (tag: TagInput) => void;
  onRemove: (id: string) => void;
}

class TagForm extends React.PureComponent<Props, TagInput> {
  constructor(props: Props) {
    super(props);
    const { __typename, ...tag } = props.tag;
    this.state = { ...tag };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { __typename, ...nextTag }: Tag = nextProps.tag;
    if (
      nextTag.id !== this.state.id ||
      nextTag.name !== this.state.name ||
      nextTag.category !== this.state.category
    ) {
      this.setState({ ...nextTag });
    }
  }

  onIdChange = (e: any) => this.setState({ id: e.target.value });
  onNameChange = (e: any) => this.setState({ name: e.target.value });

  onSave = () => this.props.onAdd(this.state);

  render() {
    const { id, name } = this.state;
    const { tag, onRemove } = this.props;
    return (
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={4}>
          <TextField
            fullWidth={true}
            value={id}
            placeholder="id"
            onChange={this.onIdChange}
          />
        </Grid>
        <Grid item={true} xs={6}>
          <TextField
            fullWidth={true}
            value={name}
            placeholder="Name"
            onChange={this.onNameChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <IconButton
            onClick={this.onSave}
            disabled={tag.id === id && tag.name === name}
          >
            <Icon>{tag.id ? 'save' : 'add'}</Icon>
          </IconButton>
          <DeleteButton
            id={tag.id}
            disabled={!tag.id}
            deleteHandler={onRemove}
          />
        </Grid>
      </Grid>
    );
  }
}

export default TagForm;
