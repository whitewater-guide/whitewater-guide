import React, {Component, PropTypes} from 'react';
import { createRiver } from '../../../api/rivers';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SectionForm from './SectionForm';

class NewSection extends Component {

  static propTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const initialData = {riverId: this.props.location.query.riverId};
    return (
      <SectionForm method={createRiver}
                 title="New Section"
                 submitLabel="Create"
                 initialData={initialData}
                 onSubmit={this.onSubmit}
                 onCancel={this.onCancel}
      />
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };

}

export default adminOnly(withRouter(NewSection));