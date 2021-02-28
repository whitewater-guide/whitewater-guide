import { UploadLink } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback, useRef, useState } from 'react';
import { useApolloClient } from 'react-apollo';

import { FileLike } from './types';
import { uploadFile } from './uploadFile';

export const UPLOAD_LINK_QUERY = gql`
  query getUploadLink($version: PostPolicyVersion) {
    uploadLink(version: $version) {
      formData
      key
      postURL
    }
  }
`;

interface QResult {
  uploadLink: UploadLink | null;
}

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
        .query<QResult>({
          query: UPLOAD_LINK_QUERY,
          variables: { version: 'V3' },
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
          } else {
            throw new Error('failed to get upload link');
          }
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
