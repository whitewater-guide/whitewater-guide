import React, {Component, PropTypes} from "react";
import adminOnly from "../../hoc/adminOnly";
import {withRouter} from "react-router";
import RegionForm from "./RegionForm";

class EditRegion extends Component {

  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      regionId: PropTypes.string,
    }),
  };

  render() {
    return (
      <RegionForm
        regionId={this.props.params.regionId}
        title="Edit Region"
        submitLabel="Update"
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

export default adminOnly(withRouter(EditRegion));