import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import {
  Form,
  Field,
  TextInput,
  Select,
  ChipInput,
  RichTextInput,
  SeasonPickerField,
  Rating,
  Checkbox,
  AutoComplete,
  DrawingMapField,
} from '../../core/forms';
import { MediaCollection } from '../media';
import { POICollection } from '../points';
import { TabTemplate } from '../../core/components';
import { Durations } from './Durations';
import container from './SectionFormContainer';

class SectionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    riverId: PropTypes.string,// River id for new section, undefined when editing existing section
    rivers: PropTypes.array,
    gauges: PropTypes.array,
    region: PropTypes.object,
    loading: PropTypes.bool,
    supplyTags: PropTypes.array,
    kayakingTags: PropTypes.array,
    hazardTags: PropTypes.array,
    miscTags: PropTypes.array,
    replace: PropTypes.func,
    location: PropTypes.object,
    currentTab: PropTypes.string,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  onTabChange = (value) => {
    const { location, history } = this.props;
    history.replace({ ...location, hash: value });
  };

  render() {
    const { loading, rivers, region, gauges, riverId, ...props } = this.props;
    if (loading || !region) {
      return null;
    }

    return (
      <Form {...props} name="sections" transformBeforeSubmit={this.transformBeforeSubmit}>
        <Tabs value={this.props.currentTab} onChange={this.onTabChange} tabTemplate={TabTemplate}
              style={styles.tabsStyle} contentContainerStyle={styles.contentContainerStyle}>
          <Tab label="Main" value="#main">
            <Field name="river" title="River" component={AutoComplete} openOnFocus={true}
                   dataSource={rivers} disabled={!!props.initialData._id || !!riverId} />
            <Field name="name" title="Name" component={TextInput} />
            <div style={styles.row}>
              <Field name="difficulty" title="Difficulty (I-VI)" component={TextInput} type="number" />
              <Field name="difficultyXtra" title="Difficulty (extra)" component={TextInput} />
              <Field name="rating" title="Rating" component={Rating} />
            </div>
            <Field name="gauge._id" title="Gauge" component={Select} options={gauges} />
            <div style={styles.row}>
              <Field name="levels.minimum" title="Minimal level" component={TextInput} type="number" />
              <Field name="levels.optimum" title="Optimal level" component={TextInput} type="number" />
              <Field name="levels.maximum" title="Maximal level" component={TextInput} type="number" />
              <Field name="levels.impossible" title="Absolute maximum" component={TextInput} type="number" />
              <Field name="levels.approximate" title="Is approximate" component={Checkbox} />
            </div>
            <div style={styles.row}>
              <Field name="flows.minimum" title="Minimal flow" component={TextInput} type="number" />
              <Field name="flows.optimum" title="Optimal flow" component={TextInput} type="number" />
              <Field name="flows.maximum" title="Maximal flow" component={TextInput} type="number" />
              <Field name="flows.impossible" title="Absolute maximum" component={TextInput} type="number" />
              <Field name="flows.approximate" title="Is approximate" component={Checkbox} />
            </div>
          </Tab>
          <Tab label="Shape" value="#shape">
            <Field name="shape" drawingMode="polyline" bounds={region.bounds} component={DrawingMapField} />
          </Tab>
          <Tab label="Properties" value="#properties">
            <div style={styles.row}>
              <Field name="drop" title="Drop, m" component={TextInput} type="number" />
              <Field name="distance" title="Length, km" component={TextInput} type="number" />
              <Field name="duration" title="Duration" component={Select} options={Durations}
                     extractKey={d => d.slug} extractValue={d => d.value} extractLabel={d => d.slug} />

            </div>
            <Field name="season" title="Season" component={TextInput} />
            <Field name="seasonNumeric" component={SeasonPickerField} />
            <Field name="supplyTags" title="River supply" component={ChipInput} options={this.props.supplyTags} />
            <Field name="kayakingTags" title="Kayaking types" component={ChipInput} options={this.props.kayakingTags} />
            <Field name="hazardsTags" title="Hazards" component={ChipInput} options={this.props.hazardTags} />
            <Field name="miscTags" title="Tags" component={ChipInput} options={this.props.miscTags} />
          </Tab>
          <Tab label="Media" value="#media">
            <Field name="media" title="Media" component={MediaCollection} />
          </Tab>
          <Tab label="POIs" value="#pois">
            <Field name="pois" title="Points of interest" component={POICollection} bounds={region.bounds} />
          </Tab>
          <Tab label="Description" value="#description">
            <Field name="description" title="Description" component={RichTextInput} />
          </Tab>
        </Tabs>
      </Form>
    );
  }

}

const styles = {
  textInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  tabsStyle: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  contentContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
  },
};

export default container(SectionForm);
