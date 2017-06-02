import './accounts';
import './register-api';
import './thumbnails';
import './apollo';

import '../migrations';

import {startJobServer} from '../api/jobs';

startJobServer();