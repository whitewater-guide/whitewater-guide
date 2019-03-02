// window variables come from server-side substitution
// REACT_APP vars are build-time vars, used for dev only
export const API_HOST = process.env.REACT_APP_API || window.RUNTIME_API;
export const S3_HOST = process.env.REACT_APP_S3 || window.RUNTIME_S3;
export const FACEBOOK_APP_ID =
  process.env.REACT_APP_FACEBOOK_APP_ID || window.RUNTIME_FACEBOOK_APP_ID;
