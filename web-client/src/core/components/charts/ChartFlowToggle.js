import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const ChartFlowToggle = ({ measurement, onChange }) => (
  <SelectField
    value={measurement}
    onChange={(event, index, newMeasurement) => onChange(newMeasurement)}
  >
    <MenuItem value={'level'} primaryText="Level" />
    <MenuItem value={'flow'} primaryText="Flow" />
  </SelectField>
);

ChartFlowToggle.propTypes = {
  measurement: PropTypes.oneOf(['flow', 'level']).isRequired,
  // unit: PropTypes.string.isRequired,
  // value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChartFlowToggle;
