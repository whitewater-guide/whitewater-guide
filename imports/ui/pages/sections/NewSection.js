import React, {Component, PropTypes} from 'react';
import {createSection} from '../../../api/sections';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';
import SectionForm from './SectionForm';

class NewSection extends Component {

  static propTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const currentTab = this.props.router.location.hash || '#main';
    return (
      <SectionForm method={createSection}
                   multilang={false}
                   title="New Section"
                   submitLabel="Create"
                   riverId={this.props.location.query.riverId}
                   regionId={this.props.location.query.regionId}
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

export default adminOnly(withRouter(NewSection));