import DiscoverContainer from 'containers/DiscoverContainer';
import PortfolioContainer from 'containers/PortfolioContainer';
import LandingPage from 'components/LandingPage';
import CreateProjectContainer from 'containers/CreateProjectContainer';
import AdminUserListingContainer from 'containers/AdminUserListingContainer';
import CreatorApplicationContainer from 'containers/CreatorApplicationContainer';
import AdminUserViewContainer from 'containers/AdminUserViewContainer';
import AdminProjectListingContainer from 'containers/AdminProjectListingContainer';
import AdminProjectReviewContainer from 'containers/AdminProjectReviewContainer';
import ProjectCreationConfirmation from 'components/ProjectCreationConfirmation';
import { UserType } from './types';
import MyProjectsContainer from 'containers/MyProjectsContainer';
import ProjectDetailsContainer from 'containers/ProjectDetailsContainer';
import AdminProjectEditContainer from 'containers/AdminProjectEditContainer';
import AdminUserEditContainer from 'containers/AdminUserEditContainer';



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
  showNavForRoles: [],
  requireAuth: false
}, {
  name: 'Discover',
  path: '/discover',
  component: DiscoverContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles: [UserType.Standard, UserType.ProjectCreator, UserType.Admin],
  requireAuth: false
}, {
  name: 'My Projects',
  path: '/myprojects',
  component: PortfolioContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles: [UserType.Standard, UserType.Admin],
  requireAuth: true
}, {
  name: 'Create Project',
  path: '/projects/create',
  component: CreateProjectContainer,
  roleRequirement: UserType.ProjectCreator,
  isNavRequired: true,
  showNavForRoles: [UserType.ProjectCreator, UserType.Admin],
  requireAuth: true
}, {
  name: 'Creator Application',
  path: '/projects/becomeCreator',
  component: CreatorApplicationContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: true,
  showNavForRoles: [UserType.Standard],
  requireAuth: true,
}, {
  name: 'Project Details',
  path: '/project/:projectId',
  component: ProjectDetailsContainer,
  roleRequirement: UserType.Standard,
  isNavRequired: false,
  showNavForRoles: [],
  requireAuth: false,
}, {
  name: 'Admin User View',
  path: '/admin/user/:userId',
  component: AdminUserViewContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Admin User Edit',
  path: '/admin/user/:userId/edit',
  component: AdminUserEditContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Admin Project View',
  path: '/admin/project/:projectId',
  component: AdminProjectReviewContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Admin Project Edit',
  path: '/admin/project/:projectId/edit',
  component: AdminProjectEditContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Admin Project Preview',
  path: '/admin/project/:projectId/preview',
  component: ProjectDetailsContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Project Creation Confirmation',
  path: '/projects/confirmCreated',
  component: ProjectCreationConfirmation,
  roleRequirement: UserType.ProjectCreator,
  isNavRequired: false,
  showNavForRoles: [],
  requireAuth: true,
}, {
  name: 'My Projects',
  path: '/projects/myProjects',
  component: MyProjectsContainer,
  roleRequirement: UserType.ProjectCreator,
  isNavRequired: true,
  showNavForRoles: [UserType.ProjectCreator],
  requireAuth: true,
}, {
  name: 'Users',
  path: '/admin/users',
  component: AdminUserListingContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}, {
  name: 'Projects',
  path: '/admin/projects',
  component: AdminProjectListingContainer,
  roleRequirement: UserType.Admin,
  isNavRequired: false,
  showNavForRoles: [UserType.Admin],
  requireAuth: true,
}];

export default routes;
