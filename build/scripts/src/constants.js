const DEPENDENCIES = {
  'adminer': [],
  'backend': ['commons'],
  'boompromo': ['clients', 'commons'],
  'caddy': [],
  'clients': ['commons'],
  'commons': [],
  'db': [],
  'landing': [],
  'minio': [],
  'mobile': ['clients', 'commons'],
  'mongo-to-postgres': [],
  // 'wale': [], // Temporary disabled
  'web': ['clients', 'commons'],
  'workers': [],
};

const PACKAGES = Object.keys(DEPENDENCIES);

const STACK_NAME = 'wwguide';

module.exports = {
  DEPENDENCIES,
  PACKAGES,
  STACK_NAME,
};
