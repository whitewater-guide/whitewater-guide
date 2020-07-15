import { QResult } from './descentForm.query';
import { DescentFormData } from './types';

export default (result?: QResult): DescentFormData => {
  if (!result?.logbookDescent) {
    return {
      section: {
        region: 'Foo',
        difficulty: 3,
        river: 'Bar',
        section: 'Baz',
      },
      startedAt: new Date(),
    };
  }
  return {
    ...result.logbookDescent,
    startedAt: new Date(result?.logbookDescent?.startedAt),
    level: result.logbookDescent.level?.value
      ? {
          value: result.logbookDescent.level.value,
          unit: result.logbookDescent.level.unit,
        }
      : undefined,
  };
};
