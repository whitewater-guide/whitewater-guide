import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

const styles = {
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

class Form extends Component {
  static propTypes = {
    title: PropTypes.string,
    method: PropTypes.func,
    cancelLabel: PropTypes.string,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    initialData: PropTypes.object,
    style: PropTypes.object,
    transformBeforeSubmit: PropTypes.func,
    children: PropTypes.any,
    narrow: PropTypes.bool,
    fullWidth: PropTypes.bool,
  };

  static defaultProps = {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    initialData: {},
    transformBeforeSubmit: _.identity,
    narrow: false,
    fullWidth: false,
  };

  static childContextTypes = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  constructor(props) {
    // Use clone deep at first, apollo returns frozen objects
    super(props);
    this.state = {
      data: _.cloneDeep(props.initialData),
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
  onFieldChange = (field, value) => {
    let fieldsDict = field;
    if (_.isString(field)) {
      fieldsDict = { [field]: value };
    }

    // This is expensive, but code is simple
    const data = _.cloneDeep(this.state.data);

    _.forEach(fieldsDict, (fieldValue, fieldName) => {
      // Use lodash to allow fields from embedded documents
      _.set(data, fieldName, fieldValue);
    });
    this.setState({ data });
  };

  onCancel = () => this.props.onCancel();

  // Do not use arrow function here
  // As a workaround for babel / react-hot-loader bug
  // https://github.com/babel/babel/issues/4550
  async onSubmit() {
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
  }

  renderSnackbar = () => {
    const action = (
      <CopyToClipboard text={this.state.error.message}>
        <span>copy</span>
      </CopyToClipboard>
    );
    return (
      <Snackbar
        action={action}
        onActionTouchTap={this.onCopyError}
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
        { this.renderSnackbar() }
      </div>
    );
  }

}

export default Form;
