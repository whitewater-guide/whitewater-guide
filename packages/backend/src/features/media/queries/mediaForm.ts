import { baseResolver, Context, MutationNotAllowedError } from '../../../apollo';
import { getTempPostPolicy } from '../../../minio';
import checkEditorPermissions from '../checkEditorPermissions';
import { MediaUploadForm } from '../types';
import { checkMediaId } from './checkMediaId';

interface Vars {
  id?: string;
}

const mediaForm = async (root: any, { id: mediaId }: Vars, { user }: Context): Promise<MediaUploadForm> => {
  const { found, id } = await checkMediaId(mediaId);
  if (!found && mediaId) {
    throw new MutationNotAllowedError({ message: 'This media does not exist' });
  }
  await checkEditorPermissions(user, mediaId);
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
