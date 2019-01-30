import { WithTags } from '@whitewater-guide/commons';
import React from 'react';
import { TagsConsumer, TagsContext } from './context';

export function consumeTags<Props>(
  Component: React.ComponentType<Props & WithTags>,
): React.ComponentType<Props> {
  const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
    <TagsConsumer>
      {({ tags, loading }: TagsContext) => {
        return <Component {...props} tags={tags} tagsLoading={loading} />;
      }}
    </TagsConsumer>
  );
  Wrapper.displayName = 'consumeTags';

  return Wrapper;
}
