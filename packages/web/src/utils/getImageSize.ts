interface Dimensions {
  width: number;
  height: number;
}

const readContent = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const processTempImage = (base64: string): Promise<Dimensions> => new Promise((resolve, reject) => {
  const temp = new Image();
  temp.onload = () => resolve({ width: temp.width, height: temp.height });
  temp.onerror = reject;
  temp.src = base64;
});

export const getImageSize = async (imageFile: File): Promise<Dimensions> => {
  const base64: string = await readContent(imageFile);
  return processTempImage(base64);
};
