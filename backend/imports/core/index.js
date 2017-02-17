import './fixtures';
import './accounts';
import './register-api';
import './apollo';

import './uploads';

import '../migrations';

import {startJobServer} from '../api/jobs';

startJobServer();