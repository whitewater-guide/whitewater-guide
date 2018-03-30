import { TabProps } from 'material-ui';
import FontIcon from 'material-ui/FontIcon';
import { red500 } from 'material-ui/styles/colors';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { connect } from 'react-redux';
import { FormErrors, getFormSyncErrors } from 'redux-form';
import { RootState } from '../../redux';
import { Styles } from '../../styles';

const styles: Styles = {
  span: {
    verticalAlign: 'center',
    color: red500,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
};

interface Props extends TabProps {
  form: string;
  fields: string[];
}

interface FakeMui {
  muiName?: string;
}

interface WithSyncErrors {
  syncErrors: FormErrors;
}

const FormTabView: React.StatelessComponent<Props & WithSyncErrors> = (props) => {
  const { form, label, fields, syncErrors, children, ...rest } = props;
  const hasErrors = Object.keys(syncErrors || {}).some(key => fields.includes(key));
  const lbl = hasErrors ?
    (
      <span style={styles.span}>
        <FontIcon className="material-icons" color={red500} style={styles.icon}>
          warning
        </FontIcon>
        {label}
      </span>
    ) :
    label;
  return (
    <Tab label={lbl} {...rest}>
      {children}
    </Tab>
  );
};

const container = connect(
  (state: RootState, props: Props) => {
    const selector = getFormSyncErrors(props.form);
    const syncErrors = selector(state);
    return { syncErrors };
  },
);

export const FormTab: React.ComponentType<Props> & FakeMui = container(FormTabView);
FormTab.muiName = 'Tab';
