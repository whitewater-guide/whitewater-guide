import React from 'react';

import { AdminRoute } from '../../layout';
import HistoryMain from './HistoryMain';

const HistoryRoute: React.FC = () => (
  <AdminRoute exact path="/history" component={HistoryMain} />
);

export default HistoryRoute;
