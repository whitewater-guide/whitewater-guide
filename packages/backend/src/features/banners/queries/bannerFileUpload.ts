import { TopLevelResolver } from '@apollo';
import db from '@db';
import { getTempPostPolicy } from '@minio';

const bannerFileUpload: TopLevelResolver = async () => {
  const { id } = await db().select(db().raw('uuid_generate_v1mc() AS id')).first();
  const { postURL, formData } = await getTempPostPolicy(id);
  return {
    postURL,
    formData,
    key: id,
  };
};

export default bannerFileUpload;
