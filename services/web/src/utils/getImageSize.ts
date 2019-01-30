import { FileWithPreview, isFileWithPreview } from './files';

interface Dimensions {
  width: number;
  height: number;
}

const readContent = (file: File | FileWithPreview): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject();
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(isFileWithPreview(file) ? file.file : file);
  });

const processTempImage = (base64: string): Promise<Dimensions> =>
  new Promise((resolve, reject) => {
    const temp = new Image();
    temp.onload = () => resolve({ width: temp.width, height: temp.height });
    temp.onerror = reject;
    temp.src = base64;
  });

export const getImageSize = async (
  imageFile: File | FileWithPreview,
): Promise<Dimensions> => {
  const base64: string = await readContent(imageFile);
  return processTempImage(base64);
};
