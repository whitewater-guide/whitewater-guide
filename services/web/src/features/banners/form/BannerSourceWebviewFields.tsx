import React from 'react';
import debounceRender from 'react-debounce-render';
import Iframe from 'react-iframe';
import { TextInput } from '../../../components/forms';
import { Styles } from '../../../styles';

const DebouncedIframe = debounceRender(Iframe);

const styles: Styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 8,
  },
  inputs: {
    display: 'flex',
    flexDirection: 'row',
  },
  iframe: {
    width: 512,
    backgroundColor: 'pink',
  },
};

interface Props {
  url: string;
  ratio: number;
}

export default class BannerSourceWebviewFields extends React.PureComponent<
  Props
> {
  render() {
    const { ratio, url } = this.props;
    return (
      <div style={styles.root}>
        <div style={styles.inputs}>
          <TextInput name="source.ratio" type="number" title="Ratio" />
          <TextInput fullWidth={true} name="source.src" title="URL" />
        </div>
        <div style={{ ...styles.iframe, height: 512 / ratio }}>
          {!!url && (
            <DebouncedIframe
              width="512px"
              height={`${Math.ceil(512 / ratio)}px`}
              url={url}
              styles={{ overflow: 'hidden' }}
            />
          )}
        </div>
      </div>
    );
  }
}
