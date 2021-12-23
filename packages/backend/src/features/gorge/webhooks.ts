import { UnhealthyJob } from '@whitewater-guide/gorge';
import format from 'date-fns/format';
import Koa from 'koa';
import Router from 'koa-router';
import xss from 'xss';

import config from '~/config';
import logger from '~/log';
import { MailType, sendMail } from '~/mail';

async function notifyViaEmail(jobs: UnhealthyJob[]) {
  const unhealthyMsg = jobs
    .map((j) => {
      const lastRun = format(new Date(j.lastRun), 'dd/MM/yyyy HH:mm');
      const lastSuccess = j.lastSuccess
        ? format(new Date(j.lastSuccess), 'dd/MM/yyyy HH:mm')
        : '';
      return `
      <tr>
            <td style="padding: 0 15px 0 0">${xss(j.script)}</td>
            <td style="padding: 0 15px">${lastRun}</td>
            <td style="padding: 0 0 0 15px">${lastSuccess}</td>
          </tr>
      `;
    })
    .join('<br/>');

  try {
    await sendMail(MailType.GORGE_UNHEALTHY, config.GORGE_HEALTH_EMAILS, {
      unhealthyMsg,
    });
  } catch (e: any) {
    logger.error({ error: e });
  }
}

/**
 * Adds webhook endpoint that gorge calls when some of the jobs are unhealthy
 *
 * Invoke manually:
 * curl -X 'POST' -d '[{"id":"2f915d20-ffe6-11e8-8919-9f370230d1ae","script":"chile","lastRun":"2021-12-13T07:57:59Z"},{"id":"e3c0c89a-7c72-11e9-8abd-cfc3ab2b843d","script":"quebec","lastRun":"2021-12-13T07:57:00Z"}]' -H 'Cache-Control: no-cache' -H 'Content-Type: application/json; charset=UTF-8' -H 'User-Agent: whitewater.guide robot' 'http://host.docker.internal:3333/gorge/health'
 * @param app
 * @param route
 */
export function addGorgeWebhooks(app: Koa, route = '/gorge'): void {
  const router = new Router({ methods: ['POST'] });

  router.post(`${route}/health`, async (ctx) => {
    // Validate that webhook calls has api key and uses internal host name
    const key = ctx.headers?.['x-api-key'] ?? ctx.headers?.['X-Api-Key'];
    if (key !== config.GORGE_HEALTH_KEY) {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
      logger.warn({ message: 'invalid gorge health key' });
      return;
    }
    const hostHeader = ctx.headers?.['host'] ?? ctx.headers?.['Host'];
    const host =
      typeof hostHeader === 'string' ? hostHeader.split(':')[0] : undefined; // Strip port
    if (!host || !config.GORGE_HEALTH_HOSTS.includes(host)) {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
      logger.warn({ message: `invalid gorge health host header: ${host}` });
      return;
    }

    const jobs: UnhealthyJob[] = ctx.request.body;
    logger.debug({ jobs }, 'unhealthy jobs webhook called');
    if (jobs.length === 0) {
      ctx.body = 'Acknowledged';
      return;
    }
    await notifyViaEmail(jobs);
    ctx.body = 'Acknowledged';
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
}
