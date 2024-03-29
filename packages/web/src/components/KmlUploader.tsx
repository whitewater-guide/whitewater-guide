import { kml } from '@mapbox/togeojson';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import type { Feature, FeatureCollection, LineString } from '@turf/helpers';
import type { Coordinate3d } from '@whitewater-guide/clients';
import React from 'react';
import Dropzone from 'react-dropzone';

import type { Styles } from '../styles';

const styles: Styles = {
  dz: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
};

interface Props {
  onUpload: (shape: CodegenCoordinates[]) => void;
}

interface State {
  warningOpen: boolean;
}

const acceptedKml = {
  'application/*': ['.kml'],
};

export class KmlUploader extends React.PureComponent<Props, State> {
  readonly state: State = { warningOpen: false };

  private _reader = new FileReader();

  constructor(props: Props) {
    super(props);
    this._reader.onloadend = this.onLoaded;
  }

  onWarningClosed = () => {
    this.setState({ warningOpen: false });
  };

  onLoaded = () => {
    if (!this._reader.result || typeof this._reader.result !== 'string') {
      return;
    }
    const txt: string = this._reader.result;
    const kmlDoc = new DOMParser().parseFromString(txt, 'text/xml');
    const { features }: FeatureCollection = kml(kmlDoc);
    const lines: Array<Feature<LineString>> = features.filter(
      (f) => f.geometry.type === 'LineString',
    ) as any;
    if (lines.length !== 1) {
      this.setState({ warningOpen: true });
      return;
    }
    const line = lines[0];
    const { coordinates } = line.geometry;
    this.props.onUpload(
      coordinates.map(([lon, lat]) => [lon, lat, 0] as Coordinate3d),
    );
  };

  onDrop = (acceptedFiles: File[]) => {
    this._reader.readAsText(acceptedFiles[0]);
  };

  render(): React.ReactNode {
    return (
      <>
        <Dropzone onDrop={this.onDrop} multiple={false} accept={acceptedKml}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={styles.dz}>
              <Button color="primary" variant="contained" fullWidth>
                <Icon className="material-icons">layers</Icon>
                {' From KML File'}
                <input {...getInputProps()} />
              </Button>
            </div>
          )}
        </Dropzone>
        <Snackbar
          open={this.state.warningOpen}
          message="KML must contain exactly one polyline"
          autoHideDuration={5000}
          onClose={this.onWarningClosed}
        />
      </>
    );
  }
}
