import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Login, Signup, Dashboard, Profile, ForgotPassword } from '../pages';
import { authenticatedRoutes, unauthenticatedRoutes, type RouteConfig } from './config';

interface RouteFactoryProps {
  isAuthenticated: boolean;
}

const RouteFactory: React.FC<RouteFactoryProps> = ({ isAuthenticated }) => {
  console.log('RouteFactory rendered with isAuthenticated:', isAuthenticated);
  const renderRoutes = (routes: RouteConfig[]) => {
    return routes.map((route) => {
      const Component = getComponentByName(route.element);
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<Component />}
        />
      );
    });
  };

  const getComponentByName = (elementName: string) => {
    const components: { [key: string]: React.ComponentType } = {
      Login,
      Signup,
      Dashboard,
      Profile,
      ForgotPassword,
    };
    return components[elementName] || (() => <div>Component not found</div>);
  };

  if (isAuthenticated) {
    return (
      <Routes>
        {renderRoutes(authenticatedRoutes.routes)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        {renderRoutes(unauthenticatedRoutes.routes)}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
};

export default RouteFactory;
