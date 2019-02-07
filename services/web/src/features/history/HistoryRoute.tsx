import React from 'react';
import { AdminRoute } from '../../layout';
import HistoryMain from './HistoryMain';

export const HistoryRoute: React.FC = () => (
  <AdminRoute exact path="/history" component={HistoryMain} />
);
