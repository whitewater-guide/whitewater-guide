import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import TagControl from './TagControl';
import { withTags } from '../../commons/features/tags';
import { spinnerWhileLoading } from '../../core/components';
import { withAdmin } from '../users';

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowY: 'scroll',
  },
};

class ListTags extends React.PureComponent {

  static propTypes = {
    kayakingTags: PropTypes.array,
    hazardsTags: PropTypes.array,
    miscTags: PropTypes.array,
    supplyTags: PropTypes.array,
  };

  renderTag = category => tag => (
    <TagControl key={tag._id} tag={{ ...tag, category }} />
  );

  renderNewTag = category => (
    <TagControl key={`new_${category}`} tag={{ name: '', slug: '', category }} />
  );

  render() {
    return (
      <div style={styles.container}>
        <h1>Kayaking Types</h1>
        { this.props.kayakingTags.map(this.renderTag('kayakingTags')) }
        { this.renderNewTag('kayakingTags')}
        <h1>Hazard Types</h1>
        { this.props.hazardsTags.map(this.renderTag('hazardsTags')) }
        <h1>Supply Types</h1>
        { this.props.supplyTags.map(this.renderTag('supplyTags')) }
        <h1>Misc Tags</h1>
        { this.props.miscTags.map(this.renderTag('miscTags')) }
      </div>
    );
  }
}

export default compose(
  withAdmin(true),
  withTags,
  spinnerWhileLoading(props => props.tagsLoading),
)(ListTags);
