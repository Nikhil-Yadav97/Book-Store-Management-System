import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  //  Wait until auth is resolved
  if (loading) {
    return <h1>Loading user...</h1>;
  }

  //  Block unauthenticated access
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
