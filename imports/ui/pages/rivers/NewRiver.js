import React, {Component, PropTypes} from 'react';
import { createRiver } from '../../../api/rivers';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import RiverForm from './RiverForm';

class NewRiver extends Component {

  static propTypes = {
    router: PropTypes.object,
  };

  render() {
    return (
      <RiverForm method={createRiver} title="New River" submitLabel="Create"
                  onSubmit={this.onSubmit} onCancel={this.onCancel}/>
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };

}

export default adminOnly(withRouter(NewRiver));