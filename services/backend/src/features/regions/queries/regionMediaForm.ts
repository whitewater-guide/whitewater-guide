import { TopLevelResolver } from '@apollo';
import { getTempPostPolicy } from '@minio';

interface Vars {
  regionId: string;
}

const regionMediaForm: TopLevelResolver<Vars> = async (
  _,
  { regionId },
  { user },
) => {
  const { postURL, formData } = await getTempPostPolicy();
  return {
    upload: {
      postURL,
      formData,
      key: null,
    },
  };
};

export default regionMediaForm;
