import Paper from '@material-ui/core/Paper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { NamedNode } from '../../ww-commons';
import NoRegions from './NoRegions';
import RegionSelector from './RegionSelector';

const regions: NamedNode[] = [
  { id: 'r1', name: 'Argentina' },
  { id: 'r2', name: 'Bolivia' },
  { id: 'r3', name: 'Canada' },
  { id: 'r4', name: 'Galicia' },
  { id: 'r5', name: 'Georgia' },
  { id: 'r6', name: 'Norway' },
  { id: 'r7', name: 'Russia' },
  { id: 'r8', name: 'India' },
  { id: 'r9', name: 'Laos' },
  { id: 'r0', name: 'Ecuador' },
];

storiesOf('RegionSelector', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      <Paper style={{ padding: 8 }}>
        {story()}
      </Paper>
    </div>
  ))
  .add('default', () => {
    return (
      <RegionSelector
        regions={regions}
        value={null}
        onChange={action('onChange')}
      />
    );
  })
  .add('with selection', () => {
    return (
      <RegionSelector
        regions={regions}
        value={regions[3]}
        onChange={action('onChange')}
      />
    );
  });
