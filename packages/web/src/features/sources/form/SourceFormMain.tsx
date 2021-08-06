import { NamedNode, Script } from '@whitewater-guide/schema';
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

const SourceFormMain = React.memo<Props>((props) => {
  const { scripts, regions } = props;
  return (
    <>
      <TextField fullWidth name="name" label="Name" placeholder="Name" />
      <MulticompleteField
        name="regions"
        fullWidth
        options={regions}
        label="Regions"
        placeholder="Regions"
      />
      <SelectField
        {...SelectFieldPresets.NamedNode}
        fullWidth
        options={scripts}
        name="script"
        title="Script"
        placeholder="Script"
      />
      <TextField fullWidth name="url" label="URL" placeholder="URL" />
      <TextField
        fullWidth
        name="requestParams"
        label="Request params"
        placeholder="Request params"
      />
      <TextField fullWidth name="cron" label="Cron" placeholder="Cron" />
    </>
  );
});

SourceFormMain.displayName = 'SourceFormMain';

export default SourceFormMain;
