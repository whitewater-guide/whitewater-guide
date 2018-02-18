import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Location } from 'history';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import Prompt from 'react-router-navigation-prompt';
import { InjectedFormProps } from 'redux-form';
import { Styles, Themeable } from '../../styles';
import { Content } from '../Content';
import { LanguagePicker } from './LanguagePicker';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import { WithLanguage } from './withLanguage';

const styles: Styles = {
  header: {
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
};

interface FormProps {
  resourceType: string;
}

type Props = FormProps & InjectedFormProps<any>;
type InnerProps = Props & Themeable & WithLanguage;

class FormBase extends React.PureComponent<InnerProps> {

  shouldBlockNavigation = (cur: Location, nxt: Location) => {
    const { anyTouched } = this.props;
    // Until this is resolved, ignore search string:
    // https://github.com/ZacharyRSmith/react-router-navigation-prompt/issues/20
    // return anyTouched && (nxt.pathname !== cur.pathname || nxt.search !== cur.search);
    return anyTouched && (nxt.pathname !== cur.pathname);
  };

  renderSnackbar = () => {
    const { error = '' } = this.props;
    const [short = '', full = ''] = error.split('\n\n');
    const action = (
      <CopyToClipboard text={full}>
        <span>copy</span>
      </CopyToClipboard>
    );
    return (
      <Snackbar action={action} open={!!error} message={short} autoHideDuration={7000} />
    );
  };

  render() {
    const { initialValues, resourceType, muiTheme, language, onLanguageChange, anyTouched } = this.props;
    const submitLabel = (initialValues && initialValues.id) ? 'Update' : 'Create';
    const headerLabel = (initialValues && initialValues.name) ?
      `${initialValues.name} settings` : `New ${resourceType}`;
    const backgroundColor = muiTheme.palette!.primary1Color;
    return (
      <Content card>
        <Prompt when={this.shouldBlockNavigation}>
          {({ onConfirm, onCancel }: any) => (
            <UnsavedChangesDialog onCancel={onCancel} onConfirm={onConfirm}/>
          )}
        </Prompt>
        <CardHeader title={headerLabel} titleStyle={styles.title} style={{ ...styles.header, backgroundColor }}>
          <LanguagePicker language={language} onLanguageChange={onLanguageChange} />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
            {this.props.children}
          </div>
        </CardMedia>
        <CardActions>
          <FlatButton label={submitLabel} onClick={this.props.handleSubmit} />
        </CardActions>
        {this.renderSnackbar()}
      </Content>
    );
  }

}

export const Form: React.ComponentType<Props> = muiThemeable()(FormBase);
