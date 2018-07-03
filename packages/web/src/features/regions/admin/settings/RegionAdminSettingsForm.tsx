import { Location } from 'history';
import { FlatButton } from 'material-ui';
import { CardActions } from 'material-ui/Card';
import React from 'react';
import { ChildProps } from 'react-apollo';
import Prompt from 'react-router-navigation-prompt';
import { InjectedFormProps } from 'redux-form';
import { ConfirmationDialog } from '../../../../components';
import { Checkbox, ImageUploadField, TextInput } from '../../../../components/forms';
import { Styles } from '../../../../styles';
import { RegionAdminSettings } from '../../../../ww-commons';
import { Result } from './regionAdmin.query';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formBox: {
    flex: 1,
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
};

type Props = InjectedFormProps<RegionAdminSettings> & ChildProps<{}, Result>;

export default class RegionAdminSettingsForm extends React.PureComponent<Props> {

  shouldBlockNavigation = (cur: Location, nxt: Location) => {
    const { anyTouched } = this.props;
    return anyTouched && (nxt.pathname !== cur.pathname || nxt.search !== cur.search);
  };

  render() {
    const upload = this.props.data!.regionMediaForm!.upload;
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
          <ImageUploadField
            title="Cover image for mobile (2048x682)"
            name="coverImage.mobile"
            bucket="covers"
            width={2048}
            height={682}
            previewScale={0.2}
            upload={upload}
          />
          <ImageUploadField
            title="Banner in region description (2048x682)"
            name="banners.regionDescriptionMobile"
            bucket="banners"
            width={2048}
            height={682}
            previewScale={0.2}
            upload={upload}
          />
          <ImageUploadField
            title="Region loading banner (2048x512 - 2048x1536)"
            name="banners.regionLoadingMobile"
            bucket="banners"
            width={2048}
            height={[536, 1512]}
            previewScale={0.2}
            upload={upload}
          />
          <ImageUploadField
            title="Section row banner (2048x460)"
            name="banners.sectionRowMobile"
            bucket="banners"
            width={2048}
            height={460}
            previewScale={0.2}
            upload={upload}
          />
          <ImageUploadField
            title="Section media banner (2048x682)"
            name="banners.sectionMediaMobile"
            bucket="banners"
            width={2048}
            height={682}
            previewScale={0.2}
            upload={upload}
          />
        </div>
        <CardActions style={styles.footer}>
          <FlatButton label="Update" onClick={this.props.handleSubmit} />
        </CardActions>
      </div>
    );
  }

}
