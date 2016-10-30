import React, {Component, PropTypes} from 'react';
import { Sections, editSection } from '../../../api/sections';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import SectionForm from './SectionForm';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

class EditSection extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      sectionId: PropTypes.string,
    }),
    section: PropTypes.object,
    ready: PropTypes.bool,
  };

  render() {
    if (!this.props.ready)
      return null;
    return (
      <SectionForm method={editSection}
                   title="Section settings"
                   submitLabel="Update"
                   initialData={this.props.section}
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

const EditSectionContainer = createContainer(
  (props) => {
    const sub = Meteor.subscribe('sections.details', props.params.sectionId);
    const section = Sections.findOne(props.params.sectionId);
    return {
      section,
      ready: sub.ready(),
    };
  },
  EditSection
);

export default adminOnly(withRouter(EditSectionContainer));