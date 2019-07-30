import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useTags } from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import React from 'react';
import { EditorLanguagePicker } from '../../components';
import { Card } from '../../layout';
import TagsByCategory from './TagsByCategory';
import useAddTag from './useAddTag';
import useRemoveTag from './useRemoveTag';

const TagsList: React.FC = React.memo(() => {
  const { tags, loading } = useTags();
  const addTag = useAddTag();
  const removeTag = useRemoveTag();
  const tagsByCategory = groupBy(tags, 'category');
  return (
    <Card loading={loading}>
      <CardHeader title="Tags" action={<EditorLanguagePicker />} />
      <CardContent>
        <TagsByCategory
          category={TagCategory.kayaking}
          title="Kayaking types"
          tags={tagsByCategory[TagCategory.kayaking]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.hazards}
          title="Hazard types"
          tags={tagsByCategory[TagCategory.hazards]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.supply}
          title="River supply types"
          tags={tagsByCategory[TagCategory.supply]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.misc}
          title="Misc tags"
          tags={tagsByCategory[TagCategory.misc]}
          onAdd={addTag}
          onRemove={removeTag}
        />
      </CardContent>
    </Card>
  );
});

TagsList.displayName = 'TagsList';

export default TagsList;
