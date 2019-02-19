import { WithRiver } from '@whitewater-guide/clients';
import React from 'react';

const RiverDetails: React.StatelessComponent<WithRiver> = (props) => (
  <div>
    <span>{props.river.node.name}</span>
  </div>
);

export default RiverDetails;
