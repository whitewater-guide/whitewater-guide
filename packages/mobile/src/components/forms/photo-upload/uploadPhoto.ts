import { uploadFile } from '@whitewater-guide/clients';
import { UploadLink } from '@whitewater-guide/commons';
import { Photo } from '../../photo-picker';

export default (photo: Photo, uploadLink: UploadLink) =>
  uploadFile(
    {
      name: photo.name,
      type: photo.type,
      uri: photo.image,
    } as any,
    uploadLink,
  );
