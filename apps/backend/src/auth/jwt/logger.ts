import authLogger from '../logger';

const logger = authLogger.child({ strategy: 'jwt' });

export default logger;
