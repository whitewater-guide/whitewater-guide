import serializeSection from './serializeSection';

const formData = {
  kayakingTags: [{ id: 'waterfalls', name: 'Waterfalls' }],
  hazardsTags: [{ id: 'undercuts', name: 'Undercuts' }],
  supplyTags: [],
  miscTags: [],
};

it('should merge tags', () => {
  const result = serializeSection(formData);
  expect(result).not.toHaveProperty('kayakingTags');
  expect(result)
    .toHaveProperty('tags', [{ id: 'waterfalls' }, { id: 'undercuts' }]);
});
