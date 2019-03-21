import authLogger from '../logger';

const logger = authLogger.child({ strategy: 'local' });

export default logger;
