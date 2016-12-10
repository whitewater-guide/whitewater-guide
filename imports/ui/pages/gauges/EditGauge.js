import React, {Component, PropTypes} from "react";
import GaugeForm from "./GaugeForm";
import {editGauge} from "../../../api/gauges";
import adminOnly from "../../hoc/adminOnly";
import {withRouter} from "react-router";

class EditGauge extends Component {
  static propTypes = {
    router: PropTypes.object,
    params: PropTypes.shape({
      gaugeId: PropTypes.string,
    }),
  };

  render() {
    return (
      <GaugeForm
        gaugeId={this.props.params.gaugeId}
        method={editGauge}
        title="Gauge Settings"
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

export default adminOnly(withRouter(EditGauge));