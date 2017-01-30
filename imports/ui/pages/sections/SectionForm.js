import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput, Select, CoordinatesGroup, ChipInput, RichTextInput, SeasonPickerField, Rating, Checkbox} from '../../forms';
import AutoComplete, {NEW_ITEM} from '../../forms/AutoComplete';
import createI18nContainer from '../../hoc/createI18nContainer';
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
    rivers: PropTypes.array,
    gauges: PropTypes.array,
    region: PropTypes.object,
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
    const {ready, supplyTags, kayakingTags, hazardTags, miscTags, initialData, rivers, region, sectionId, riverId, ...formProps} = this.props;
    if (!ready)
      return null;

    //Replace references with values
    let formData = _.omit(initialData, ['mediaIds', 'poiIds']);
    formData.media = _.isEmpty(initialData) ? [] : initialData.media().fetch();
    formData.pois = _.isEmpty(initialData) ? [] : initialData.pois().fetch();
    //When editing existing section, or creating section on known river, the river autocomplete is unnecessary
    //Therefore we fill it with only one value and disable
    //When creating section (plus, optionally, a river) in a region - we allow to select river from the list or create one
    formData.river = (sectionId || riverId) ? _.pick(rivers[0], ['_id', 'name']) : {_id: NEW_ITEM, name: ''};

    return (
      <Form {...formProps} initialData={formData} name="sections" transformBeforeSubmit={this.transformBeforeSubmit}>
        <Tabs value={this.props.currentTab} onChange={this.onTabChange}>
          <Tab label="Main" value="#main">
            <Field name="river" title="River" component={AutoComplete} openOnFocus={true} dataSource={rivers}
                   disabled={!!sectionId || !!riverId} />
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
    if (this.props.regionId)
      data = {...data, river: {...data.river, regionId: this.props.regionId}};
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
    const rivers = sectionId ?
                    (section && section.river().fetch()) :
                    riverId ? Rivers.find(riverId).fetch() : Rivers.find({regionId}).fetch();
    const gauges = Gauges.find({}).fetch();
    const region = regionId ? Regions.findOne(regionId) : (rivers && rivers[0] && rivers[0].region().fetch()[0]);
    return {
      rivers,
      gauges,
      region,
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