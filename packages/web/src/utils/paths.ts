export interface PathsOpts {
  sourceId?: string;
  gaugeId?: string;
  regionId?: string;
  riverId?: string;
  sectionId?: string;
}

const to = (opts: PathsOpts) => {
  const {
    sourceId,
    gaugeId,
    regionId,
    riverId,
    sectionId,
  } = opts;

  if (gaugeId) {
    return `/sources/${sourceId}/gauges/${gaugeId}`;
  }
  if (sourceId) {
    return `/sources/${sourceId}`;
  }
  if (sectionId) {
    return `/regions/${regionId}/sections/${sectionId}`;
  }
  if (riverId) {
    return `/regions/${regionId}/rivers/${riverId}`;
  }
  if (regionId) {
    return `/regions/${regionId}`;
  }
  return '/404';
};

const settings = (opts: PathsOpts) => `${to(opts)}/settings`;
const admin = (opts: PathsOpts) => `${to(opts)}/admin`;

export const paths = {
  to,
  settings,
  admin,
};
