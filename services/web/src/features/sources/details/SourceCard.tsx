import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import { Source } from '@whitewater-guide/commons';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Route, Switch } from 'react-router';
import { NotFound } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { NavTab, NavTabs } from '../../../components/navtabs';
import { Card, CardContent, EditorFooter } from '../../../layout';
import { GaugesList } from '../../gauges/list';
import AutofillButton from './AutofillButton';
import DisableAllGaugesButton from './DisableAllGaugesButton';
import EnableButton from './EnableButton';
import GenerateScheduleButton from './GenerateScheduleButton';
import RemoveAllGaugesButton from './RemoveAllGaugesButton';
import SourceDetailsMain from './SourceDetailsMain';

interface Props {
  sourceId: string;
  source: Source | null;
  path: string;
}

const SourceCard: React.FC<Props> = React.memo((props) => {
  const { source, sourceId, path } = props;
  if (!source) {
    return (
      <Card>
        <NotFound resource="source" id={sourceId} />
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader title={source.name} action={<EditorLanguagePicker />} />
      <CardContent>
        <NavTabs variant="fullWidth">
          <NavTab label="Details" value="/main" />
          <NavTab label="Terms of use" value="/terms" />
          <NavTab label="Gauges" value="/gauges" />
        </NavTabs>

        <Box flex={1} overflow="auto">
          <Switch>
            <Route exact={true} path={`${path}/terms`}>
              <ReactMarkdown source={source.termsOfUse || ''} />
            </Route>

            <Route exact={true} path={`${path}/gauges`}>
              <GaugesList source={source} />
            </Route>

            <Route>
              <SourceDetailsMain source={source} />
            </Route>
          </Switch>
        </Box>
      </CardContent>

      <Switch>
        <Route exact={true} path={`${path}/gauges`}>
          <EditorFooter add={true}>
            <AutofillButton sourceId={source.id} variant="contained">
              Autofill
            </AutofillButton>
            <GenerateScheduleButton sourceId={source.id} />
            <EnableButton sourceId={source.id} />
            <DisableAllGaugesButton sourceId={source.id} label="Disable All" />
            <RemoveAllGaugesButton sourceId={source.id} />
          </EditorFooter>
        </Route>

        <Route>
          <EditorFooter edit={true} />
        </Route>
      </Switch>
    </Card>
  );
});

SourceCard.displayName = 'SourceCard';

export default SourceCard;
