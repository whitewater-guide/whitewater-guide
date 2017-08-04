export const Durations = [
  { value: 0, slug: 'laps' },
  { value: 10, slug: 'twice' },
  { value: 20, slug: 'day-run' },
  { value: 30, slug: 'overnighter' },
  { value: 40, slug: 'multi-day' },
];

export const durationToString = (durationNumeric: number) => {
  const duration = Durations.find(({ value }) => value === durationNumeric);
  return duration ? duration.slug : '';
};
