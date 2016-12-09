import React, {Component, PropTypes} from 'react';
import { upsertSection } from '../../../api/sections';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SectionForm from './SectionForm';

class EditSection extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      sectionId: PropTypes.string,
    })
  };

  render() {
    const currentTab = this.props.router.location.hash || '#main';
    return (
      <SectionForm method={upsertSection}
                   title="Section settings"
                   submitLabel="Update"
                   sectionId={this.props.params.sectionId}
                   onSubmit={this.onSubmit}
                   onCancel={this.onCancel}
                   currentTab={currentTab}
                   router={this.props.router}
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

export default adminOnly(withRouter(EditSection));