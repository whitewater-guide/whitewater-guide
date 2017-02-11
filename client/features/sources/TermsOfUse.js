import React, {Component, PropTypes} from 'react';
import renderHTML from 'react-render-html';
import container from './TermsOfUseContainer';

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

export default container(TermsOfUse);