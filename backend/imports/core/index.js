import './tap-i18n';
import './fixtures';
import './accounts';
import './register-api';
import './apollo';

import '../migrations';

import {startJobServer} from '../api/jobs';

startJobServer();