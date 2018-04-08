import { Location } from 'history';
import { FlatButton } from 'material-ui';
import { CardActions } from 'material-ui/Card';
import React from 'react';
import Prompt from 'react-router-navigation-prompt';
import { InjectedFormProps } from 'redux-form';
import { ConfirmationDialog } from '../../../../components';
import { Checkbox, TextInput } from '../../../../components/forms';
import { Styles } from '../../../../styles';
import { RegionAdminSettings } from '../../../../ww-commons';

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

type Props = InjectedFormProps<RegionAdminSettings>;

export default class RegionAdminSettingsForm extends React.PureComponent<Props> {

  shouldBlockNavigation = (cur: Location, nxt: Location) => {
    const { anyTouched } = this.props;
    return anyTouched && (nxt.pathname !== cur.pathname || nxt.search !== cur.search);
  };

  render() {
    return (
      <div style={styles.container}>
        <Prompt when={this.shouldBlockNavigation}>
          {({ onConfirm, onCancel }: any) => (
            <ConfirmationDialog
              invertedAccents
              description="There are some unsaved changes, are sure you don't want to save them?"
              confirmTitle="Leave"
              cancelTitle="Stay"
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </Prompt>
        <div style={styles.formBox}>
          <Checkbox name="hidden" label="Hidden" />
          <Checkbox name="premium" label="Premium" />
          <TextInput name="sku" title="SKU" />
        </div>
        <CardActions style={styles.footer}>
          <FlatButton label="Update" onClick={this.props.handleSubmit} />
        </CardActions>
      </div>
    );
  }

}
