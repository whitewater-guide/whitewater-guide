export default (state, { regionId }) => state.persistent.regions[regionId || 'all'];
