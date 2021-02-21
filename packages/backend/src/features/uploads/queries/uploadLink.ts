import { TopLevelResolver } from '~/apollo';
import db from '~/db';
import { PostPolicyVersion, s3Client, TEMP } from '~/s3';

interface Vars {
  version?: PostPolicyVersion;
}

const uploadLink: TopLevelResolver<Vars> = async (_, { version }, { user }) => {
  const { id } = await db()
    .select(db().raw('uuid_generate_v1mc() AS id'))
    .first();
  const { postURL, formData } = await s3Client.getTempPostPolicy(
    id,
    user ? user.id : undefined,
    version,
  );
  return {
    postURL,
    formData,
    key: `${TEMP}/${id}`,
  };
};

export default uploadLink;
