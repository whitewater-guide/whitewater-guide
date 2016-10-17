import React, {Component, PropTypes} from 'react';
import { createSource } from '../../../api/sources';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SourceForm from './SourceForm';
import moment from 'moment';

class NewSource extends Component {

  static propTypes = {
    router: PropTypes.object,
  };

  render() {
    const initialData = {
      name: '',
      url: '',
      script: '',
      cron: `${(moment().minute() + 2) % 60} * * * *`,//every hour
      harvestMode: null,
    };
    return (
      <SourceForm method={createSource} title="New Source" submitLabel="Create"
        onSubmit={this.onSubmit} onCancel={this.onCancel}
        initialData={initialData}/>
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };

}

export default adminOnly(withRouter(NewSource));