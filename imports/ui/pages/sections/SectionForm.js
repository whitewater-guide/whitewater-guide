import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput, Select, CoordinatesGroup, ChipInput, RichTextInput, SeasonPickerField, Rating, Checkbox} from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import TextField from 'material-ui/TextField';
import PutInMapDialog from './PutInMapDialog';
import MediaCollection from './MediaCollection';
import POICollection from './POICollection';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Rivers} from '../../../api/rivers';
import {Gauges} from '../../../api/gauges';
import {Regions} from '../../../api/regions';
import {Sections, Durations} from '../../../api/sections';
import {SupplyTags, KayakingTags, HazardTags, MiscTags} from '../../../api/tags';
import {TAPi18n} from 'meteor/tap:i18n';
import _ from 'lodash';

class SectionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    sectionId: PropTypes.string,//Edit existing section, undefined for new section
    riverId: PropTypes.string,//River id for new section, undefined when editing existing section
    regionId: PropTypes.string,
    river: PropTypes.object,
    gauges: PropTypes.array,
    ready: PropTypes.bool,
    supplyTags: PropTypes.array,
    kayakingTags: PropTypes.array,
    hazardTags: PropTypes.array,
    miscTags: PropTypes.array,
    router: PropTypes.object,
    currentTab: PropTypes.string,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  state = {
    mapOpen: false,
  };

  render() {
    const {ready, supplyTags, kayakingTags, hazardTags, miscTags, initialData, ...formProps} = this.props;
    if (!ready)
      return null;

    //Replace references with values
    let formData = _.omit(initialData, ['mediaIds', 'poiIds']);
    formData.media = _.isEmpty(initialData) ? [] : initialData.media().fetch();
    formData.pois = _.isEmpty(initialData) ? [] : initialData.pois().fetch();
    if (_.isEmpty(initialData)) {
      formData.riverId = this.props.riverId;
    }
    //When creating new section, river is passed via query, otherwise it is in section doc
    const river = this.props.river || initialData.river().fetch()[0];
    const region = river.region().fetch()[0];

    return (
      <Form {...formProps} initialData={formData} name="sections" transformBeforeSubmit={this.transformBeforeSubmit}>
        <Tabs value={this.props.currentTab} onChange={this.onTabChange}>
          <Tab label="Main" value="#main">
            <TextField value={river.name} disabled={true} hintText="River" floatingLabelText="River"
                       style={styles.textInput}/>
            <Field name="name" title="Name" component={TextInput}/>
            <div style={styles.row}>
              <Field name="difficulty" title="Difficulty (I-VI)" component={TextInput} type="number"/>
              <Field name="difficultyXtra" title="Difficulty (extra)" component={TextInput}/>
              <Field name="rating" title="Rating" component={Rating}/>
            </div>
            <Field name="gaugeId" title="Gauge" component={Select} options={this.props.gauges}/>
            <div style={styles.row}>
              <Field name="levels.minimum" title="Minimal level" component={TextInput} type="number"/>
              <Field name="levels.optimum" title="Optimal level" component={TextInput} type="number"/>
              <Field name="levels.maximum" title="Maximal level" component={TextInput} type="number"/>
              <Field name="levels.impossible" title="Absolute maximum" component={TextInput} type="number"/>
              <Field name="levels.approximate" title="Is approximate" component={Checkbox}/>
            </div>
            <div style={styles.row}>
              <Field name="flows.minimum" title="Minimal flow" component={TextInput} type="number"/>
              <Field name="flows.optimum" title="Optimal flow" component={TextInput} type="number"/>
              <Field name="flows.maximum" title="Maximal flow" component={TextInput} type="number"/>
              <Field name="flows.impossible" title="Absolute maximum" component={TextInput} type="number"/>
              <Field name="flows.approximate" title="Is approximate" component={Checkbox}/>
            </div>
            <Field name="putIn" title="Put-in location (this must be point on the river!)" component={CoordinatesGroup} mapButtonHandler={this.showMap}/>
            <Field name="takeOut" title="Take-out location (this must be point on the river!)" component={CoordinatesGroup} mapButtonHandler={this.showMap}/>
          </Tab>
          <Tab label="Properties" value="#properties">
            <div style={styles.row}>
              <Field name="drop" title="Drop, m" component={TextInput} type="number"/>
              <Field name="distance" title="Length, km" component={TextInput} type="number"/>
              <Field name="duration" title="Duration" component={Select} options={Durations}
                     extractKey={d => d.slug} extractValue={d => d.value} extractLabel={d => d.slug}/>

            </div>
            <Field name="season" title="Season" component={TextInput}/>
            <Field name="seasonNumeric" component={SeasonPickerField}/>
            <Field name="supplyTagIds" title="River supply" component={ChipInput} options={supplyTags}/>
            <Field name="kayakingTagIds" title="Kayaking types" component={ChipInput} options={kayakingTags}/>
            <Field name="hazardsTagIds" title="Hazards" component={ChipInput} options={hazardTags}/>
            <Field name="miscTagIds" title="Tags" component={ChipInput} options={miscTags}/>
          </Tab>
          <Tab label="Media" value="#media">
            <Field name="media" title="Media" component={MediaCollection}/>
          </Tab>
          <Tab label="POIs" value="#pois">
            <Field name="pois" title="Points of interest" component={POICollection} bounds={region.bounds}/>
          </Tab>
          <Tab label="Description" value="#description">
            <div style={styles.descriptionTab}>
              <Field name="description" title="Description" component={RichTextInput}/>
            </div>
          </Tab>
        </Tabs>
        {
          this.state.mapOpen &&
          <PutInMapDialog numPoints={2} onClose={this.onCloseMap} onSubmit={this.onSubmitMap} bounds={region.bounds}/>
        }
      </Form>
    );
  }

  onTabChange = (value) => {
    const location = this.props.router.location;
    this.props.router.replace({...location, hash: value});
  };

  transformBeforeSubmit = (data) => {
    if (data.levels && !data.levels.minimum && !data.levels.maximum && !data.levels.optimum && !data.levels.impossible)
      data = _.omit(data, 'levels');
    return data;
  };

  showMap = () => {
    this.setState({mapOpen: true});
  };

  onCloseMap = () => {
    this.setState({mapOpen: false});
  };

  onSubmitMap = () => {
    this.setState({mapOpen: false});
  };
}

const styles = {
  textInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  descriptionTab: {
    height: 600,
  },
};

const SectionFormContainer = createI18nContainer(
  (props) => {
    const {sectionId, riverId, regionId} = props;
    const sub = TAPi18n.subscribe('sections.edit', props.language, {sectionId, riverId, regionId});
    const section = props.sectionId ? Sections.findOne(props.sectionId) : {};
    const river = props.riverId ? Rivers.findOne(props.riverId) : undefined;
    //We must follow river->region->sources->gauges chain here
    //It is already chained on server side, we hope that no more gauge subscriptions are active atm
    const gauges = Gauges.find({}).fetch();
    return {
      river,
      gauges,
      supplyTags: SupplyTags.find().fetch(),
      kayakingTags: KayakingTags.find().fetch(),
      hazardTags: HazardTags.find().fetch(),
      miscTags: MiscTags.find().fetch(),
      ready: sub.ready(),
      initialData: section,
    }
  },
  SectionForm
);

export default SectionFormContainer;