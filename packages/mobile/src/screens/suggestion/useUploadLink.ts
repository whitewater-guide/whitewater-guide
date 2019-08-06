import { UploadLink } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const UPLOAD_LINK_QUERY = gql`
  query getUploadLink {
    uploadLink {
      formData
      key
      postURL
    }
  }
`;

interface QResult {
  uploadLink: UploadLink | null;
}

type UseUploadLink = [UploadLink | null, boolean];

export default (): UseUploadLink => {
  const { data, error, loading } = useQuery<QResult>(UPLOAD_LINK_QUERY, {
    fetchPolicy: 'network-only',
  });
  // console.log(error);
  // TODO: handle error
  return [data ? data.uploadLink : null, loading];
};
