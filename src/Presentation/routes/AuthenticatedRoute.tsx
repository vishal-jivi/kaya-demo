const AuthenticatedRoute = () => {
  return (
    <div className="authenticated-route">
      <div>
        <h2>Dashboard</h2>
        <p>You are logged in!</p>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default AuthenticatedRoute;
