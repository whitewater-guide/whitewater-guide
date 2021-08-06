import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { TabProps } from '@material-ui/core/Tab';
import { useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import React, { useMemo } from 'react';

import { HashTab } from '../../components/navtabs';

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      flexDirection: 'row',
      '& span': {
        marginRight: 8,
        marginBottom: '0px !important',
        fontSize: '1.2em',
      },
    },
    labelIcon: {
      color: theme.palette.error.main,
      minHeight: 0,
    },
  }),
);

interface Props extends TabProps {
  value: string;
  fields: Array<string | number | symbol>;
}

export const FormikTab = React.memo<Props>((props) => {
  const { fields, ...tabProps } = props;
  const { errors } = useFormikContext();
  const hasErrors = useMemo(
    () =>
      Object.entries(errors).some(
        ([key, value]) => fields.includes(key) && !isEmpty(value),
      ),
    [errors, fields],
  );
  const classes = useStyles(hasErrors);
  const icon = hasErrors ? <Icon>warning</Icon> : undefined;
  return <HashTab {...tabProps} icon={icon} classes={classes} />;
});

FormikTab.displayName = 'FormikTab';
