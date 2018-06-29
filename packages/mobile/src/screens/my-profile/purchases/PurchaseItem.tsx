import React from 'react';
import { translate } from 'react-i18next';
import { ListItem } from 'react-native-paper';
import { WithT } from '../../../i18n';
import { Group } from '../../../ww-commons/features/groups';
import { Region } from '../../../ww-commons/features/regions';

interface Props extends WithT {
  region?: Region;
  group?: Group;
}

const PurchaseItem: React.SFC<Props> = ({ region, group, t }) => {
  const title = region ? region.name : group.name;
  const description = region ? t('myProfile:purchases.region') : t('myProfile:purchases.group');
  return (
    <ListItem title={title} description={description} />
  );
};

export default translate()(PurchaseItem);
