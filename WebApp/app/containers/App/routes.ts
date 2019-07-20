import DiscoverContainer from 'containers/DiscoverContainer';
import LandingPage from 'components/LandingPage';
import CreateProjectContainer from 'containers/CreateProjectContainer';

export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  isProtected: boolean;
  isNavRequired: boolean;
}

const routes: AppRoute[] = [{
  name: 'Landing Page',
  path: '/',
  component: LandingPage,
  isProtected: false,
  isNavRequired: false,
}, {
  name: 'Discover',
  path: '/discover',
  component: DiscoverContainer,
  isProtected: false,
  isNavRequired: true,
}, {
  name: 'Create Project',
  path: '/projects/create',
  component: CreateProjectContainer,
  isProtected: false,
  isNavRequired: true,
}];

export default routes;
