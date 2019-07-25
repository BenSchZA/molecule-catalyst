import DiscoverContainer from 'containers/DiscoverContainer';
import LandingPage from 'components/LandingPage';
import CreateProjectContainer from 'containers/CreateProjectContainer';
import AdminDashboardContainer from 'containers/AdminDashboardContainer';
import BecomeCreatorContainer from 'containers/BecomeCreatorContainer';


export enum UserType {
  Standard,
  ProjectCreator,
  Admin
}

export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  roleRequirement: number;
  isNavRequired: boolean;
  showNavForRoles: number[];
  requireAuth: boolean;
}

const routes: AppRoute[] = [{
  name: 'Landing Page',
  path: '/',
  component: LandingPage,
  roleRequirement: UserType.Standard,
  isNavRequired: false,
  showNavForRoles:[],
  requireAuth: false
}, {
  name: 'Discover',
  path: '/discover',
  component: DiscoverContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles:[UserType.Standard, UserType.ProjectCreator, UserType.Admin],
  requireAuth: false
}, {
  name: 'Create Project',
  path: '/projects/create',
  component: CreateProjectContainer,
  roleRequirement: UserType.ProjectCreator,
  isNavRequired: true,
  showNavForRoles:[UserType.ProjectCreator, UserType.Admin],
  requireAuth: true
}, {
  name: 'Create Project',
  path: '/projects/becomeCreator',
  component: BecomeCreatorContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles:[UserType.Standard],
  requireAuth: true,
}, {
  name: 'Admin',
  path: '/admin',
  component: AdminDashboardContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: true,
  showNavForRoles:[UserType.Admin],
  requireAuth: true,
}];

export default routes;
