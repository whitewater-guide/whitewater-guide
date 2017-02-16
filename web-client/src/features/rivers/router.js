import ListRivers from "./ListRivers";
import ListRiversLeft from "./ListRiversLeft";
import RiverForm from "./RiverForm";
import ViewRiver from "./ViewRiver";
import RiverLeft from "./RiverLeft";

export const riversRoutes = [
  {
    path: '/rivers',
    exact: true,
    content: ListRivers,
    left: ListRiversLeft,
  },
  {
    path: '/rivers/new',
    content: RiverForm,
  },
  {
    path: '/rivers/:riverId',
    exact: true,
    content: ViewRiver,
    left: RiverLeft,
  },
  {
    path: '/rivers/:riverId/settings',
    content: RiverForm,
    left: RiverLeft,
  },
];
