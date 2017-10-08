import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { adminOnly } from '../../components';
import { ResourceType } from '../../ww-commons';

interface Props {
  resourceType: ResourceType;
}

const Footer: React.StatelessComponent<Props> = ({ resourceType }) => (
  <CardActions>
    <FlatButton label="Add new" href={`/${resourceType}s/new`} />
  </CardActions>
);

export default adminOnly(Footer) as React.ComponentType<Props>;
