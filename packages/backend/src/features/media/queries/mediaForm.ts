import { baseResolver, Context, MutationNotAllowedError } from '@apollo';
import { getTempPostPolicy } from '@minio';
import { MediaUploadForm } from '../types';

interface Vars {
  id?: string;
}

const mediaForm = async (root: any, { id: mediaId }: Vars, { user, models }: Context): Promise<MediaUploadForm> => {
  const { found, id } = await models.media.checkMediaId(mediaId);
  if (!found && mediaId) {
    throw new MutationNotAllowedError({ message: 'This media does not exist' });
  }
  await models.media.assertEditorPermissions(mediaId);
  const { postURL, formData } = await getTempPostPolicy(id);
  return {
    id,
    upload: {
      postURL,
      formData,
      key: id,
    },
  };
};

export default baseResolver.createResolver(mediaForm);
