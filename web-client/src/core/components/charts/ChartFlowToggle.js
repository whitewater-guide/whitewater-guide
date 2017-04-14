import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const ChartFlowToggle = ({ value, onChange }) => (
  <SelectField
    value={value}
    onChange={(event, index, unit) => onChange({ unit })}
  >
    <MenuItem value={'level'} primaryText="Level" />
    <MenuItem value={'flow'} primaryText="Flow" />
  </SelectField>
);

ChartFlowToggle.propTypes = {
  value: PropTypes.oneOf(['flow', 'level']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChartFlowToggle;
