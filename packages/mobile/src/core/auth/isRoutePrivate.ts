const PRIVATE_ROUTES = [
  'MyProfile',
];

const isRoutePrivate = (route: string) =>
  PRIVATE_ROUTES.some((r) => route.includes(r));

export default isRoutePrivate;
