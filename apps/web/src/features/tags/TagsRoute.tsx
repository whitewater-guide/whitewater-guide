import React from 'react';

import { AdminRoute } from '../../layout';
import TagsList from './TagsList';

const TagsRoute: React.FC = () => (
  <AdminRoute exact path="/tags" component={TagsList} />
);

export default TagsRoute;
