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
    return {
      formData: this.state.data,
      formErrors: this.state.errors,
      formFieldChangeHandler: this.onFieldChange,
    };
  }

  componentWillReceiveProps(nextProps){
    //Use arrow function in setState to avoid conflicts with other pending updates
    if (nextProps.initialData){
      this.setState((prevState) => ({
        data: {...prevState.data, ...nextProps.initialData}
      }));
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
          <FlatButton label={this.props.cancelLabel} primary={true} onTouchTap={this.onCancel} disableTouchRipple={true}/>
          <FlatButton label={this.props.submitLabel} primary={true} onTouchTap={this.onSubmit} disableTouchRipple={true}/>
        </div>
      </Paper>
      </div>
    );
  }

  /**
   *
   * @param field Flat map of multiple (might be deeply nested) fields and their values. Or string name of single field
   * @param value In case of single field, its value
   */
  onFieldChange = (field, value) => {
    let fieldsDict = field;
    if (_.isString(field))
      fieldsDict = {[field]: value};

    let data = { ... this.state.data };

    _.forEach(fieldsDict, (fieldValue, fieldName) => {
      //Use lodash to allow fields from embedded documents
      _.set(data, fieldName, fieldValue);
    });
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
    console.log('Submit form', args);
    this.props.method.callPromise(args)
      .then((result) => this.props.onSubmit(result))
      .catch(err => {
        console.error(err);
        if (ValidationError.is(err)){
          const errors = {};
          err.details.forEach((fieldError) => _.set(errors, fieldError.name, fieldError.type));
          this.setState({errors: errors.data});
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