import * as React from 'react';

export const Row: React.StatelessComponent = (props) => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    {props.children}
  </div>
);
