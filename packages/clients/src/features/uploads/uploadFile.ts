import type { UploadLink } from '@whitewater-guide/schema';

import { getDotExt } from './getDotExt';
import type { FileLike } from './types';

/*
<?xml version="1.0" encoding="UTF-8"?>
<Error>
    <Code>EntityTooSmall</Code>
    <Message>Your proposed upload is smaller than the minimum allowed object size.</Message>
    <BucketName>temp</BucketName>
    <Resource>/temp</Resource>
    <RequestId>15ABB241607163F9</RequestId>
    <HostId>7f1064dc-73b1-4736-be6a-5cadd403509a</HostId>
</Error>
 */

export class UploadFileError extends Error {
  public status: number;

  public code?: string;

  constructor(text: string, status: number) {
    let message = `failed to upload file: ${text}`;
    let code: string | undefined;
    const codeMatch = /<Code>(.*)<\/Code>/.exec(text);
    if (codeMatch && codeMatch.length >= 2) {
      code = codeMatch[1];
    }
    const msgMatch = /<Message>(.*)<\/Message>/.exec(text);
    if (msgMatch && msgMatch.length >= 2) {
      message = msgMatch[1];
    }
    super(message);
    this.status = status;
    this.name = 'UploadFileError';
    this.code = code;
  }
}

export const uploadFile = async (
  file: FileLike,
  link: UploadLink,
  abortController?: AbortController,
): Promise<string> => {
  const formData = new FormData();
  const filename = file.name;
  if (!link.key && !filename) {
    throw new Error('If upload key is not provided, filename must be set');
  }
  const ext = getDotExt(file);
  const key = link.key ? `${link.key}${ext}` : filename;
  const rawFormData = { ...link.formData, key };
  Object.entries(rawFormData).forEach(([k, v]) => formData.append(k, v));
  formData.append('Content-Type', file.type);
  formData.append('file', file as any);

  try {
    const resp = await fetch(link.postURL, {
      body: formData,
      method: 'post',
      signal: abortController ? abortController.signal : undefined,
    });
    if (resp.status === 204) {
      const location = resp.headers.get('Location');
      if (!location) {
        throw new UploadFileError('location header not found', 503);
      }
      return location;
    }
    const text = await resp.text();
    throw new UploadFileError(text, resp.status);
  } catch (e) {
    throw new UploadFileError((e as Error).message, 503);
  }
};
