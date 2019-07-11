import { Dashboard } from '@material-ui/icons';
import DashboardContainer from 'containers/DashboardPage';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import LoginPage from 'containers/LoginPage';
import SignUpPage from 'containers/SignUpPage';

export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  isProtected: boolean;
  isNavRequired: boolean;
  routeNavLinkIcon?: React.ComponentType<SvgIconProps>; // Should be provided if Nav is required
}

const routes: AppRoute[] = [{
  name: 'Dashboard',
  path: '/dashboard',
  component: DashboardContainer,
  isProtected: true,
  isNavRequired: true,
  routeNavLinkIcon: Dashboard,
}, {
  name: 'Login',
  path: '/login',
  component: LoginPage,
  isProtected: false,
  isNavRequired: false,
}, {
  name: 'Sign Up',
  path: '/signup',
  component: SignUpPage,
  isProtected: false,
  isNavRequired: false,
}];

export default routes;
