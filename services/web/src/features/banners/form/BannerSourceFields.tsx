import { BannerKind } from '@whitewater-guide/commons';
import get from 'lodash/get';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React from 'react';
import { Fields, WrappedFieldProps } from 'redux-form';
import { ImageUploadField } from '../../../components/forms';
import { ImageUploaderProps } from '../../../components/image-uploader';
import { Styles } from '../../../styles';
import BannerSourceWebviewFields from './BannerSourceWebviewFields';

const styles: Styles = {
  container: {
    display: 'flex',
    border: '1px #555 solid',
    height: 256,
  },
  radioButton: {
    marginBottom: 16,
  },
  radioContainer: {
    padding: 16,
    backgroundColor: '#DDDDDD',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  inputContainer: {
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  uploaderRoot: {
    padding: 0,
    borderWidth: 0,
  },
  uploaderMain: {
    padding: 0,
    borderWidth: 0,
  },
};

type ComponentProps = Omit<ImageUploaderProps, 'value' | 'onChange'>;

interface State {
  lastRatio: number;
}

class BannerSourceComponent extends React.Component<ComponentProps, State> {
  constructor(props: ComponentProps) {
    super(props);
    const ratio: WrappedFieldProps = get(this.props, 'source.ratio');
    this.state = { lastRatio: ratio.input.value || 4 };
  }

  renderImagePicker = () => {
    const { bucket, width, height, previewScale, upload } = this.props;
    return (
      <ImageUploadField
        hideFileName={true}
        name="source.src"
        bucket={bucket}
        width={width}
        height={height}
        previewScale={previewScale}
        rootStyle={styles.uploaderRoot}
        mainStyle={styles.uploaderMain}
        upload={upload}
      />
    );
  };

  renderURLInput = () => {
    const src: WrappedFieldProps = get(this.props, 'source.src');
    const ratio: WrappedFieldProps = get(this.props, 'source.ratio');
    return (
      <BannerSourceWebviewFields
        ratio={ratio.input.value}
        url={src.input.value}
      />
    );
  };

  onRadioChange = (e: any, value: any) => {
    const kind: WrappedFieldProps = get(this.props, 'source.kind');
    const ratio: WrappedFieldProps = get(this.props, 'source.ratio');
    kind.input.onChange(value);
    const switchToImage = value === BannerKind.Image;
    if (switchToImage) {
      this.setState({ lastRatio: ratio.input.value });
    }
    ratio.input.onChange(switchToImage ? null : this.state.lastRatio);
  };

  render() {
    const { title } = this.props;
    const kind: WrappedFieldProps = get(this.props, 'source.kind');
    const isImage = kind.input.value === BannerKind.Image;
    return (
      <div style={styles.container}>
        <div style={styles.radioContainer}>
          <b>{title}</b>
          <RadioButtonGroup
            name="useFile"
            valueSelected={kind.input.value}
            onChange={this.onRadioChange}
          >
            <RadioButton
              value={BannerKind.Image}
              label="Image"
              style={styles.radioButton}
            />
            <RadioButton
              value={BannerKind.WebView}
              label="WebView"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>
        <div style={styles.inputContainer}>
          {isImage ? this.renderImagePicker() : this.renderURLInput()}
        </div>
      </div>
    );
  }
}

const BannerSourceFields: React.SFC<ComponentProps> = (props) => (
  <Fields
    names={['source.kind', 'source.ratio', 'source.src']}
    component={BannerSourceComponent}
    {...props}
  />
);

export default BannerSourceFields;
