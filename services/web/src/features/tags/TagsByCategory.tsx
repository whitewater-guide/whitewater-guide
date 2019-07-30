import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Tag, TagCategory, TagInput } from '@whitewater-guide/commons';
import React from 'react';
import TagForm from './TagForm';

interface Props {
  category: TagCategory;
  title: string;
  tags: Tag[];
  onAdd: (tag: TagInput) => void;
  onRemove: (id: string) => void;
}

const TagsByCategory: React.FC<Props> = ({
  category,
  title,
  tags,
  onAdd,
  onRemove,
}) => (
  <Box display="flex" flexDirection="column" padding={1}>
    <Typography variant="h5">{title}</Typography>
    {tags.map((tag) => (
      <TagForm key={tag.id} tag={tag} onAdd={onAdd} onRemove={onRemove} />
    ))}
    <TagForm
      onAdd={onAdd}
      onRemove={onRemove}
      tag={{ id: '', name: '', category }}
    />
  </Box>
);

export default TagsByCategory;
