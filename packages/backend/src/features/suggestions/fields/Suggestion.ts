import { Suggestion } from '@whitewater-guide/commons';

import { FieldResolvers } from '~/apollo';
import { Imgproxy } from '~/s3';

import { ImageArgs, SuggestionRaw } from '../types';

const suggestionResolvers: FieldResolvers<SuggestionRaw, Suggestion> = {
  createdAt: ({ created_at }) => new Date(created_at).toISOString(),
  createdBy: ({ created_by }, _, { dataSources }) =>
    dataSources.users.getById(created_by),
  resolvedAt: ({ resolved_at }) =>
    resolved_at && new Date(resolved_at).toISOString(),
  resolvedBy: ({ resolved_by }, _, { dataSources }) =>
    dataSources.users.getById(resolved_by),
  section: ({ section_id }, _, { dataSources }) =>
    dataSources.sections.getById(section_id),
  image: ({ filename }, { width, height }: ImageArgs) => {
    return (
      filename &&
      Imgproxy.url(
        'media',
        filename,
        Imgproxy.getProcessingOpts(width, height, 100),
      )
    );
  },
};

export default suggestionResolvers;
