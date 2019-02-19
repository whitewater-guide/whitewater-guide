import { BannerPlacement, BannerRatios } from '@whitewater-guide/commons';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {
  Checkbox,
  ChipInput,
  Form,
  Select,
  TextInput,
} from '../../../components/forms';
import BannerSourceFields from './BannerSourceFields';
import { BannerFormProps } from './types';

const PLACEMENTS = Object.values(BannerPlacement).map((placement) => {
  const name = upperFirst(snakeCase(placement)).replace(/_/g, ' ');
  const size = '2048x' + Math.ceil(2048 / BannerRatios.get(placement)!);
  return {
    id: placement,
    name: `${name} (${size})`,
  };
});

export default class BannerForm extends React.PureComponent<BannerFormProps> {
  render() {
    const { initialValues } = this.props;
    return (
      <Form {...this.props} resourceType="banner">
        <div
          style={{
            padding: 8,
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          <TextInput
            fullWidth={true}
            name="slug"
            title="Slug"
            disabled={!!initialValues.id}
          />
          <TextInput fullWidth={true} name="name" title="Name" />
          <TextInput
            fullWidth={true}
            name="priority"
            type="number"
            title="Priority"
          />
          <Select
            simple={true}
            name="placement"
            title="Placement"
            options={PLACEMENTS}
          />
          <BannerSourceFields
            title="Banner source"
            bucket="banners"
            height={[450, 683]}
            width={2048}
            previewScale={0.25}
            upload={this.props.bannerFileUpload}
          />
          <Checkbox name="enabled" label="Enabled" />
          <TextInput fullWidth={true} name="link" title="Link" />
          <ChipInput name="groups" title="Groups" options={this.props.groups} />
          <ChipInput
            name="regions"
            title="Regions"
            options={this.props.regions}
          />
          <TextInput fullWidth={true} name="extras" title="Extras" />
        </div>
      </Form>
    );
  }
}
