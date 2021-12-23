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
      { __ref: '1', txt: 'one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'three' },
    ],
    [
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'five' },
      { __ref: '6', txt: 'six' },
    ],
    [
      { __ref: '1', txt: 'one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'three' },
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'five' },
      { __ref: '6', txt: 'six' },
    ],
  ],
  [
    'fully overlapping arrays',
    [
      { __ref: '1', txt: 'one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'three' },
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'five' },
      { __ref: '6', txt: 'six' },
    ],
    [
      { __ref: '1', txt: 'twenty one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'twenty three' },
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'twenty five' },
      { __ref: '6', txt: 'six' },
    ],
    [
      { __ref: '1', txt: 'twenty one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'twenty three' },
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'twenty five' },
      { __ref: '6', txt: 'six' },
    ],
  ],
  [
    'partially overlapping arrays',
    [
      { __ref: '1', txt: 'one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'three' },
      { __ref: '4', txt: 'four' },
      { __ref: '5', txt: 'five' },
      { __ref: '6', txt: 'six' },
    ],
    [
      { __ref: '4', txt: 'twenty four' },
      { __ref: '5', txt: 'twenty five' },
      { __ref: '6', txt: 'twenty six' },
      { __ref: '7', txt: 'seven' },
      { __ref: '8', txt: 'eight' },
      { __ref: '9', txt: 'nine' },
    ],
    [
      { __ref: '1', txt: 'one' },
      { __ref: '2', txt: 'two' },
      { __ref: '3', txt: 'three' },
      { __ref: '4', txt: 'twenty four' },
      { __ref: '5', txt: 'twenty five' },
      { __ref: '6', txt: 'twenty six' },
      { __ref: '7', txt: 'seven' },
      { __ref: '8', txt: 'eight' },
      { __ref: '9', txt: 'nine' },
    ],
  ],
] as TestCase[])('should be correct for %s', (_, prev, next, expected) => {
  expect(updateList(prev, next)).toEqual(expected);
});
