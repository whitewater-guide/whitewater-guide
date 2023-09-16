import Typography from '@material-ui/core/Typography';
import type { Tag } from '@whitewater-guide/schema';
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

export const TagsField = React.memo<Props>((props) => {
  const { name, label, options } = props;
  const [{ value }] = useField<Tag[]>(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <FormikFormControl name={name} fullWidth>
      <Typography variant="overline" display="block" gutterBottom>
        {label}
      </Typography>
      <div>
        <TagSelector options={options} value={value} onChange={onChange} />
      </div>
    </FormikFormControl>
  );
});

TagsField.displayName = 'TagsField';
