import { QueryResolvers } from '~/apollo';
import { db } from '~/db';
import { s3Client, TEMP } from '~/s3';

const uploadLink: QueryResolvers['uploadLink'] = async (
  _,
  { version },
  { user },
) => {
  const { id } = await db()
    .select(db().raw('uuid_generate_v1mc() AS id'))
    .first();
  const { postURL, formData } = await s3Client.getTempPostPolicy(
    id,
    user ? user.id : undefined,
    version ?? undefined,
  );
  return {
    postURL,
    formData,
    key: `${TEMP}/${id}`,
  };
};

export default uploadLink;
