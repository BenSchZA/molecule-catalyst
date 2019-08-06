import DiscoverContainer from 'containers/DiscoverContainer';
import LandingPage from 'components/LandingPage';
import CreateProjectContainer from 'containers/CreateProjectContainer';
import AdminDashboardContainer from 'containers/AdminDashboardContainer';
import CreatorApplicationContainer from 'containers/CreatorApplicationContainer';
import AdminUserViewContainer from 'containers/AdminUserViewContainer';


export enum UserType {
  Standard,
  ProjectCreator,
  Admin
}

export interface AppRoute {
  name: string; // The name displayed in any Nav links
  path: string; // The route path
  component: React.ComponentType<any>; //The component to render
  roleRequirement: number; // The minimum role required to access the route
  isNavRequired: boolean; // Should a Nav link for the route be added to the main navigation
  showNavForRoles: number[]; // The Roles for which the Nav link should be rendered
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
  component: CreatorApplicationContainer,
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
},{
  name: 'Admin User View',
  path: '/admin/user/:userId',
  component: AdminUserViewContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles:[UserType.Admin],
  requireAuth: true,
}];

export default routes;
