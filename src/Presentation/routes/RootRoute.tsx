import { useFirebase } from '../../Application/contexts';
import RouteFactory from './RouteFactory';
import { BrowserRouter } from 'react-router';

const RootRoute = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
    <div className="root-route">
      {<RouteFactory isAuthenticated={!!user} />}
    </div>
    </BrowserRouter>
  );
};

export default RootRoute;
