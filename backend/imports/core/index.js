import './accounts';
import './register-api';
import './thumbnails';
import './apollo';

import '../migrations';

import { startJobsOnStartup } from '../api/jobs';

startJobsOnStartup();