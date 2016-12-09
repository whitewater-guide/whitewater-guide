import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import ErrorMessage from '../components/ErrorMessage';
import LanguagePicker from '../components/LanguagePicker';
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
    multilang: PropTypes.bool,
    language: PropTypes.string,
    onLanguageChange: PropTypes.func,
  };

  static defaultProps = {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    initialData: {},
    transformBeforeSubmit: _.identity,
    multilang: true,
    language: 'en',
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
        <div style={styles.titleWrapper}>
          <h1>{this.props.title}</h1>
          {this.props.multilang && <LanguagePicker value={this.props.language} onChange={this.props.onLanguageChange}/>}
        </div>
        {this.props.children}
        <ErrorMessage error={this.state.errors.form}/>  
        <div style={styles.buttonsHolder}>
          <FlatButton label={this.props.cancelLabel} primary={true} onTouchTap={this.onCancel}/>
          <FlatButton label={this.props.submitLabel} primary={true} onTouchTap={this.onSubmit}/>
        </div>
      </Paper>
      </div>
    );
  }

  onFieldChange = (field, value) => {
    //Use lodash to allow fields from embedded documents
    let data = { ... this.state.data };
    _.set(data, field, value);
    this.setState({ data });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onSubmit = () => {
    const data = this.props.transformBeforeSubmit(this.state.data);
    let args = {data};
    if (this.props.multilang)
      args.language = this.props.language;
    this.props.method.callPromise(args)
      .then(() => this.props.onSubmit())
      .catch(err => {
        console.error(err);
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
    minHeight: 'min-content',
  },
  paper: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonsHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 32,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default Form;