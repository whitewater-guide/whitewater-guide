import React, { cloneElement, Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import ErrorMessage from '../components/ErrorMessage';
import { ValidationError } from 'meteor/mdg:validation-error';

class Form extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
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
  };

  static defaultProps = {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    initialData: {},
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
    return {
      formData: this.state.data,
      formErrors: this.state.errors,
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
      <Paper style={styles.paper}>
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
    console.log('On field change', field, value);
    this.setState({ data: { ...this.state.data, [field]: value } });
  };

  onSubmit = () => {
    this.props.method.callPromise(this.state.data)
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