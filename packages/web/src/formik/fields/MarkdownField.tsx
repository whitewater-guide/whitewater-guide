import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { MdEditorValue } from '@whitewater-guide/md-editor';
import { MdEditor } from '@whitewater-guide/md-editor';
import type { FieldInputProps } from 'formik';
import { FastField } from 'formik';
import React, { useMemo } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.common.white,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }),
);

interface Props {
  name: string;
}

const MarkdownComponent: React.FC<FieldInputProps<MdEditorValue>> = ({
  name,
  value,
  onChange,
}) => {
  const classes = useStyles();
  const toolbarProps = useMemo(
    () => ({
      className: classes.toolbar,
    }),
    [classes],
  );
  return (
    <MdEditor
      name={name}
      value={value}
      onChangeCompat={onChange}
      toolbarProps={toolbarProps}
      rememberMdSwitch
    />
  );
};

export const MarkdownField: React.FC<Props> = ({ name }) => (
  <FastField name={name} as={MarkdownComponent} />
);
