import ListRegions from "./ListRegions";
import ViewRegionLeft from "./ViewRegionLeft";
import RegionMapPage from "./RegionMapPage";
import RegionForm from "./RegionForm";

export const regionsRoutes = [
  {
    path: '/regions',
    exact: true,
    content: ListRegions,
  },
  {
    path: '/regions/:regionId',
    exact: true,
    content: RegionMapPage,
    left: ViewRegionLeft,
  },
  {
    path: '/regions/:regionId/map',
    content: RegionMapPage,
    left: ViewRegionLeft,
  },
  {
    path: '/regions/:regionId/settings',
    exact: true,
    content: RegionForm,
    left: ViewRegionLeft,
  },
];

