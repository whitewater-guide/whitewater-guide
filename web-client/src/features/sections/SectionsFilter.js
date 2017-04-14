import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';

export default class SectionsFilter extends React.Component {
  static propTypes = {
    searchString: PropTypes.string,
    onSearch: PropTypes.func,
  };

  render() {
    return (
      <div style={styles.container}>
        <TextField
          fullWidth={true}
          hintText="Section or river name"
          value={this.props.searchString}
          onChange={this.onSearch}
        />
      </div>
    );
  }

  onSearch = (e, value) => this.props.onSearch(value);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: 32,
    paddingLeft: 8,
  },
};