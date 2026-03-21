export interface PathsOpts {
  sourceId?: string;
  gaugeId?: string;
  regionId?: string;
  riverId?: string;
  sectionId?: string;
  bannerId?: string;
  descentId?: string;
  prefix?: string;
  suffix?: string;
}

const to = (opts: PathsOpts) => {
  const {
    sourceId,
    gaugeId,
    regionId,
    riverId,
    sectionId,
    bannerId,
    descentId,
    prefix = '',
    suffix = '',
  } = opts;

  if (gaugeId) {
    return `${prefix}/sources/${sourceId}/gauges/${gaugeId}${suffix}`;
  }
  if (sourceId) {
    return `${prefix}/sources/${sourceId}${suffix}`;
  }
  if (sectionId) {
    return `${prefix}/regions/${regionId}/sections/${sectionId}${suffix}`;
  }
  if (riverId) {
    return `${prefix}/regions/${regionId}/rivers/${riverId}${suffix}`;
  }
  if (regionId) {
    return `${prefix}/regions/${regionId}${suffix}`;
  }
  if (bannerId) {
    return `${prefix}/banners/${bannerId}${suffix}`;
  }
  if (descentId) {
    return `${prefix}/logbook/${descentId}${suffix}`;
  }
  return '/404';
};

const settings = (opts: PathsOpts) => to({ ...opts, suffix: '/settings' });
const admin = (opts: PathsOpts) => to({ ...opts, suffix: '/admin' });

export const paths = {
  to,
  settings,
  admin,
};
