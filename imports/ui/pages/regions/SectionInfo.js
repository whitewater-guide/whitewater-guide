import React, {PropTypes} from 'react';
import {renderDifficulty} from '/imports/utils/TextUtils';
import Rating from '/imports/ui/forms/Rating';
import {withRouter} from 'react-router';
import withAdmin from '../../hoc/withAdmin';
import IconButton from 'material-ui/IconButton';
import {Durations} from '/imports/api/sections';
import renderHTML from 'react-render-html';
import _ from 'lodash';
import './sectionInfo.css';

class SectionInfo extends React.Component {
  static propTypes = {
    section: PropTypes.object,
    admin: PropTypes.bool,
    router: PropTypes.object,
  };

  durationsMap = _.keyBy(Durations, 'value');

  render() {
    return this.props.section ? this.renderInfo() : this.renderEmpty();
  }

  renderInfo = () => {
    const {section, admin} = this.props;
    return (
      <div style={styles.table}>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            <h3>{`${section.riverName} - ${section.name}`}</h3>
          </div>
          {admin && <IconButton iconClassName="material-icons" onTouchTap={this.editHandler}>mode_edit</IconButton>}
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Difficulty
          </div>
          <div style={styles.valueCol}>
            {renderDifficulty(section)}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Rating
          </div>
          <div style={styles.valueCol}>
            <Rating field={{value: section.rating}} style={styles.rating}/>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Put-in
          </div>
          <div style={styles.valueCol}>
            <span>
              {`${section.putIn.coordinates[1]}`}
            </span>
            <span>
              {`${section.putIn.coordinates[0]}`}
            </span>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Take-out
          </div>
          <div style={styles.valueCol}>
            <span>
              {`${section.takeOut.coordinates[1]}`}
            </span>
            <span>
              {`${section.takeOut.coordinates[0]}`}
            </span>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Drop
          </div>
          <div style={styles.valueCol}>
            {section.drop}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Length
          </div>
          <div style={styles.valueCol}>
            {section.distance}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.labelCol}>
            Duration
          </div>
          <div style={styles.valueCol}>
            {_.get(this.durationsMap, [section.duration, 'slug'])}
          </div>
        </div>

        <div style={styles.description} className="description">
          {section.description && renderHTML(section.description)}
        </div>

      </div>
    );
  };

  editHandler = () => {
    const {router, section} = this.props;
    router.push(`/sections/${section._id}/settings`);
  };

  renderEmpty = () => {
    return (
      <p>Please select section</p>
    );
  };
}

const styles = {
  table: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'stretch'
  },
  labelCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  valueCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rating: {
    minWidth: 10,
  },
  description: {
    maxWidth: 344,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 12,
    alignSelf: 'stretch',
    overflowY: 'auto',
    overflowX: 'auto',
  },
};

export default withRouter(withAdmin(SectionInfo));