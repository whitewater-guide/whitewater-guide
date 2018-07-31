import { ContextUser } from '@apollo';

export function createModels(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
  // Dynamically load modules to avoid cyclic dependency
  const { GaugesConnector } = require('@features/gauges');
  const { GroupsConnector } = require('@features/groups');
  const { SourcesConnector } = require('@features/sources');
  const { MediaConnector } = require('@features/media');
  const { RegionsConnector } = require('@features/regions');
  const { RiversConnector } = require('@features/rivers');
  const { SectionsConnector } = require('@features/sections');
  const { TagsConnector } = require('@features/tags');
  return {
    gauges: new GaugesConnector(user, language, fieldsByType),
    groups: new GroupsConnector(user, language, fieldsByType),
    media: new MediaConnector(user, language, fieldsByType),
    sources: new SourcesConnector(user, language, fieldsByType),
    regions: new RegionsConnector(user, language, fieldsByType),
    rivers: new RiversConnector(user, language, fieldsByType),
    sections: new SectionsConnector(user, language, fieldsByType),
    tags: new TagsConnector(user, language, fieldsByType),
  };
}
