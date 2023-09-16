import Box from '@material-ui/core/Box';
import { BannerRatios } from '@whitewater-guide/clients';
import type { NamedNode } from '@whitewater-guide/schema';
import { BannerPlacement } from '@whitewater-guide/schema';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperCase';
import React from 'react';
import { useRouteMatch } from 'react-router';

import {
  CheckboxField,
  MulticompleteField,
  NumberField,
  SelectField,
  SelectFieldPresets,
  TextField,
} from '../../../formik/fields';
import { BannerSourceFields } from './source';
import type { RouterParams } from './types';

const PLACEMENTS = Object.values(BannerPlacement).map((placement) => {
  const name = upperFirst(snakeCase(placement)).replace(/_/g, ' ');
  const size = `2048x${Math.ceil(2048 / BannerRatios[placement])}`;
  return {
    id: placement,
    name: `${name} (${size})`,
  };
});

interface Props {
  regions?: NamedNode[];
  groups?: NamedNode[];
}

export const BannerFormMain = React.memo<Props>((props) => {
  const { regions = [], groups = [] } = props;
  const match = useRouteMatch<RouterParams>();
  return (
    <Box padding={1} overflow="auto">
      <TextField
        fullWidth
        name="slug"
        label="Slug"
        placeholder="Slug"
        disabled={!!match.params.bannerId}
      />
      <TextField fullWidth name="name" label="Name" placeholder="Name" />
      <NumberField
        fullWidth
        name="priority"
        type="number"
        label="Priority"
        placeholder="Priority"
      />
      <SelectField
        {...SelectFieldPresets.NamedNodeId}
        name="placement"
        label="Placement"
        placeholder="Placement"
        options={PLACEMENTS}
      />
      <BannerSourceFields
        title="Banner source"
        height={[450, 683]}
        width={2048}
        previewScale={0.25}
      />
      <CheckboxField name="enabled" label="Enabled" />
      <TextField fullWidth name="link" label="Link" />
      <MulticompleteField
        name="groups"
        label="Groups"
        options={groups}
        fullWidth
      />
      <MulticompleteField
        name="regions"
        label="Regions"
        options={regions}
        fullWidth
      />
      <TextField fullWidth name="extras" label="Extras" placeholder="Extras" />
    </Box>
  );
});

BannerFormMain.displayName = 'BannerFormMain';
