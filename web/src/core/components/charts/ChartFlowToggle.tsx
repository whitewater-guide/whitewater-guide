import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const ChartFlowToggle = ({ enabled, measurement, onChange }) => {
  if (!enabled) {
    return null;
  }
  return (
    <SelectField
      value={measurement}
      onChange={(event, index, newMeasurement) => onChange(newMeasurement)}
    >
      <MenuItem value={'level'} primaryText="Level" />
      <MenuItem value={'flow'} primaryText="Flow" />
    </SelectField>
  );
};

ChartFlowToggle.propTypes = {
  measurement: PropTypes.oneOf(['flow', 'level']).isRequired,
  enabled: PropTypes.bool.isRequired,
  // unit: PropTypes.string.isRequired,
  // value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChartFlowToggle;
