import { cloneDeep, forEach, set } from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { Styles } from '../styles';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonsRow: {
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
};

interface Props {
  title: string;
  method: (data: any) => Promise<any>;
  cancelLabel?: string;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
  style: any;
  transformBeforeSubmit: any;
  narrow?: boolean;
  fullWidth?: boolean;
}

interface State {
  data: any;
  error: {
    open: boolean;
    message: string;
  };
}

class Form extends React.PureComponent<Props, State> {

  static childContextTypes: any = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  constructor(props: Props) {
    // Use clone deep at first, apollo returns frozen objects
    super(props);
    this.state = {
      data: cloneDeep(props.initialData),
      error: {
        open: false,
        message: '',
      },
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  getChildContext() {
    return {
      formData: this.state.data,
      formFieldChangeHandler: this.onFieldChange,
    };
  }

  /**
   *
   * @param field Flat map of multiple (might be deeply nested) fields and their values. Or string name of single field
   * @param value In case of single field, its value
   */
  onFieldChange = (field: string, value: any) => {
    const fieldsDict = { [field]: value };
    // if (isString(field)) {
    //   fieldsDict = { [field]: value };
    // }

    // This is expensive, but code is simple
    const data = cloneDeep(this.state.data);

    forEach(fieldsDict, (fieldValue, fieldName) => {
      // Use lodash to allow fields from embedded documents
      set(data, fieldName, fieldValue);
    });
    this.setState({ data });
  };

  onCancel = () => this.props.onCancel();

  onSubmit = async () => {
    const { method, onSubmit } = this.props;
    const data = { data: this.props.transformBeforeSubmit(this.state.data) };
    console.log('Submit form', data);
    try {
      const result = await method(data);
      this.setState({ error: { open: false, message: '' } });
      onSubmit(result);
    } catch (error) {
      let message = error.message;
      if (error.networkError) {
        const err = await error.networkError.response.json();
        message = JSON.stringify(err.errors);
      }
      console.error(message);
      this.setState({ error: { open: true, message } });
    }
  };

  renderSnackbar = () => {
    const action = (
      <CopyToClipboard text={this.state.error.message}>
        <span>copy</span>
      </CopyToClipboard>
    );
    return (
      <Snackbar
        action={action}
        open={this.state.error.open}
        message="Something bad happened"
        autoHideDuration={10000}
      />
    );
  };

  render() {
    const { narrow, fullWidth } = this.props;
    let widthStyle;
    if (narrow) {
      widthStyle = { width: 400 };
    } else if (fullWidth) {
      widthStyle = { alignSelf: 'stretch' };
    } else {
      widthStyle = { width: 800 };
    }
    const bodyStyle = { ...styles.body, ...widthStyle, ...this.props.style };
    return (
      <div style={styles.container}>
        <div style={bodyStyle}>
          {this.props.children}
        </div>
        <div style={styles.buttonsRow}>
          <RaisedButton label={this.props.cancelLabel} onTouchTap={this.onCancel} />
          <div style={{ width: 8 }} />
          <RaisedButton primary label={this.props.submitLabel} onTouchTap={this.onSubmit} />
        </div>
        {this.renderSnackbar()}
      </div>
    );
  }

}

export default Form;
