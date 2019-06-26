import { UploadLink } from '@whitewater-guide/commons';

const getDotExt = (file: File) => {
  const parts = file.name.split('.');
  if (parts.length < 2) {
    return '';
  }
  const ext = parts.pop();
  if (ext) {
    return `.${ext}`;
  } else {
    switch (file.type) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      default:
        return '';
    }
  }
};

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

  constructor(xhr: XMLHttpRequest) {
    let message = `Failed to upload file: ${xhr.responseText}`;
    let code: string | undefined;
    if (xhr.responseXML) {
      const msg = xhr.responseXML.getElementsByTagName('Message').item(0);
      const cd = xhr.responseXML.getElementsByTagName('Code').item(0);
      if (msg && msg.textContent) {
        message = msg.textContent;
      }
      if (cd && cd.textContent) {
        code = cd.textContent;
      }
    }
    super(message);
    this.status = xhr.status;
    this.name = 'UploadFileError';
    this.code = code;
  }
}

export const uploadFile = (file: File, link: UploadLink): Promise<string> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    const filename = file.name;
    if (!link.key && !filename) {
      reject(new Error('If upload key is not provided, filename must be set'));
    }
    const ext = getDotExt(file);
    const key = link.key ? `${link.key}${ext}` : filename;
    const rawFormData = { ...link.formData, key };
    // console.log(JSON.stringify(rawFormData, null, 2));
    Object.entries(rawFormData).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 204) {
        const location = xhr.getResponseHeader('Location');
        const resultingFilename = location!.split('/').pop()!;
        resolve(resultingFilename);
      } else {
        reject(new UploadFileError(xhr));
      }
    };
    xhr.onerror = reject;
    xhr.open('POST', link.postURL);
    xhr.send(formData);
  });
