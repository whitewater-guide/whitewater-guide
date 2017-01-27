import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput, RichTextInput} from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import SeasonPickerField from '/imports/ui/forms/SeasonPickerField';
import {Regions} from '../../../api/regions';
import {TAPi18n} from 'meteor/tap:i18n';
import {Tabs, Tab} from 'material-ui/Tabs';
import _ from 'lodash';
import POICollection from "../sections/POICollection";

class RegionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    regionId: PropTypes.string,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    let {ready, initialData, ...props} = this.props;
    if (!ready)
      return null;

    let data = _.omit(initialData, ['poiIds']);
    data.pois = _.isEmpty(initialData) ? [] : initialData.pois().fetch();

    return (
      <Form {...props} initialData={data} style={styles.form} name="regions">
        <Tabs>
          <Tab label="Main" value="#main">
            <Field name="name" title="Name" component={TextInput}/>
            <Field name="season" title="Season" component={TextInput}/>
            <Field name="seasonNumeric" component={SeasonPickerField}/>
          </Tab>
          <Tab label="Description" value="#description">
            <Field name="description" title="description" component={RichTextInput}/>
          </Tab>
          <Tab label="POIS" value="#pois">
            <Field name="pois" title="Points of interest" component={POICollection}/>
          </Tab>
        </Tabs>
      </Form>
    );
  }
}

const styles = {
  form: {
    width: '100%',
    marginLeft: 24,
    marginRight: 24,
  },
};

const RegionFormContainer = createI18nContainer(
  (props) => {
    const sub = TAPi18n.subscribe('regions.details', props.language, props.regionId);
    const region = Regions.findOne(props.regionId);
    return {
      ready: sub.ready(),
      initialData: region,
    }
  },
  RegionForm
);

export default RegionFormContainer;