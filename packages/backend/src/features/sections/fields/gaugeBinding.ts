import { FieldResolvers } from '../../../apollo';
import { GaugeBinding } from '../../../ww-commons';

// Stored as JSONb in postgres
interface GaugeBindingRaw {
  minimum: number | null | undefined;
  optimum: number | null | undefined;
  maximum: number | null | undefined;
  impossible: number | null | undefined;
  approximate: boolean | null | undefined;
}

export const gaugeBindingResolver: FieldResolvers<GaugeBindingRaw, GaugeBinding> = {
  minimum: ({ minimum }) => minimum || null,
  optimum: ({ optimum }) => optimum || null,
  maximum: ({ maximum }) => maximum || null,
  impossible: ({ impossible }) => impossible || null,
  approximate: ({ approximate }) => !!approximate,
};
