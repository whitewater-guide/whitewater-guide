import { UploadLink } from '../../ww-commons';

export const uploadFile = (file: File, link: UploadLink, filename?: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    if (!link.key && !filename) {
      reject(new Error('If upload key is not provided, filename must be set'));
    }
    const rawFormData = { ...link.formData, key: (link.key || filename)! };
    // console.log(JSON.stringify(rawFormData, null, 2));
    Object.entries(rawFormData).forEach(([key, value]) => formData.append(key, value));
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 204) {
        const location = xhr.getResponseHeader('Location');
        const resultingFilename = location!.split('/').pop()!;
        resolve(resultingFilename);
      } else {
        reject(new Error(`Failed to upload file. Status code: ${xhr.status}. Message: ${xhr.response}`));
      }
    };
    xhr.onerror = reject;
    xhr.open('POST', link.postURL);
    xhr.send(formData);
  });
