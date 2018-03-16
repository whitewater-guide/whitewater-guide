import { UploadLink } from '../../ww-commons';

export const uploadFile = (file: File, link: UploadLink): Promise<string> => new Promise((resolve, reject) => {
  const formData = new FormData();
  const rawFormData = { ...link.formData, key: link.key };
  // console.log(JSON.stringify(rawFormData, null, 2));
  Object.entries(rawFormData).forEach(([key, value]) => formData.append(key, value));
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 204) {
      const location = xhr.getResponseHeader('Location');
      const filename = location!.split('/').pop()!;
      resolve(filename);
    } else {
      reject(new Error(`Failed to upload file. Status code: ${xhr.status}. Message: ${xhr.response}`));
    }
  };
  xhr.onerror = reject;
  xhr.open('POST', link.postURL);
  xhr.setRequestHeader('Access-Control-Expose-Headers', 'Location');
  xhr.setRequestHeader('X-Container-Meta-Access-Control-Expose-Headers', 'Location');
  xhr.send(formData);
});
