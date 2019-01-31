import { ECR } from 'aws-sdk';

/**
 * Checks if given version of given image exists in private AWS ECR repo
 * @param image
 * @param version
 */
export const imageExistsInECR = async (image: string, version: string) => {
  const ecr = new ECR();
  let imageDetails: any[] | undefined;
  try {
    const response = await ecr
      .describeImages({
        repositoryName: `ww/${image}`,
        imageIds: [{ imageTag: version }],
      })
      .promise();
    imageDetails = response.imageDetails;
  } catch (e) {
    if (e.code !== 'ImageNotFoundException') {
      throw e;
    }
  }
  return imageDetails && imageDetails.length > 0;
};
