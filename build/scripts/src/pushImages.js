const { spawnSync } = require('child_process');
const dockerLogin = require('./dockerLogin');

const pushImages = (images) => {
  dockerLogin();
  images.forEach(image => {
    spawnSync(
      'docker',
      ['push', image],
      { stdio: 'inherit'},
    );
  });
};

module.exports = pushImages;
