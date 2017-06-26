import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import { WhitePortal } from 'react-native-portal';
import { completeGuideStep } from '../../core/actions';

class GuideModal extends React.PureComponent {
  static propTypes = {
    step: PropTypes.number.isRequired,
    completeGuideStep: PropTypes.func.isRequired,
  };

  onRequestClose = () => this.props.completeGuideStep(this.props.step);

  render() {
    return (
      <Modal visible={this.props.step >= 0} onRequestClose={this.onRequestClose}>
        <WhitePortal name="guidePortal" />
      </Modal>
    );
  }
}

export default connect(
  state => ({ step: state.persistent.guide.currentStep }),
  { completeGuideStep },
)(GuideModal);
