import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useTags } from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/schema';
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
          category={TagCategory.Kayaking}
          title="Kayaking types"
          tags={tagsByCategory[TagCategory.Kayaking]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.Hazards}
          title="Hazard types"
          tags={tagsByCategory[TagCategory.Hazards]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.Supply}
          title="River supply types"
          tags={tagsByCategory[TagCategory.Supply]}
          onAdd={addTag}
          onRemove={removeTag}
        />
        <TagsByCategory
          category={TagCategory.Misc}
          title="Misc tags"
          tags={tagsByCategory[TagCategory.Misc]}
          onAdd={addTag}
          onRemove={removeTag}
        />
      </CardContent>
    </Card>
  );
});

TagsList.displayName = 'TagsList';

export default TagsList;
