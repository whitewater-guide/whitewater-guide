import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import { getTempPostPolicy } from '@minio';
import { MediaUploadForm } from '../types';

interface Vars {
  id?: string;
}

const mediaForm: TopLevelResolver<Vars> = async (_, { id: mediaId }, { user, dataSources }) => {
  const { found, id } = await dataSources.media.checkMediaId(mediaId);
  if (!found && mediaId) {
    throw new MutationNotAllowedError('This media does not exist');
  }
  await dataSources.media.assertEditorPermissions(mediaId);
  const { postURL, formData } = await getTempPostPolicy(id);
  const result: MediaUploadForm = {
    id,
    upload: {
      postURL,
      formData,
      key: id,
    },
  };
  return result;
};

export default mediaForm;
