import React, {Component, PropTypes} from 'react';
import RatingInternal from 'react-rating';
import FontIcon from 'material-ui/FontIcon';

class Rating extends Component {
  static propTypes = {
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.number,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    type: PropTypes.string,
  };

  render() {
    const empty = <FontIcon className="material-icons" style={styles.icon}>star_border</FontIcon>;
    const full = <FontIcon className="material-icons" style={styles.icon}>star</FontIcon>;
    return (
      <div style={styles.wrapper}>
        <span>{this.props.title}</span>
        <RatingInternal
          fractions={2}
          empty={empty}
          full={full}
          initialRate={this.props.field.value}
          onChange={this.props.field.onChange}
        />
      </div>
    );
  }
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  icon: {
    width: 24,
  },
};

export default Rating;