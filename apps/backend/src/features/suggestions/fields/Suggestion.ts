import type { SuggestionImageArgs } from '@whitewater-guide/schema';

import type { SuggestionResolvers } from '../../../apollo/index';
import { Imgproxy } from '../../../s3/index';

const suggestionResolvers: SuggestionResolvers = {
  createdAt: ({ created_at }) => new Date(created_at).toISOString(),
  createdBy: ({ created_by }, _, { dataSources }) =>
    dataSources.users.getById(created_by),
  resolvedAt: ({ resolved_at }) =>
    resolved_at && new Date(resolved_at).toISOString(),
  resolvedBy: ({ resolved_by }, _, { dataSources }) =>
    dataSources.users.getById(resolved_by),
  section: async ({ section_id }, _, { dataSources }) => {
    const s = await dataSources.sections.getById(section_id);
    return s!;
  },
  image: ({ filename }, { width, height }: SuggestionImageArgs) =>
    filename &&
    Imgproxy.url(
      'media',
      filename,
      Imgproxy.getProcessingOpts(width, height, 100),
    ),
};

export default suggestionResolvers;
