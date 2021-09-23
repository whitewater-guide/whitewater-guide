import { updateList } from './updateList';

interface TestNode {
  __ref: string;
  txt: string;
}

type TestCase = [string, TestNode[], TestNode[], TestNode[]];

it.each([
  [
    'array without overlap',
    [
      { __ref: '1', txt: 'foo' },
      { __ref: '2', txt: 'oof' },
    ],
    [
      { __ref: '3', txt: 'bar' },
      { __ref: '4', txt: 'rab' },
    ],
    [
      { __ref: '1', txt: 'foo' },
      { __ref: '2', txt: 'oof' },
      { __ref: '3', txt: 'bar' },
      { __ref: '4', txt: 'rab' },
    ],
  ],
  [
    'fully overlapping arrays',
    [
      { __ref: '1', txt: 'foo' },
      { __ref: '2', txt: 'oof' },
    ],
    [
      { __ref: '1', txt: 'bar' },
      { __ref: '2', txt: 'rab' },
    ],
    [
      { __ref: '1', txt: 'bar' },
      { __ref: '2', txt: 'rab' },
    ],
  ],
  [
    'partially overlapping arrays',
    [
      { __ref: '1', txt: 'foo' },
      { __ref: '2', txt: 'oof' },
    ],
    [
      { __ref: '2', txt: 'bar' },
      { __ref: '4', txt: 'rab' },
    ],
    [
      { __ref: '1', txt: 'foo' },
      { __ref: '2', txt: 'bar' },
      { __ref: '4', txt: 'rab' },
    ],
  ],
] as TestCase[])('should be correct for %s', (_, prev, next, expected) => {
  expect(updateList(prev, next)).toEqual(expected);
});
