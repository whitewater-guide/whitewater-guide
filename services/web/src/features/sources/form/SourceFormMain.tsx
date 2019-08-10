import { NamedNode, Script } from '@whitewater-guide/commons';
import React from 'react';
import {
  MulticompleteField,
  SelectField,
  SelectFieldPresets,
  TextField,
} from '../../../formik/fields';

interface Props {
  scripts: Script[];
  regions: NamedNode[];
}

const SourceFormMain: React.FC<Props> = React.memo((props) => {
  const { scripts, regions } = props;
  return (
    <React.Fragment>
      <TextField fullWidth={true} name="name" label="Name" placeholder="Name" />
      <MulticompleteField
        name="regions"
        fullWidth={true}
        options={regions}
        label="Regions"
        placeholder="Regions"
      />
      <SelectField
        {...SelectFieldPresets.NamedNode}
        fullWidth={true}
        options={scripts}
        name="script"
        title="Script"
        placeholder="Script"
      />
      <TextField fullWidth={true} name="url" label="URL" placeholder="URL" />
      <TextField
        fullWidth={true}
        name="requestParams"
        label="Request params"
        placeholder="Request params"
      />
      <TextField fullWidth={true} name="cron" label="Cron" placeholder="Cron" />
    </React.Fragment>
  );
});

SourceFormMain.displayName = 'SourceFormMain';

export default SourceFormMain;
