import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import renderHTML from 'react-render-html';
import {createContainer} from 'meteor/react-meteor-data';
import {Sources} from '../../../api/sources';

class TermsOfUse extends Component {

  static propTypes = {
    source: PropTypes.object,
    params: PropTypes.object,
  };

  render() {
    const {source} = this.props;
    return (
      <div style={styles.container}>
        <h1>Terms of use</h1>
        <div style={styles.termsContainer}>
        { source && source.termsOfUse && renderHTML(source.termsOfUse) }
        </div>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  termsContainer: {
    display: 'flex',
    paddingTop: 16,
  }
};

const TermsOfUseContainer = createContainer(
  (props) => {
    const sub = Meteor.subscribe('sources.details', props.params.sourceId);
    const source = Sources.findOne(props.params.sourceId);
    return {
      ready: sub.ready(),
      source,
    };
  },
  TermsOfUse
);

export default TermsOfUseContainer;