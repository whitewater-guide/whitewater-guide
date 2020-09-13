import Typography from '@material-ui/core/Typography';
import { Tag } from '@whitewater-guide/commons';
import { useField } from 'formik';
import React from 'react';

import { TagSelector } from '../../components/tag-selector';
import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  options: Tag[];
  label?: string;
}

export const TagsField: React.FC<Props> = React.memo((props) => {
  const { name, label, options } = props;
  const [{ value }] = useField<any>(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <FormikFormControl name={name} fullWidth={true}>
      <Typography variant="overline" display="block" gutterBottom={true}>
        {label}
      </Typography>
      <div>
        <TagSelector options={options} value={value} onChange={onChange} />
      </div>
    </FormikFormControl>
  );
});

TagsField.displayName = 'TagsField';
