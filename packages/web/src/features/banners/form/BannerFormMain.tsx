import Box from '@material-ui/core/Box';
import {
  BannerPlacement,
  BannerRatios,
  NamedNode,
} from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperCase';
import React from 'react';
import useRouter from 'use-react-router';

import {
  CheckboxField,
  MulticompleteField,
  NumberField,
  SelectField,
  SelectFieldPresets,
  TextField,
} from '../../../formik/fields';
import { BannerSourceFields } from './source';
import { RouterParams } from './types';

const PLACEMENTS = Object.values(BannerPlacement).map((placement) => {
  const name = upperFirst(snakeCase(placement)).replace(/_/g, ' ');
  const size = '2048x' + Math.ceil(2048 / BannerRatios.get(placement)!);
  return {
    id: placement,
    name: `${name} (${size})`,
  };
});

interface Props {
  regions: NamedNode[];
  groups: NamedNode[];
}

export const BannerFormMain: React.FC<Props> = React.memo((props) => {
  const { errors, values } = useFormikContext();
  const { match } = useRouter<RouterParams>();
  return (
    <Box padding={1} overflow="auto">
      <TextField
        fullWidth={true}
        name="slug"
        label="Slug"
        placeholder="Slug"
        disabled={!!match.params.bannerId}
      />
      <TextField fullWidth={true} name="name" label="Name" placeholder="Name" />
      <NumberField
        fullWidth={true}
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
      <TextField fullWidth={true} name="link" label="Link" />
      <MulticompleteField
        name="groups"
        label="Groups"
        options={props.groups}
        fullWidth={true}
      />
      <MulticompleteField
        name="regions"
        label="Regions"
        options={props.regions}
        fullWidth={true}
      />
      <TextField
        fullWidth={true}
        name="extras"
        label="Extras"
        placeholder="Extras"
      />
    </Box>
  );
});

BannerFormMain.displayName = 'BannerFormMain';
