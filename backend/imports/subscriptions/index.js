import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { WebApp } from 'meteor/webapp';

export const pubsub = new PubSub();

export function initSubscriptions(schema) {
  const subscriptionManager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {
      measurementsUpdated: (options, { regionId, sectionId }) => ({
        measurementsUpdated: {
          filter: sections => sections.some( section => section.regionId === regionId && (!sectionId || section._id === sectionId)),
        },
      }),
    },
  });

  const subscriptionsServer = new SubscriptionServer(
    {
      subscriptionManager,
    },
    {
      server: WebApp.httpServer,
      path: '/subscriptions',
    },
  );
}
