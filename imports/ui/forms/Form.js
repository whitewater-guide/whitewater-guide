import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ErrorMessage from '../components/ErrorMessage';
import { ValidationError } from 'meteor/mdg:validation-error';
import _ from 'lodash';

class Form extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    method: PropTypes.shape({
      call: PropTypes.func,
      callPromise: PropTypes.func,
    }).isRequired,
    cancelLabel: PropTypes.string,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    initialData: PropTypes.object,
    transformBeforeSubmit: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    initialData: {},
    transformBeforeSubmit: _.identity,
  };

  static childContextTypes = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.initialData,
      errors: {},
    };
  }

  getChildContext() {
    //Transform dot errors paths into nested objects
    let formErrors = {};
    _.forEach(this.state.errors, (value, path) => _.set(formErrors, path, value));
    return {
      formData: this.state.data,
      formErrors,
      formFieldChangeHandler: this.onFieldChange,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialData) {
      this.setState({ data: { ...nextProps.initialData } });
    }
  }

  render() {
    return (
      <div style={styles.container}>
      <Paper style={{...styles.paper, ...this.props.style}}>
        <h1>{this.props.title}</h1>
        {this.props.children}
        <ErrorMessage error={this.state.errors.form}/>  
        <div style={styles.buttonsHolder}>
          <FlatButton label={this.props.cancelLabel} primary={true} onTouchTap={this.props.onCancel}/>
          <FlatButton label={this.props.submitLabel} primary={true} onTouchTap={this.onSubmit}/>
        </div>
      </Paper>
      </div>
    );
  }

  onFieldChange = (field, value) => {
    this.setState({ data: { ...this.state.data, [field]: value } });
  };

  onSubmit = () => {
    const data = this.props.transformBeforeSubmit(this.state.data);
    this.props.method.callPromise(data)
      .then(() => this.props.onSubmit())
      .catch(err => {
        // console.log('Error:', err);
        if (ValidationError.is(err)){
          const errors = {};
          err.details.forEach((fieldError) => {
            errors[fieldError.name] = fieldError.type;
          });
          this.setState({errors});
        }
        else if (err.errorType === 'Meteor.Error') {
          this.setState({ errors: { form: err.error } });
        }
      });
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  buttonsHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 32,
  },
};

export default Form;