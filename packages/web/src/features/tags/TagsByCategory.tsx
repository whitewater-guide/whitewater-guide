import React from 'react';
import { Styles } from '../../styles';
import { Tag, TagCategory } from '../../ww-commons';
import TagForm from './TagForm';
import { WithTagMutations } from './types';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
  },
};

interface Props extends WithTagMutations {
  language: string;
  category: TagCategory;
  title: string;
  tags: Tag[];
}

const TagsByCategory: React.StatelessComponent<Props> = ({ category, title, language, tags, upsertTag, removeTag }) => (
  <div style={styles.container}>
    <h1>{title}</h1>
    {tags.map(tag => <TagForm key={tag.id} tag={tag} upsertTag={upsertTag} removeTag={removeTag} />)}
    <TagForm upsertTag={upsertTag} removeTag={removeTag} tag={{ id: '', name: '', language, category }} />
  </div>
);

export default TagsByCategory;
