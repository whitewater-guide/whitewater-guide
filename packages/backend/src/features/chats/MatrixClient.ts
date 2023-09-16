import * as sdk from 'matrix-js-sdk';
import retry from 'p-retry';

import { getAccessToken } from '../../auth/index';
import config from '../../config';

class MatrixClient extends sdk.MatrixClient {
  constructor(opts: sdk.IMatrixClientCreateOpts) {
    const { scheduler, ...rest } = opts;
    super({
      ...rest,
      scheduler: scheduler ?? new sdk.MatrixScheduler(),
    });
  }

  public async loginAsApi() {
    const token = getAccessToken(config.SYNAPSE_API_USER);
    return this.login('org.matrix.login.jwt', { token });
  }

  override async createRoom(
    options: sdk.ICreateRoomOpts,
  ): Promise<{ room_id: string }> {
    return retry(
      async () => {
        return super.createRoom(options);
      },
      {
        retries: 5,
      },
    );
  }
}

export const matrixClient = new MatrixClient({ baseUrl: config.SYNAPSE_URL });
