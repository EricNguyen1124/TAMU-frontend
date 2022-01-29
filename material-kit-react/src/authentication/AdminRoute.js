import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/authentication/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser, userProfile, displayErrMess, isAdmin } = useAuth();
  if (!isAdmin())
    displayErrMess("you are not allowed view this page", "warning");
  return <>{currentUser && isAdmin() ? children : <Navigate to="/login" />}</>;
}
