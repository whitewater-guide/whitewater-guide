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
        reject(
          new Error(
            `Failed to upload file. Status code: ${xhr.status}. Message: ${
              xhr.response
            }`,
          ),
        );
      }
    };
    xhr.onerror = reject;
    xhr.open('POST', link.postURL);
    xhr.send(formData);
  });
