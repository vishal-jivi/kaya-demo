import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import { useFirebase } from '../../Application/contexts';

const RootRoute = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="root-route">
      {user ? (
        <AuthenticatedRoute />
      ) : (
        <UnauthenticatedRoute />
      )}
    </div>
  );
};

export default RootRoute;
