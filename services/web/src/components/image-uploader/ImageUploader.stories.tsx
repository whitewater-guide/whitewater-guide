import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { dataURLtoFile, FileWithPreview } from '../../utils';
import { ImageUploader } from './ImageUploader';

// tslint:disable-next-line
const png80x101raw =
  'data:image/png;base64,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';
const png80x101: FileWithPreview = dataURLtoFile(
  png80x101raw,
  '80x101.png',
) as any;
// this is what react-dropzone does
(png80x101 as any).preview = window.URL.createObjectURL(png80x101);

storiesOf('ImageUploader', module)
  .addDecorator((story) => <div style={{ display: 'block' }}>{story()}</div>)
  .add('no data', () => {
    return (
      <ImageUploader
        width={120}
        height={87}
        previewScale={1}
        value={null}
        bucket="banners"
        title="Banner"
        onChange={action('onChange')}
      />
    );
  })
  .add('uploading', () => {
    return (
      <ImageUploader
        uploading
        width={120}
        height={87}
        previewScale={1}
        value={'120x87.png'}
        bucket="banners"
        title="Banner"
        onChange={action('onChange')}
      />
    );
  })
  .add('url', () => {
    return (
      <ImageUploader
        width={120}
        height={87}
        previewScale={1}
        value="120x87.png"
        bucket="banners"
        title="Banner"
        onChange={action('onChange')}
      />
    );
  })
  .add('file bad size', () => {
    return (
      <ImageUploader
        width={600}
        height={200}
        previewScale={0.5}
        value={png80x101}
        bucket="banners"
        title="Banner"
        onChange={action('onChange')}
      />
    );
  })
  .add('file good size', () => {
    return (
      <ImageUploader
        width={80}
        height={101}
        previewScale={1}
        value={png80x101}
        bucket="banners"
        title="Banner"
        onChange={action('onChange')}
      />
    );
  });
