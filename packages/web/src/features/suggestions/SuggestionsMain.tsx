import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useAuth } from '@whitewater-guide/clients';
import React from 'react';

import { HashTab, HashTabs, HashTabView } from '../../components/navtabs';
import { Card } from '../../layout';
import { SuggesedSections } from './sections';
import { SimpleSuggestions } from './simple';

const SuggestionsMain: React.FC = () => {
  const { loading } = useAuth();
  return (
    <Card loading={loading}>
      <CardHeader title="User suggestions" />
      <CardContent>
        <Box
          width={1}
          height={1}
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <HashTabs>
            <HashTab label="Suggestions" value="#main" />
            <HashTab label="Sections" value="#sections" />
          </HashTabs>

          <HashTabView value="#main" lazy padding={0}>
            <SimpleSuggestions />
          </HashTabView>

          <HashTabView value="#sections" lazy padding={0}>
            <SuggesedSections />
          </HashTabView>
        </Box>
      </CardContent>
    </Card>
  );
};

SuggestionsMain.displayName = 'SuggestionsMain';

export default SuggestionsMain;
