import {
  decodeContentURL,
  getProcessingOpts,
  stringifyProcessingOpts,
} from './imgproxy';

jest.unmock('./imgproxy');

describe('stringifyProcessingOpts', () => {
  it('should correctly concat', () => {
    expect(
      stringifyProcessingOpts({
        preset: 'sharp',
        rs: ['fill', 300, 400, 0],
        g: 'sm',
      }),
    ).toBe('preset:sharp/rs:fill:300:400:0/g:sm');
  });

  it('should skip undefined', () => {
    expect(
      stringifyProcessingOpts({
        height: undefined,
        width: 100,
        g: 'sm',
      }),
    ).toBe('width:100/g:sm');
  });
});

describe('getProcessingOpts', () => {
  it('should return null for unspecified size', () => {
    expect(getProcessingOpts()).toBeNull();
  });

  it('should return exact size for whitelisted size', () => {
    expect(
      getProcessingOpts(180, undefined, 50, [
        { width: 180, height: 180 },
        { width: 180 },
      ]),
    ).toEqual({ w: 180 });
  });

  it('should round width up if step is number and height is not specified', () => {
    expect(getProcessingOpts(180, undefined, 50)).toEqual({ w: 200 });
  });

  it('should round height up if step is number and width is not specified', () => {
    expect(getProcessingOpts(undefined, 180, 100)).toEqual({ h: 200 });
  });

  it('should use default step value when not given', () => {
    expect(getProcessingOpts(undefined, 120)).toEqual({ h: 150 });
  });

  it('should round both dims and crop if step is number and both dims specified', () => {
    expect(getProcessingOpts(180, 100, 50)).toEqual({
      rs: ['fill', 200, 112],
      g: 'sm',
    });
  });

  it('should throw if steps are sorted ascending', () => {
    expect(() => getProcessingOpts(100, 100, [100, 200])).toThrow();
  });

  it.each([
    [360, 200],
    [1024, 1000],
    [1920, 2048],
  ])(
    'should select closest step up (%i) for width %i and ignore height when steps is array',
    (expected, given) => {
      expect(
        getProcessingOpts(given, 300, [1920, 1024, 768, 640, 360]),
      ).toEqual({ w: expected });
    },
  );
});

it('should decode content URL', () => {
  expect(
    decodeContentURL(
      `${process.env.CONTENT_PUBLIC_URL}/Jcaagbygy338IdfbNfTXADI6cEyOm2Kxo-I2eAxtI_k//czM6Ly9jb250ZW50LTEvbWVkaWEvMWJkMGM4ZTAtNjcwMi0xMWViLWJiMTYtYWY0OWRlMmU3MmJiLmpwZw.jpg`,
    ),
  ).toBe('1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg');
});
