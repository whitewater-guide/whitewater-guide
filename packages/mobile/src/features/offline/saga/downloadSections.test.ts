import { mockApolloClient } from '@whitewater-guide/clients/dist/test';
import flatten from 'lodash/flatten';
import { Buffer, buffers, channel, END } from 'redux-saga';
import { expectSaga, RunResult } from 'redux-saga-test-plan';
import { put } from 'redux-saga-test-plan/matchers';
import { offlineContentActions } from '../actions';
import downloadSections from './downloadSections';
import { mockApolloData } from './test-utils';

jest.mock('./constants');

describe.each([['with media', true], ['without media', false]])(
  'sections %s',
  (_: any, buff: boolean) => {
    let effects: RunResult;
    let buffer: Buffer<any> | null;

    beforeEach(async () => {
      jest.resetAllMocks();
      buffer = buff ? buffers.expanding(10) : null;
      effects = await expectSaga(
        downloadSections,
        '__region_id__',
        buff ? channel(buffer!) : undefined,
        mockApolloClient(mockApolloData),
      ).run();
    });

    it('should download sections', async () => {
      expect(effects.returnValue).toHaveProperty('data.sections.nodes');
      expect(effects.returnValue.data.sections.nodes).toHaveLength(6);
    });

    it('should queue media for downloads', async () => {
      if (!buffer) {
        return;
      }
      const bufferContent = flatten(Array.from(buffer.flush()));
      // 6 sections, 2 pieces of media each = 12 medias
      // 3 kinds of media are rotating => 4 photos
      // photo + thumbnail => 8 photo files
      // END when done
      expect(bufferContent).toHaveLength(9);
      expect(bufferContent[bufferContent.length - 1]).toEqual(END);
    });

    it('should output progress', () => {
      expect(effects.effects.put).toEqual(
        expect.arrayContaining([
          put(
            offlineContentActions.updateProgress({
              data: 2,
            }),
          ),
          put(
            offlineContentActions.updateProgress({
              data: 4,
            }),
          ),
          put(
            offlineContentActions.updateProgress({
              data: 6,
            }),
          ),
        ]),
      );
    });
  },
);
