const { resolve } = require('path');
const CodePush = require('code-push');
const dotenv = require('dotenv');
const { spawnSync } = require('child_process');

function getNativeVersion() {
  const pjson = require(resolve(__dirname, '../package.json'));
  return pjson.version;
}

function getDist(platform) {
  const ajson = require(resolve(__dirname, '../app.json'));
  return platform === 'ios' ? ajson.iosBuildNumber : ajson.androidBuildNumber;
}

async function getAppcenterVersion(platform, deployment) {
  const app =
    platform === 'ios'
      ? process.env.APPCENTER_APP_NAME_IOS
      : process.env.APPCENTER_APP_NAME_ANDROID;
  const codePush = new CodePush(process.env.APPCENTER_API_TOKEN);
  const packages = await codePush.getDeploymentHistory(app, deployment);

  const nativeVersion = getNativeVersion();
  for (let i = packages.length; i--; i >= 0) {
    if (packages[i].appVersion === nativeVersion) {
      return packages[i].label;
    }
  }
  throw new Error(
    `could not find appcenter deployment for native app version ${nativeVersion}`,
  );
}

async function run() {
  const { platform, deployment } = require('yargs').argv;
  if (platform !== 'ios' && platform !== 'android') {
    throw new Error('platform unspecified. Must be "ios" or "android"');
  }
  if (deployment !== 'Production' && deployment !== 'Staging') {
    throw new Error(
      'deployment unspecified. Must be "Production" or "Staging"',
    );
  }
  process.env.SENTRY_PROPERTIES = resolve(
    __dirname,
    `../${platform}/sentry.properties`,
  );
  dotenv.config({ path: resolve(__dirname, '../fastlane/.env') });
  dotenv.config({
    path: resolve(__dirname, '../fastlane/.env.' + deployment.toLowerCase()),
  });
  const appCenterVersion = await getAppcenterVersion(platform, deployment);
  const sentryVersion = `${getNativeVersion()}-codepush:${appCenterVersion}`;

  spawnSync(
    'yarn',
    [
      'sentry-cli',
      'releases',
      'files',
      sentryVersion,
      'upload-sourcemaps',
      `build/${platform}/CodePush`,
      '--rewrite',
      '--strip-common-prefix',
      '--dist',
      getDist(platform),
    ],
    {
      stdio: 'inherit',
      env: process.env,
    },
  );

  console.info(`Uploaded release ${sentryVersion} to sentry`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
