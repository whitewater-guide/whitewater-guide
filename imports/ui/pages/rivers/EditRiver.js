import React, {Component, PropTypes} from 'react';
import { Rivers, editRiver } from '../../../api/rivers';
import adminOnly from '../../hoc/adminOnly';
import { withRouter } from 'react-router';
import RiverForm from './RiverForm';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

class EditRiver extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      riverId: PropTypes.string,
    }),
    river: PropTypes.object,
    ready: PropTypes.bool,
  };

  render() {
    if (!this.props.ready)
      return null;
    return (
      <RiverForm method={editRiver} title="Edit River" submitLabel="Update"
                 onSubmit={this.onSubmit} onCancel={this.onCancel}
                 initialData={this.props.river}/>
    );
  }

  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };

}

const EditRiverContainer = createContainer(
  (props) => {
    const sub = Meteor.subscribe('rivers.details', props.params.riverId);
    const river = Rivers.findOne(props.params.riverId);
    return {
      river,
      ready: sub.ready(),
    };
  },
  EditRiver
);

export default adminOnly(withRouter(EditRiverContainer));