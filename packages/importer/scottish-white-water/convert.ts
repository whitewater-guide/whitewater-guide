import { parseDifficultyString, SectionInput } from '@whitewater-guide/commons';
import { DeepPartial } from 'utility-types';

interface Entry {
  sectionNumber: string;
  riverName: string;
  sectionName: string;
  grade: string;
  length: string;
  startLongitude: string;
  startLatitude: string;
  finishLongitude: string;
  finishLatitude: string;
  riverEntryText: string;
  sepaGaugeLocationCode: string;
  gaugeScrapeValue: string;
  gaugeLowValue: string;
  gaugeMediumValue: string;
  gaugeHighValue: string;
  gaugeVHighValue: string;
  gaugeHugeValue: string;
}

const romanMap = [
  ['5', 'V'],
  ['4', 'IV'],
  ['3', 'III'],
  ['2', 'II'],
  ['1', 'I'],
];

export default (input: Entry): DeepPartial<SectionInput> => {
  let difficultyXtra = input.grade.includes('(')
    ? input.grade.split('(').pop()?.replace(')', '')
    : undefined;
  if (difficultyXtra) {
    romanMap.forEach(([a, r]) => {
      difficultyXtra = difficultyXtra?.replace(a, r);
    });
  }
  let distance = parseFloat(input.length.replace('km', ''));
  if (distance === 0) {
    distance = 0.01;
  }
  const gauge = input.sepaGaugeLocationCode
    ? { id: `sepa:${input.sepaGaugeLocationCode}` }
    : undefined;
  return {
    name: `${input.sectionName} [IMPORTED]`,
    river: {
      name: input.riverName,
    },
    gauge,
    levels: {
      minimum: parseFloat(input.gaugeLowValue),
      optimum: parseFloat(input.gaugeMediumValue),
      maximum: parseFloat(input.gaugeHighValue),
      impossible: parseFloat(input.gaugeHugeValue),
    },
    difficulty: parseDifficultyString(input.grade),
    difficultyXtra,
    distance,
    shape: [
      [parseFloat(input.startLatitude), parseFloat(input.startLongitude)],
      [parseFloat(input.finishLatitude), parseFloat(input.finishLongitude)],
    ],
    description: input.riverEntryText.replace('##Credits', '## Credits'),
    importId: `sww_${input.sectionNumber}`,
  };
};
