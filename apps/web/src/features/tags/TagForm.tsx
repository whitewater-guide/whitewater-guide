import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import type { Tag, TagInput } from '@whitewater-guide/schema';
import type { FC } from 'react';
import React, { useState } from 'react';
import useShallowCompareEffect from 'react-use/lib/useShallowCompareEffect';

import { DeleteButton } from '../../components';

interface Props {
  tag: Tag;
  onAdd: (tag: TagInput) => void;
  onRemove: (id: string) => void;
}

const TagForm: FC<Props> = ({ tag, onAdd, onRemove }) => {
  const [state, setState] = useState<TagInput>({ ...tag });

  useShallowCompareEffect(() => {
    setState({ ...tag });
  }, [tag, setState]);

  const onIdChange = (e: any) =>
    setState((t) => ({ ...t, id: e.target.value }));

  const onNameChange = (e: any) =>
    setState((t) => ({ ...t, name: e.target.value }));

  const onSave = () => onAdd(state);

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <TextField
          fullWidth
          value={state.id}
          placeholder="id"
          onChange={onIdChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          value={state.name}
          placeholder="Name"
          onChange={onNameChange}
        />
      </Grid>

      <Grid item xs={2}>
        <IconButton
          onClick={onSave}
          disabled={tag.id === state.id && tag.name === state.name}
        >
          <Icon>{tag.id ? 'save' : 'add'}</Icon>
        </IconButton>
        <DeleteButton id={tag.id} disabled={!tag.id} deleteHandler={onRemove} />
      </Grid>
    </Grid>
  );
};

export default TagForm;
