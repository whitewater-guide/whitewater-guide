import { baseResolver, Context } from '@apollo';
import { getTempPostPolicy } from '@minio';

interface Vars {
  regionId: string;
}

const regionMediaForm = async (root: any, { regionId }: Vars, { user }: Context) => {
  const { postURL, formData } = await getTempPostPolicy();
  return {
    upload: {
      postURL,
      formData,
      key: null,
    },
  };
};

export default baseResolver.createResolver(regionMediaForm);
