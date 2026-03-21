import type { Context } from '../../apollo/index';

/* eslint-disable @typescript-eslint/no-var-requires */
export function createConnectors(context: Context) {
  // Dynamically load modules to avoid cyclic dependency
  // when migratiing to esm, this can be replaced with module-level imports
  // to avoid circular dependencies, barrels exports have to be avoided in ESM for connectors
  const { BannersConnector } = require('../../features/banners/index');
  const { DescentsConnector } = require('../../features/descents/index');
  const { GaugesConnector } = require('../../features/gauges/index');
  const { GorgeConnector } = require('../../features/gorge/index');
  const { GroupsConnector } = require('../../features/groups/index');
  const { MediaConnector } = require('../../features/media/index');
  const { PurchasesConnector } = require('../../features/purchases/index');
  const { RegionsConnector } = require('../../features/regions/index');
  const { RiversConnector } = require('../../features/rivers/index');
  const { SectionsConnector } = require('../../features/sections/index');
  const { SourcesConnector } = require('../../features/sources/index');
  const { TagsConnector } = require('../../features/tags/index');
  const { SuggestionsConnector } = require('../../features/suggestions/index');
  const { UsersConnector } = require('../../features/users/index');
  return {
    banners: new BannersConnector(context),
    descents: new DescentsConnector(context),
    gauges: new GaugesConnector(context),
    gorge: new GorgeConnector(context),
    groups: new GroupsConnector(context),
    media: new MediaConnector(context),
    purchases: new PurchasesConnector(context),
    regions: new RegionsConnector(context),
    rivers: new RiversConnector(context),
    sections: new SectionsConnector(context),
    sources: new SourcesConnector(context),
    suggestions: new SuggestionsConnector(context),
    tags: new TagsConnector(context),
    users: new UsersConnector(context),
  };
}
