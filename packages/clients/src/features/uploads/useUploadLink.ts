import { useApolloClient } from '@apollo/client';
import { PostPolicyVersion } from '@whitewater-guide/schema';
import { useCallback, useRef, useState } from 'react';

import {
  GetUploadLinkDocument,
  GetUploadLinkQuery,
  GetUploadLinkQueryVariables,
} from './getUploadLink.generated';
import { FileLike } from './types';
import { uploadFile } from './uploadFile';

export interface UseUploadLink {
  upload: (file: FileLike) => Promise<string>;
  uploading: boolean;
  abort: () => void;
}

export const useUploadLink = (): UseUploadLink => {
  // TODO: test aborts
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const abortControllerRef = useRef(new AbortController());

  const upload = useCallback(
    (file: FileLike) => {
      setUploading(true);
      abortControllerRef.current = new AbortController();
      return client
        .query<GetUploadLinkQuery, GetUploadLinkQueryVariables>({
          query: GetUploadLinkDocument,
          variables: { version: PostPolicyVersion.V3 },
          fetchPolicy: 'no-cache',
          errorPolicy: 'none',
        })
        .then(({ data }) => {
          if (data.uploadLink) {
            return uploadFile(
              file,
              data.uploadLink,
              abortControllerRef.current,
            );
          }
          throw new Error('failed to get upload link');
        })
        .finally(() => {
          setUploading(false);
        });
    },
    [client, setUploading, abortControllerRef],
  );

  const abort = useCallback(() => {
    abortControllerRef.current.abort();
  }, [abortControllerRef]);

  return {
    upload,
    uploading,
    abort,
  };
};
