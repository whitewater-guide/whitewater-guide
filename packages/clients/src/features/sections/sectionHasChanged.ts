import { Section } from '@whitewater-guide/commons';

const maybeMeasurementTs = (s: Section) =>
  s.gauge && s.gauge.latestMeasurement && s.gauge.latestMeasurement.timestamp;

export const sectionHasChanged = (s1: Section, s2: Section) => {
  return (
    s1.id !== s2.id ||
    s1.updatedAt !== s2.updatedAt ||
    maybeMeasurementTs(s1) !== maybeMeasurementTs(s2)
  );
};
