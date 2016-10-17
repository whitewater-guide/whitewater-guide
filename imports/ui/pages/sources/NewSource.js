import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { ValidationError } from 'meteor/mdg:validation-error';
import { createSource } from '../../../api/sources';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SourceForm from './SourceForm';

class NewSource extends Component {

  static propTypes = {
    router: PropTypes.object,
  };

  state = {
    name: '',
    url: '',
    script: '',
    cron: '0 * * * *',//every hour at 0 minute
    harvestMode: null,
    errors: {},
  }

  render() {
    return (
      <div style={styles.container}>
      <Paper style={styles.paper}>
        <h1>New source</h1>
        <SourceForm {...this.state} onChange={v => this.setState(v)}/>
        <div style={styles.buttonsHolder}>
          <FlatButton label="Cancel" primary={true} onTouchTap={this.onCancel}/>
          <FlatButton label="Add" primary={true} onTouchTap={this.onCreate}/>
        </div>
      </Paper>
      </div>
    );
  }

  onCreate = () => {
    createSource.callPromise(this.state)
      .then(result => this.props.router.goBack())
      .catch(err => {
        if (ValidationError.is(err)){
          const errors = {};
          err.details.forEach((fieldError) => {
            errors[fieldError.name] = fieldError.type;
          });
          this.setState({errors});
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

export default adminOnly(withRouter(NewSource));