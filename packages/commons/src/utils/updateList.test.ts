import { updateList } from './updateList';

it.each([
  [
    'array without overlap',
    [{ id: 1, txt: 'foo' }, { id: 2, txt: 'oof' }],
    [{ id: 3, txt: 'bar' }, { id: 4, txt: 'rab' }],
    [
      { id: 1, txt: 'foo' },
      { id: 2, txt: 'oof' },
      { id: 3, txt: 'bar' },
      { id: 4, txt: 'rab' },
    ],
  ],
  [
    'fully overlapping arrays',
    [{ id: 1, txt: 'foo' }, { id: 2, txt: 'oof' }],
    [{ id: 1, txt: 'bar' }, { id: 2, txt: 'rab' }],
    [{ id: 1, txt: 'bar' }, { id: 2, txt: 'rab' }],
  ],
  [
    'partially overlapping arrays',
    [{ id: 1, txt: 'foo' }, { id: 2, txt: 'oof' }],
    [{ id: 2, txt: 'bar' }, { id: 4, txt: 'rab' }],
    [{ id: 1, txt: 'foo' }, { id: 2, txt: 'bar' }, { id: 4, txt: 'rab' }],
  ],
])('should be correct for %s', (_, prev, next, expected) => {
  expect(updateList(prev, next)).toEqual(expected);
});
