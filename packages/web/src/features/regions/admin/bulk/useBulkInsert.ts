import { useUploadLink } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';

import { useBulkInsertMutation } from './bulkInsert.generated';

export default function useBulkInsert(regionId: string) {
  const [log, setLog] = useState('');
  const { upload, uploading } = useUploadLink();
  const [mutate, { loading }] = useBulkInsertMutation();
  const insert = useCallback(
    (file: File, hidden?: boolean) => {
      upload(file)
        .then((archiveURL) =>
          mutate({ variables: { regionId, archiveURL, hidden } }),
        )
        .then((result) => {
          const data = result.data?.bulkInsert;
          setLog(`Success!\n${data?.log}\nTotal: ${data?.count}`);
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
}
