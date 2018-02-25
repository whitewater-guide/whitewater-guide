import { holdTransaction, rollbackTransaction } from '../../db';
import {
  SOURCE_ALPS,
  SOURCE_GALICIA_1,
  SOURCE_GALICIA_2,
  SOURCE_GEORGIA,
  SOURCE_NORWAY,
} from '../../seeds/test/04_sources';
import { GAUGE_GAL_2_1, GAUGE_GEO_3, GAUGE_NOR_1, GAUGE_NOR_3, GAUGE_NOR_4 } from '../../seeds/test/05_gauges';
import safeScheduleJob from './safeScheduleJob';
import { startJobs } from './startJobs';

jest.mock('./safeScheduleJob', () => ({ default: jest.fn() }));

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('all-at-once sources', () => {
  it('should not start jobs when called with gauge id', async () => {
    await startJobs(SOURCE_GALICIA_2, GAUGE_GAL_2_1);
    expect(safeScheduleJob).not.toBeCalled();
  });

  it('should not start for disabled source', async () => {
    await startJobs(SOURCE_GALICIA_1);
    expect(safeScheduleJob).not.toBeCalled();
  });

  it('should not start for source without cron', async () => {
    await startJobs(SOURCE_GALICIA_2);
    expect(safeScheduleJob).not.toBeCalled();
  });

  it('should schedule one job if called for enabled source', async () => {
    await startJobs(SOURCE_ALPS);
    expect(safeScheduleJob).toHaveBeenCalledTimes(1);
    expect(safeScheduleJob).toBeCalledWith(SOURCE_ALPS, '10 * * * *', expect.anything());
  });
});

describe('one-by-one', () => {
  describe('whole source', () => {
    it('should fail if source is disabled', async () => {
      await startJobs(SOURCE_GEORGIA);
      expect(safeScheduleJob).not.toBeCalled();
    });

    it('schedule one job for each enabled gauge', async () => {
      await startJobs(SOURCE_NORWAY);
      expect(safeScheduleJob).toHaveBeenCalledTimes(1);
      expect(safeScheduleJob).toBeCalledWith(`${SOURCE_NORWAY}:${GAUGE_NOR_1}`, '12 * * * *', expect.anything());
    });

    it('should not start jobs for gauges without cron', async () => {
      await startJobs(SOURCE_NORWAY);
      expect(safeScheduleJob)
        .not.toBeCalledWith(`${SOURCE_NORWAY}:${GAUGE_NOR_3}`, expect.anything(), expect.anything());
    });
  });

  describe('single gauge', () => {
    it('should not start jobs if source is disabled', async () => {
      await startJobs(SOURCE_GEORGIA, GAUGE_GEO_3);
      expect(safeScheduleJob).not.toBeCalled();
    });

    it('should not start jobs if gauge is disabled', async () => {
      await startJobs(SOURCE_NORWAY, GAUGE_NOR_4);
      expect(safeScheduleJob).not.toBeCalled();
    });

    it('should not start jobs for gauges without cron', async () => {
      await startJobs(SOURCE_NORWAY, GAUGE_NOR_3);
      expect(safeScheduleJob).not.toBeCalled();
    });

    it('should schedule one job if source and gauge are enabled', async () => {
      await startJobs(SOURCE_NORWAY, GAUGE_NOR_1);
      expect(safeScheduleJob).toBeCalledWith(`${SOURCE_NORWAY}:${GAUGE_NOR_1}`, '12 * * * *', expect.anything());
      expect(safeScheduleJob).toHaveBeenCalledTimes(1);
    });
  });
});
