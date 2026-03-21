import { PhotoChannel } from './PhotoChannel';

it('should put and take', () => {
  const chan = new PhotoChannel(2);
  chan.put(['1', '2', '3']);
  chan.put(['4', '5']);
  expect(chan.take()).toEqual(['1', '2']);
  expect(chan.take()).toEqual(['3', '4']);
  expect(chan.take()).toEqual(['5']);
  expect(chan.take()).toEqual([]);
});

it('should throw on taking from broken channel', () => {
  const chan = new PhotoChannel(2);
  chan.put(['1', '2', '3']);
  chan.put(['4', '5']);
  expect(chan.take()).toEqual(['1', '2']);
  chan.break(new Error('oops'));
  expect(() => chan.take()).toThrow('oops');
});
