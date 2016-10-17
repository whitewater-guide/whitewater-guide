import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
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
    ready: PropTypes.bool,
    source: PropTypes.object,
  };

  constructor(props) {
    super(props);
    if (props.source)
      this.state = {...this.state, initialData: { ...props.source } };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source) {
      this.setState({ initialData: { ...nextProps.source } });
    }
  }
  
  render() {
    if (!this.props.ready)
      return null;
    return (
      <SourceForm method={editSource} title="Source settings" submitLabel="Update"
        onSubmit={this.onSubmit} onCancel={this.onCancel}
        initialData={this.state.initialData}/>
    );
  }
  
  onSubmit = () => {
    this.props.router.goBack();
  };

  onCancel = () => {
    this.props.router.goBack();
  };

}

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