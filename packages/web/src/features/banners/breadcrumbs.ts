import { BreadcrumbsMap } from '../../components/breadcrumbs';
import { BannerBreadcrumbDocument } from './bannerBreadcrumb.generated';

export const bannerBreadcrumbs: BreadcrumbsMap = {
  '/banners': 'Banners',
  '/banners/new': 'New',
  '/banners/:bannerId': { query: BannerBreadcrumbDocument },
  '/banners/:bannerId/settings': 'Settings',
};
