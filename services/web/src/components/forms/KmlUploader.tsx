import { kml } from '@mapbox/togeojson';
import { Feature, FeatureCollection, LineString } from '@turf/helpers';
import { Coordinate3d } from '@whitewater-guide/commons';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import React from 'react';
import Dropzone, { DropFilesEventHandler } from 'react-dropzone';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';
import { Styles } from '../../styles';

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
  onUpload: (shape: Coordinate3d[]) => void;
}

interface State {
  warningOpen: boolean;
}

class KmlUploader extends React.PureComponent<Props, State> {
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
    const coordinates = line.geometry.coordinates;
    this.props.onUpload(
      coordinates.map(([lon, lat]) => [lon, lat, 0] as Coordinate3d),
    );
  };

  onDrop: DropFilesEventHandler = (acceptedFiles) => {
    this._reader.readAsText(acceptedFiles[0]);
  };

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Dropzone onDrop={this.onDrop} multiple={false} accept=".kml">
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} style={styles.dz}>
                <RaisedButton
                  primary
                  fullWidth
                  label="From KML File"
                  secondary={true}
                  icon={<FontIcon className="material-icons">layers</FontIcon>}
                >
                  <input {...getInputProps()} />
                </RaisedButton>
              </div>
            );
          }}
        </Dropzone>
        <Snackbar
          open={this.state.warningOpen}
          message="KML must contain exactly one polyline"
          autoHideDuration={5000}
          onRequestClose={this.onWarningClosed}
        />
      </React.Fragment>
    );
  }
}

export const KmlUploaderComponent: React.FC<WrappedFieldProps> = ({
  input,
}) => <KmlUploader onUpload={input.onChange} />;

const CustomField = Field as new () => GenericField<{}>;

export const KmlUploaderInput: React.FC<BaseFieldProps> = (props) => {
  return <CustomField {...props} component={KmlUploaderComponent} />;
};
