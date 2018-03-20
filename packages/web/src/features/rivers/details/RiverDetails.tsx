import React from 'react';
import { WithRiver } from '../../../ww-clients/features/rivers';

const RiverDetails: React.StatelessComponent<WithRiver> = props => (
  <div>
    <span>{props.river.node.name}</span>
  </div>
);

export default RiverDetails;
