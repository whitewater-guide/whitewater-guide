const DEPENDENCIES = {
  'backend': ['commons'],
  'caddy': [],
  'clients': ['commons'],
  'commons': [],
  'db': [],
  'landing': [],
  'minio': [],
  'mobile': ['clients', 'commons'],
  'mongo-to-postgres': [],
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
