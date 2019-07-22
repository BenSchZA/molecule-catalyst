import DiscoverContainer from 'containers/DiscoverContainer';
import LandingPage from 'components/LandingPage';
import CreateProjectContainer from 'containers/CreateProjectContainer';
import AdminDashboardContainer from 'containers/AdminDashboardContainer';


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
}

const routes: AppRoute[] = [{
  name: 'Landing Page',
  path: '/',
  component: LandingPage,
  roleRequirement: UserType.Standard,
  isNavRequired: false,
  showNavForRoles:[],
}, {
  name: 'Discover',
  path: '/discover',
  component: DiscoverContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles:[UserType.Standard, UserType.ProjectCreator, UserType.Admin],
}, {
  name: 'Create Project',
  path: '/projects/create',
  component: CreateProjectContainer,
  roleRequirement: UserType.ProjectCreator,
  isNavRequired: true,
  showNavForRoles:[UserType.ProjectCreator, UserType.Admin],
}, {
  name: 'Admin',
  path: '/admin',
  component: AdminDashboardContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: true,
  showNavForRoles:[UserType.Admin],
}];

export default routes;
