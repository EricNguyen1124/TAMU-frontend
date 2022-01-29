import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "src/authentication/AuthContext";

export default function PrivateRoute({ children }) {
  const location_ = useLocation();

  const { currentUser } = useAuth();
  return (
    <>
      {currentUser ? (
        children
      ) : (
        <Navigate to={`/login?${location_.pathname}`} />
      )}
    </>
  );
}
