import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useRegionQuery } from '@whitewater-guide/clients';
import React from 'react';

import { EditorLanguagePicker } from '../../../components/language';
import { HashTab, HashTabs, HashTabView } from '../../../components/navtabs';
import { Card } from '../../../layout';
import RegionBulkInsert from './bulk';
import RegionEditors from './editors';
import RegionGroups from './groups';
import { RegionAdminSettingsForm } from './settings';

const RegionAdmin: React.FC = () => {
  const { data, loading } = useRegionQuery();
  const region = data?.region;
  if (!region && !loading) {
    return null;
  }
  return (
    <Card loading={loading}>
      <CardHeader title={region!.name} action={<EditorLanguagePicker />} />
      <CardContent>
        <Box
          width={1}
          height={1}
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <HashTabs variant="fullWidth">
            <HashTab label="Main" value="#main" />
            <HashTab label="Editors" value="#editors" />
            <HashTab label="Groups" value="#groups" />
            <HashTab label="Import" value="#import" />
          </HashTabs>

          <HashTabView value="#main">
            <RegionAdminSettingsForm regionId={region!.id} />
          </HashTabView>
          <HashTabView value="#editors">
            <RegionEditors regionId={region!.id} />
          </HashTabView>
          <HashTabView value="#groups">
            <RegionGroups regionId={region!.id} />
          </HashTabView>
          <HashTabView value="#import">
            <RegionBulkInsert regionId={region!.id} />
          </HashTabView>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegionAdmin;
