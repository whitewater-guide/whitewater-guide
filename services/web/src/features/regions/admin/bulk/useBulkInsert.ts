import { useUploadLink } from '@whitewater-guide/clients';
import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useMutation } from 'react-apollo';

const BULK_IMPORT = gql`
  mutation bulkInsert($regionId: ID!, $hidden: Boolean, $archiveURL: String!) {
    bulkInsert(regionId: $regionId, hidden: $hidden, archiveURL: $archiveURL) {
      count
      log
    }
  }
`;

export default (regionId: string) => {
  const [log, setLog] = useState('');
  const { upload, uploading } = useUploadLink();
  const [mutate, { loading }] = useMutation(BULK_IMPORT);
  const insert = useCallback(
    (file: File, hidden?: boolean) => {
      upload(file)
        .then((archiveURL) => {
          return mutate({ variables: { regionId, archiveURL, hidden } });
        })
        .then((result) => {
          const data = result.data.bulkInsert;
          setLog(`Success!\n${data.log}\nTotal: ${data.count}`);
        })
        .catch((err) => {
          setLog(`Error: ${err}`);
        });
    },
    [upload, mutate, regionId, setLog],
  );
  return {
    insert,
    loading: uploading || loading,
    log,
  };
};
