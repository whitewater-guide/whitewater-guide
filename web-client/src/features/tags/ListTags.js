import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import TagControl from './TagControl';
import { withTags } from '../../commons/features/tags';
import { spinnerWhileLoading } from '../../core/components';
import { withAdmin } from '../users';
import withTagsAdmin from './withTagsAdmin';

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
    removeTag: PropTypes.func,
    upsertTag: PropTypes.func,
  };

  renderTag = category => tag => (
    <TagControl key={tag._id} tag={{ ...tag, category }} onRemove={this.props.removeTag} onEdit={this.props.upsertTag} />
  );

  renderNewTag = category => (
    <TagControl key={`new_${category}`} tag={{ name: '', slug: '', category }} onEdit={this.props.upsertTag} />
  );

  render() {
    return (
      <div style={styles.container}>
        <h3>Kayaking Types</h3>
        { this.props.kayakingTags.map(this.renderTag('KayakingTags')) }
        { this.renderNewTag('KayakingTags')}
        <h3>Hazard Types</h3>
        { this.props.hazardsTags.map(this.renderTag('HazardsTags')) }
        { this.renderNewTag('HazardsTags')}
        <h3>Supply Types</h3>
        { this.props.supplyTags.map(this.renderTag('SupplyTags')) }
        { this.renderNewTag('SupplyTags')}
        <h3>Misc Tags</h3>
        { this.props.miscTags.map(this.renderTag('MiscTags')) }
        { this.renderNewTag('MiscTags')}
      </div>
    );
  }
}

export default compose(
  withAdmin(true),
  withTags,
  withTagsAdmin,
  spinnerWhileLoading(props => props.tagsLoading),
)(ListTags);
