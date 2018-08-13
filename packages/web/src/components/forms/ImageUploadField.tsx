import React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { Omit } from 'type-zoo';
import { ImageUploader, ImageUploaderProps } from '../image-uploader';

type OwnProps = Omit<ImageUploaderProps, 'value' | 'onChange'>;

type Props = WrappedFieldProps & OwnProps;

class ImageUploaderComponent extends React.PureComponent<Props> {
  render() {
    const { input, meta, ...ownProps } = this.props;
    return (
      <ImageUploader
        {...ownProps}
        value={input.value}
        onChange={input.onChange}
      />
    );
  }
}

type FieldProps = BaseFieldProps<OwnProps> & OwnProps;

export const ImageUploadField: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<OwnProps>;
  return (
    <CustomField
      {...props}
      component={ImageUploaderComponent}
    />
  );
};
