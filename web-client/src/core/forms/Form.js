import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {LanguagePicker} from '../components';
import Snackbar from 'material-ui/Snackbar';
import _ from 'lodash';

class Form extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    method: PropTypes.func,
    cancelLabel: PropTypes.string,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    initialData: PropTypes.object,
    style: PropTypes.object,
    multilang: PropTypes.bool,
    language: PropTypes.string,
    onLanguageChange: PropTypes.func,
    transformBeforeSubmit: PropTypes.func,
  };

  static defaultProps = {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    initialData: {},
    multilang: true,
    language: 'en',
    transformBeforeSubmit: _.identity,
  };

  static childContextTypes = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  constructor(props) {
    //Use clone deep at first, apollo returns frozen objects
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
      //formErrors: this.state.errors,
      formFieldChangeHandler: this.onFieldChange,
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <Paper style={{...styles.paper, ...this.props.style}}>
          <div style={styles.titleWrapper}>
            <h2>{this.props.title}</h2>
            {this.props.multilang && <LanguagePicker value={this.props.language} onChange={this.props.onLanguageChange}/>}
          </div>
          {this.props.children}
          <div style={styles.buttonsHolder}>
            <FlatButton label={this.props.cancelLabel} primary={true} onTouchTap={this.onCancel} disableTouchRipple={true}/>
            <FlatButton label={this.props.submitLabel} primary={true} onTouchTap={this.onSubmit} disableTouchRipple={true}/>
          </div>
        </Paper>
        <Snackbar
          open={this.state.error.open}
          message={this.state.error.message}
          autoHideDuration={10000}
        />
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

    //This is expensive, but code is simple
    let data = _.cloneDeep(this.state.data);

    _.forEach(fieldsDict, (fieldValue, fieldName) => {
      //Use lodash to allow fields from embedded documents
      _.set(data, fieldName, fieldValue);
    });
    this.setState({ data });
  };

  onCancel = () => this.props.onCancel();

  //Do not use arrow function here
  //As a workaround for babel / react-hot-loader bug
  //https://github.com/babel/babel/issues/4550
  async onSubmit() {
    let {method, multilang, language, onSubmit} = this.props;

    let data = {data: this.props.transformBeforeSubmit(this.state.data)};
    if (multilang)
      data.language = language;

    console.log('Submit form', data);

    try {
      const result = await method(data);
      this.setState({error: {open: false, message: ''}});
      onSubmit(result);
    }
    catch (error){
      let message = error.message;
      if (error.networkError) {
        const err = await error.networkError.response.json();
        message = JSON.stringify(err.errors);
      }
      console.error(message);
      this.setState({error: {open: true, message}});
    }
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    //minHeight: 'min-content',
    overflow: 'hidden',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 16,
    marginBottom: 16,
    overflow: 'hidden',
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