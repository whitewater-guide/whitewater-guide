import React, {Component, PropTypes} from "react";
import {editRiver} from "../../../api/rivers";
import adminOnly from "../../hoc/adminOnly";
import {withRouter} from "react-router";
import RiverForm from "./RiverForm";
import {createContainer} from "meteor/react-meteor-data";

class EditRiver extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      riverId: PropTypes.string,
    }),
  };

  render() {
    return (
      <RiverForm
        method={editRiver}
        riverId={this.props.params.riverId}
        title="Edit River"
        submitLabel="Update"
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        initialData={this.props.river}
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

export default adminOnly(withRouter(EditRiver));