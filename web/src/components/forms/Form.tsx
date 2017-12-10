import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Styles, Themeable } from '../../styles';
import { Content } from '../Content';
import { LanguagePicker } from './LanguagePicker';
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

  render() {
    const { initialValues, resourceType, muiTheme, language, onLanguageChange } = this.props;
    const submitLabel = (initialValues && initialValues.id) ? 'Update' : 'Create';
    const headerLabel = (initialValues && initialValues.name) ?
      `${initialValues.name} settings` : `New ${resourceType}`;
    const backgroundColor = muiTheme.palette!.primary1Color;
    return (
      <Content card>
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
      </Content>
    );
  }

}

export const Form: React.ComponentType<Props> = muiThemeable()(FormBase);
