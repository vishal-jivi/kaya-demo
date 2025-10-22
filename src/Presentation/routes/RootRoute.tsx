import { useState } from 'react';
import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';


const RootRoute = () => {
  const [isAuthenticated] = useState(false);

  return (
    <div className="root-route">
      {isAuthenticated ? (
        <AuthenticatedRoute />
      ) : (
        <UnauthenticatedRoute />

      )}
    </div>
  );
};

export default RootRoute;
