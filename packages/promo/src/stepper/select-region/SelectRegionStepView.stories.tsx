import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import React from 'react';

import SelectRegionStepView from './SelectRegionStepView';

const typeDefs = `
  type Region {
    id: String!
    name: String!
    sku: String!
  }

  type Query {
    promoRegions: [Region]
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      promoRegions: () => [
        { id: 'r1', sku: 'region.r1', name: 'Argentina' },
        { id: 'r2', sku: 'region.r2', name: 'Bolivia' },
        { id: 'r3', sku: 'region.r3', name: 'Canada' },
        { id: 'r4', sku: 'region.r4', name: 'Galicia' },
        { id: 'r5', sku: 'region.r5', name: 'Georgia' },
        { id: 'r6', sku: 'region.r6', name: 'Norway' },
        { id: 'r7', sku: 'region.r7', name: 'Russia' },
        { id: 'r8', sku: 'region.r8', name: 'India' },
        { id: 'r9', sku: 'region.r9', name: 'Laos' },
        { id: 'r0', sku: 'region.r0', name: 'Ecuador' },
      ],
    };
  },
};

storiesOf('SelectRegionStepView', module)
  .addDecorator((story) => (
    <div style={{ width: 400 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active={true} completed={false}>
          <StepLabel>Выберите регион</StepLabel>
          {story()}
        </Step>
      </Stepper>
    </div>
  ))
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add('default', () => {
    return <SelectRegionStepView next={action('next')} prev={action('prev')} />;
  });
