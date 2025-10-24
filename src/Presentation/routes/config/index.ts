import authenticatedRoutes from './authenticatedRoutes.json';
import unauthenticatedRoutes from './unauthenticatedRoutes.json';

export interface RouteConfig {
  path: string;
  element: string;
  title: string;
  protected: boolean;
}

export interface RoutesConfig {
  routes: RouteConfig[];
}

export { authenticatedRoutes, unauthenticatedRoutes };
