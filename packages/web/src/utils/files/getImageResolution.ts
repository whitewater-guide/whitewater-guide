const readContent = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('could not read'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const processTempImage = (base64: string): Promise<[number, number]> =>
  new Promise((resolve, reject) => {
    const temp = new Image();
    temp.onload = () => resolve([temp.width, temp.height]);
    temp.onerror = reject;
    temp.src = base64;
  });

export const getImageResolution = async (
  file: File,
): Promise<[number, number]> => {
  const base64: string = await readContent(file);
  return processTempImage(base64);
};
