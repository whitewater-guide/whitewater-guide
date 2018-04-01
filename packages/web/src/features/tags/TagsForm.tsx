import { groupBy } from 'lodash';
import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { Content } from '../../components';
import { EditorLanguagePicker } from '../../components/language';
import { CardHeader } from '../../layout';
import { TagCategory } from '../../ww-commons';
import TagsByCategory from './TagsByCategory';
import { TagsFormProps } from './types';

export default class TagsForm extends React.PureComponent<TagsFormProps> {

  render() {
    const { tags, upsertTag, removeTag } = this.props;
    const tagsByCategory = groupBy(tags, 'category');
    return (
      <Content card>
        <CardHeader title="Tags">
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <TagsByCategory
              category={TagCategory.kayaking}
              title="Kayaking types"
              tags={tagsByCategory[TagCategory.kayaking]}
              upsertTag={upsertTag}
              removeTag={removeTag}
            />
            <TagsByCategory
              category={TagCategory.hazards}
              title="Hazard types"
              tags={tagsByCategory[TagCategory.hazards]}
              upsertTag={upsertTag}
              removeTag={removeTag}
            />
            <TagsByCategory
              category={TagCategory.supply}
              title="River supply types"
              tags={tagsByCategory[TagCategory.supply]}
              upsertTag={upsertTag}
              removeTag={removeTag}
            />
            <TagsByCategory
              category={TagCategory.misc}
              title="Misc tags"
              tags={tagsByCategory[TagCategory.misc]}
              upsertTag={upsertTag}
              removeTag={removeTag}
            />
          </div>
        </CardMedia>
      </Content>
    );
  }

}
