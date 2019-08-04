import { TopLevelResolver } from '@apollo';
import db from '@db';
import { getTempPostPolicy } from '@minio';

const uploadLink: TopLevelResolver = async (_, __, { user }) => {
  const { id } = await db()
    .select(db().raw('uuid_generate_v1mc() AS id'))
    .first();
  const { postURL, formData } = await getTempPostPolicy(id, user!.id);
  return {
    postURL,
    formData,
    key: id,
  };
};

export default uploadLink;
