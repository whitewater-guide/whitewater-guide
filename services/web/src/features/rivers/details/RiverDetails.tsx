import React from 'react';
import { WithRiver } from '@whitewater-guide/clients';

const RiverDetails: React.StatelessComponent<WithRiver> = (props) => (
  <div>
    <span>{props.river.node.name}</span>
  </div>
);

export default RiverDetails;
