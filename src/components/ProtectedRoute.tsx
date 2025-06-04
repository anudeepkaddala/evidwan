import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useUser(); // Use the user data from context

  if (!user || !user.role) {
    // Redirect to login if no user is logged in or role is undefined
    console.error("User or role is undefined:", user);
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the home page if the user's role is not allowed
    const rolePath = user.role ? user.role.toLowerCase() : "unknown";
    return <Navigate to={`/${rolePath}/home`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;