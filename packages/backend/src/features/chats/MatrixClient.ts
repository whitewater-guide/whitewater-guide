import * as sdk from 'matrix-js-sdk';

import { getAccessToken } from '~/auth';
import config from '~/config';

class MatrixClient extends sdk.MatrixClient {
  constructor(opts: sdk.IMatrixClientCreateOpts) {
    const { request, ...rest } = opts;
    super({ ...rest, request: request ?? sdk.getRequest() });
  }
  public async loginAsApi() {
    const token = getAccessToken(config.SYNAPSE_API_USER);
    return this.login('org.matrix.login.jwt', { token });
  }
}

export const matrixClient = new MatrixClient({ baseUrl: config.SYNAPSE_URL });
