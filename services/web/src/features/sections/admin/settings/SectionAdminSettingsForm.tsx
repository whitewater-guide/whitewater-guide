import { SectionAdminSettings } from '@whitewater-guide/commons';
import { Location } from 'history';
import { FlatButton } from 'material-ui';
import { CardActions } from 'material-ui/Card';
import React from 'react';
import Prompt from 'react-router-navigation-prompt';
import { InjectedFormProps } from 'redux-form';
import { ConfirmationDialog } from '../../../../components';
import { Checkbox } from '../../../../components/forms';
import { Styles } from '../../../../styles';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formBox: {
    flex: 1,
  },
};

type Props = InjectedFormProps<SectionAdminSettings>;

export default class SectionAdminSettingsForm extends React.PureComponent<
  Props
> {
  shouldBlockNavigation = (cur: Location, nxt?: Location) => {
    const { anyTouched } = this.props;
    return (
      anyTouched &&
      !!nxt &&
      (nxt.pathname !== cur.pathname || nxt.search !== cur.search)
    );
  };

  render() {
    return (
      <div style={styles.container}>
        <Prompt when={this.shouldBlockNavigation}>
          {({ onConfirm, onCancel }: any) => (
            <ConfirmationDialog
              invertedAccents={true}
              description="There are some unsaved changes, are sure you don't want to save them?"
              confirmTitle="Leave"
              cancelTitle="Stay"
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </Prompt>
        <div style={styles.formBox}>
          <Checkbox name="demo" label="Demo section (free in premium region)" />
        </div>
        <CardActions style={styles.footer}>
          <FlatButton label="Update" onClick={this.props.handleSubmit} />
        </CardActions>
      </div>
    );
  }
}
