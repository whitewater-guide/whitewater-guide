import { upperFirst } from 'lodash';
import { CardHeader, CardMedia } from 'material-ui/Card';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { Content, Table, TableProps } from '../../components';
import { LanguagePicker, WithLanguage } from '../../components/forms';
import { Styles, Themeable } from '../../styles';
import { NamedNode } from '../../ww-commons';
import ListAdminFooter from './ListAdminFooter';

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

type OuterProps<TResource extends NamedNode> = TableProps<TResource> & Partial<WithLanguage>;

type InnerProps<TResource extends NamedNode> = Themeable & OuterProps<TResource>;

class ResourcesListCardInner<DeleteHandle extends string, TResource extends NamedNode> extends
  React.PureComponent<InnerProps<TResource>> {

  table = ({ width, height }: Dimensions) => {
    const CustomTable = Table as new () => Table<DeleteHandle, TResource>;
    return (
      <CustomTable
        {...this.props}
        width={width}
        height={height}
      >
        {this.props.children}
      </CustomTable>
    );
  };

  render() {
    const { resourceType, list, muiTheme, language, onLanguageChange } = this.props;
    const backgroundColor = muiTheme.palette!.primary1Color;
    return (
      <Content card>
        <CardHeader
          title={`${upperFirst(resourceType)}s list`}
          titleStyle={styles.title}
          style={{ ...styles.header, backgroundColor }}
        >
          {
            onLanguageChange &&
            <LanguagePicker language={language!} onLanguageChange={onLanguageChange} />
          }
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <AutoSizer rowCount={list ? list.length : 0}>
            {this.table}
          </AutoSizer>
        </CardMedia>
        <ListAdminFooter />
      </Content>
    );
  }
}

export const ResourcesListCard: React.ComponentType<OuterProps<any>> = muiThemeable()(ResourcesListCardInner);
