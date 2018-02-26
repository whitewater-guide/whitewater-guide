import ListRivers from "./ListRivers";
import ListRiversLeft from "./ListRiversLeft";
import RiverForm from "./RiverForm";
import ViewRiver from "./ViewRiver";
import RiverLeft from "./RiverLeft";
import {defaultProps} from 'recompose';
import {Breadcrumb} from '../../core/components';
import RiverBreadcrumb from "./RiverBreadcrumb";

export const riversRoutes = [
  {
    path: '/rivers',
    exact: true,
    content: ListRivers,
    left: ListRiversLeft,
    top: defaultProps({label: 'Rivers'})(Breadcrumb),
  },
  {
    path: '/rivers/new',
    content: RiverForm,
    top: defaultProps({label: 'New River'})(Breadcrumb),
  },
  {
    path: '/rivers/:riverId',
    exact: true,
    content: ViewRiver,
    left: RiverLeft,
    top: RiverBreadcrumb,
  },
  {
    path: '/rivers/:riverId/settings',
    content: RiverForm,
    left: RiverLeft,
    top: RiverBreadcrumb,
  },
];
