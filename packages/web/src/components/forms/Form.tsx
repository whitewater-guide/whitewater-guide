import { Location } from 'history';
import { CardActions, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import Prompt from 'react-router-navigation-prompt';
import { InjectedFormProps } from 'redux-form';
import { CardHeader } from '../../layout';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Content } from '../Content';
import { EditorLanguagePicker } from '../language';

interface FormProps {
  resourceType: string;
}

type Props = FormProps & InjectedFormProps<any>;

export class Form extends React.PureComponent<Props> {

  shouldBlockNavigation = (cur: Location, nxt: Location) => {
    const { anyTouched } = this.props;
    // I think this is resolved now, but let this comment hang here for a while
    // https://github.com/ZacharyRSmith/react-router-navigation-prompt/issues/20
    // return anyTouched && (nxt.pathname !== cur.pathname);
    return anyTouched && (nxt.pathname !== cur.pathname || nxt.search !== cur.search);
  };

  render() {
    const { initialValues, resourceType } = this.props;
    const submitLabel = (initialValues && initialValues.id) ? 'Update' : 'Create';
    const headerLabel = (initialValues && initialValues.name) ?
      `${initialValues.name} settings` : `New ${resourceType}`;
    return (
      <Content card>
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
        <CardHeader title={headerLabel}>
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
            {this.props.children}
          </div>
        </CardMedia>
        <CardActions>
          <FlatButton label={submitLabel} onClick={this.props.handleSubmit} />
        </CardActions>
      </Content>
    );
  }

}
