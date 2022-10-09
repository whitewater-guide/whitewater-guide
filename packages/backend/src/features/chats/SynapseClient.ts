import axios from 'axios';
import { createHmac } from 'crypto';
import waitForExpect from 'wait-for-expect';

import config from '~/config';
import logger from '~/log';
import { randomString } from '~/utils';

export class SynapseClient {
  private axios = axios.create({ baseURL: config.SYNAPSE_URL });
  private logger = logger.child({ logger: 'chats' });

  public async waitForSynapse(): Promise<void> {
    await waitForExpect(
      async () => {
        const resp = await this.axios.get('/health');
        if (resp.status !== 200) {
          throw new Error('synapse is unhelathy');
        }
      },
      30000,
      1000,
    );
  }

  private async getRegistrationNonce(): Promise<string> {
    const resp = await this.axios.get('/_synapse/admin/v1/register');
    return resp.data.nonce;
  }

  private generateHmac(
    nonce: string,
    user: string,
    password: string,
    admin: boolean,
  ): string {
    const hmac = createHmac('sha1', config.SYNAPSE_REGISTRATION_SHARED_SECRET);
    hmac.update(nonce);
    hmac.update('\x00');
    hmac.update(user);
    hmac.update('\x00');
    hmac.update(password);
    hmac.update('\x00');
    hmac.update(admin ? 'admin' : 'notadmin');

    return hmac.digest('hex');
  }

  public async registerAdmin(
    username: string,
    password?: string,
  ): Promise<void> {
    this.logger.debug({ username }, 'registering admin');

    const nonce = await this.getRegistrationNonce();
    const pwd = password ?? randomString(16);

    try {
      const resp = await this.axios.post('/_synapse/admin/v1/register', {
        nonce,
        username,
        displayname: username,
        password: pwd,
        admin: true,
        mac: this.generateHmac(nonce, username, pwd, true),
      });

      if (resp.status === 200 && resp.data.user_id) {
        this.logger.debug({ user_id: resp.data.user_id }, 'registered admin');
      } else {
        this.logger.debug(resp.data, 'admin registration error');
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        this.logger.debug(
          { data: e.response?.data, status: e.response?.status },
          'admin registration error',
        );
      } else {
        this.logger.error({
          error: e as Error,
          message: 'admin registration error',
        });
      }
    }
  }

  /**
   * Deletes users in GDPR-compliant way from synapse database
   *
   * https://matrix-org.github.io/synapse/latest/admin_api/user_admin_api.html#deactivate-account
   * @param userId
   */
  public async deactivateAccount(userId: string): Promise<void> {
    const resp = await this.axios.post(
      `/_synapse/admin/v1/deactivate/${userId}`,
      {
        erase: true,
      },
    );
    if (resp.status !== 200) {
      this.logger.debug(resp.data, 'failed to deactivate user');
      throw new Error('failed to deactivate user');
    }
  }
}

export const synapseClient = new SynapseClient();
