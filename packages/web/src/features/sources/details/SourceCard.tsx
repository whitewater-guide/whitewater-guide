import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import ReactMarkdown from 'markdown-react-js';
import React from 'react';
import { Route, Switch } from 'react-router';

import { NotFound } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { NavTab, NavTabs } from '../../../components/navtabs';
import { Card, CardContent, EditorFooter } from '../../../layout';
import { GaugesList } from '../../gauges/list';
import AutofillButton from './AutofillButton';
import RemoveAllGaugesButton from './RemoveAllGaugesButton';
import { SourceDetailsFragment } from './sourceDetails.generated';
import SourceDetailsMain from './SourceDetailsMain';

interface Props {
  sourceId: string;
  source: SourceDetailsFragment | null;
  path: string;
}

const SourceCard = React.memo<Props>((props) => {
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
            <Route exact path={`${path}/terms`}>
              <ReactMarkdown text={source.termsOfUse || ''} />
            </Route>

            <Route exact path={`${path}/gauges`}>
              <GaugesList source={source} />
            </Route>

            <Route>
              <SourceDetailsMain source={source} />
            </Route>
          </Switch>
        </Box>
      </CardContent>

      <Switch>
        <Route exact path={`${path}/gauges`}>
          <EditorFooter add>
            <AutofillButton sourceId={source.id} />
            <RemoveAllGaugesButton sourceId={source.id} />
          </EditorFooter>
        </Route>

        <Route>
          <EditorFooter edit />
        </Route>
      </Switch>
    </Card>
  );
});

SourceCard.displayName = 'SourceCard';

export default SourceCard;
