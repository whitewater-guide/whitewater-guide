export function createConnectors() {
  // Dynamically load modules to avoid cyclic dependency
  const { BannersConnector } = require('@features/banners');
  const { GaugesConnector } = require('@features/gauges');
  const { GroupsConnector } = require('@features/groups');
  const { MeasurementsConnector } = require('@features/measurements');
  const { MediaConnector } = require('@features/media');
  const { PurchasesConnector } = require('@features/purchases');
  const { RegionsConnector } = require('@features/regions');
  const { RiversConnector } = require('@features/rivers');
  const { SectionsConnector } = require('@features/sections');
  const { SourcesConnector } = require('@features/sources');
  const { TagsConnector } = require('@features/tags');
  const {
    SuggestionsConnector,
    SuggestedSectionsConnector,
  } = require('@features/suggestions');
  const { UsersConnector } = require('@features/users');
  return {
    banners: new BannersConnector(),
    gauges: new GaugesConnector(),
    groups: new GroupsConnector(),
    measurements: new MeasurementsConnector(),
    media: new MediaConnector(),
    purchases: new PurchasesConnector(),
    regions: new RegionsConnector(),
    rivers: new RiversConnector(),
    sections: new SectionsConnector(),
    sources: new SourcesConnector(),
    suggestions: new SuggestionsConnector(),
    suggestedSections: new SuggestedSectionsConnector(),
    tags: new TagsConnector(),
    users: new UsersConnector(),
  };
}
