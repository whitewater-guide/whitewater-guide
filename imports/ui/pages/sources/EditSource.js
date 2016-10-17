import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Meteor } from 'meteor/meteor';
import { ValidationError } from 'meteor/mdg:validation-error';
import { Sources, editSource } from '../../../api/sources';
import { createContainer } from 'meteor/react-meteor-data';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SourceForm from './SourceForm';

class EditSource extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    source: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        url: '',
        script: '',
        cron: '0 * * * *',//every hour at 0 minute
        harvestMode: null,
      },
      errors: {},
    }
    if (props.source)
      this.state = {...this.state, form: { ...props.source } };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source) {
      this.setState({ form: { ...nextProps.source } });
    }
  }
  
  render() {
    return (
      <div style={styles.container}>
      <Paper style={styles.paper}>
        <h1>Source settings</h1>
        <SourceForm {...this.state.form} onChange={this.onFormChange} errors={this.state.errors}/>
        <div style={styles.buttonsHolder}>
          <FlatButton label="Cancel" primary={true} onTouchTap={this.onCancel}/>
          <FlatButton label="Save" primary={true} onTouchTap={this.onEdit}/>
        </div>
      </Paper>
      </div>
    );
  }
  
  onFormChange = (v) => {
    this.setState({ form: {...this.state.form, ...v}});
  }

  onEdit = () => {
    editSource.callPromise(this.state.form)
      .then(result => this.props.router.goBack())
      .catch(err => {
        console.log('Error:', err);
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

  onCancel = () => {
    this.props.router.goBack();
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

const EditSourceContainer = createContainer(
  (props) => {
    const subscription = Meteor.subscribe('sources.details', props.params.sourceId);
    const source = Sources.findOne(props.params.sourceId);
    return {
      source,
      ready: subscription.ready(),
    };
  },
  EditSource
);

export default adminOnly(withRouter(EditSourceContainer));