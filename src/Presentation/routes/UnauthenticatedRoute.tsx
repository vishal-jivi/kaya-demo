const UnauthenticatedRoute = () => {
  return (
    <div className="unauthenticated-route">
      <div>
        <h2>Please Login</h2>
        <p>You need to be authenticated to access this content.</p>
        <button>Login</button>
      </div>
    </div>
  );
};

export default UnauthenticatedRoute;
