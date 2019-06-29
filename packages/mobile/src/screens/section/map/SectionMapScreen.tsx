import { getSectionContentBounds, useSection } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { MapLayout } from '../../../components/map';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

export const SectionMapScreen: NavigationScreenComponent = () => {
  const section = useSection();
  const initialBounds = useMemo(() => getSectionContentBounds(section.node), [
    section,
  ]);
  const pois = useMemo(() => {
    if (!section.node) {
      return [];
    }

    const result = [...section.node.pois];
    const gauge = section.node.gauge && section.node.gauge.location;
    if (gauge) {
      const gaugePt = { ...gauge, name: `Gauge ${gauge.name}` };
      result.push(gaugePt);
    }
    return result;
  }, [section]);
  return (
    <Screen noScroll={true}>
      {section.node && (
        <MapLayout
          sections={[section.node]}
          initialBounds={initialBounds!}
          pois={pois}
          detailed={true}
        />
      )}
    </Screen>
  );
};

SectionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:map.title</I18nText>,
  tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
};
