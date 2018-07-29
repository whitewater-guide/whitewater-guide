import { ContextUser } from '@apollo';

export function createModels(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
  // Dynamically load modules to avoid cyclic dependency
  const { Gauges } = require('@features/gauges');
  const { Groups } = require('@features/groups');
  const { Sources } = require('@features/sources');
  const { MediaConnector } = require('@features/media');
  const { RegionsConnector } = require('@features/regions');
  const { RiversConnector } = require('@features/rivers');
  const { SectionsConnector } = require('@features/sections');
  return {
    gauges: new Gauges(user, language, fieldsByType),
    groups: new Groups(user, language, fieldsByType),
    media: new MediaConnector(user, language, fieldsByType),
    sources: new Sources(user, language, fieldsByType),
    regions: new RegionsConnector(user, language, fieldsByType),
    rivers: new RiversConnector(user, language, fieldsByType),
    sections: new SectionsConnector(user, language, fieldsByType),
  };
}
