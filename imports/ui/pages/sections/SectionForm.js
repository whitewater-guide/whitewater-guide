import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select, CoordinatesGroup, ChipInput, RichTextInput } from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import TextField from 'material-ui/TextField';
import MediaCollection from './MediaCollection';
import {Tabs, Tab} from 'material-ui/Tabs';
import { Rivers } from '../../../api/rivers';
import { Gauges } from '../../../api/gauges';
import { Sections } from '../../../api/sections';
import { SupplyTags, KayakingTags, HazardTags, MiscTags} from '../../../api/tags';
import { TAPi18n } from 'meteor/tap:i18n';
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

  render() {
    const {ready, supplyTags, kayakingTags, hazardTags, miscTags, initialData, ...formProps} = this.props;
    if (!ready)
      return null;

    //Replace references with values
    let formData = _.omit(initialData, ['mediaIds', 'putInId', 'takeOutId']);
    formData.media = _.isEmpty(initialData) ? [] : initialData.media().fetch();
    formData.putIn = _.isEmpty(initialData) ? undefined : initialData.putIn().fetch()[0];
    formData.takeOut = _.isEmpty(initialData) ? undefined : initialData.takeOut().fetch()[0];
    if (_.isEmpty(initialData))
      formData.riverId = this.props.riverId;
    //When creating new section, river is passed via query, otherwise it is in section doc
    const river = this.props.river || initialData.river().fetch();

    return (
      <Form {...formProps} initialData={formData} name="sections" transformBeforeSubmit={this.transformBeforeSubmit}>
        <Tabs value={this.props.currentTab} onChange={this.onTabChange}>
          <Tab label="Main" value="#main">
            <TextField value={river.name} disabled={true} hintText="River" floatingLabelText="River"
                       style={styles.textInput}/>
            <Field name="name" title="Name" component={TextInput}/>
            <Field name="gaugeId" title="Gauge" component={Select} options={this.props.gauges}/>
            <div style={styles.row}>
              <Field name="levels.minimum" title="Minimal level" component={TextInput} type="number"/>
              <Field name="levels.optimum" title="Optimal level" component={TextInput} type="number"/>
              <Field name="levels.maximum" title="Maximal level" component={TextInput} type="number"/>
              <Field name="levels.impossible" title="Absolute maximum" component={TextInput} type="number"/>
            </div>
            <Field name="putIn" title="Put-in location" component={CoordinatesGroup}/>
            <Field name="takeOut" title="Take-out location" component={CoordinatesGroup}/>
          </Tab>
          <Tab label="Properties" value="#properties">
            <div style={styles.row}>
              <Field name="length" title="Length, km" component={TextInput} type="number"/>
              <Field name="difficulty" title="Difficulty (I-VI)" component={TextInput} type="number"/>
              <Field name="gradient" title="Gradient, m/km" component={TextInput} type="number"/>
            </div>
            <Field name="season" title="Season" component={TextInput}/>
            <Field name="supplyTagIds" title="River supply" component={ChipInput} options={supplyTags}/>
            <Field name="kayakingTagIds" title="Kayaking types" component={ChipInput} options={kayakingTags}/>
            <Field name="hazardsTagIds" title="Hazards" component={ChipInput} options={hazardTags}/>
            <Field name="miscTagIds" title="Tags" component={ChipInput} options={miscTags}/>
          </Tab>
          <Tab label="Media" value="#media">
            <Field name="media" title="Media" component={MediaCollection}/>
          </Tab>
          <Tab label="Description" value="#description">
            <div style={styles.descriptionTab}>
              <Field name="description" title="Description" component={RichTextInput}/>
            </div>
          </Tab>
        </Tabs>
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
}

const styles = {
  textInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
  },
  descriptionTab: {
    height: 600,
  },
};

const SectionFormContainer = createI18nContainer(
  (props) => {
    const sub = TAPi18n.subscribe('sections.edit', props.language, props.sectionId, props.riverId);
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