// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireHR?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireHR = false,
}) => {
  const { user, loading, userData } = useAuth();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get the isHR status from userData
  const isHR = userData?.isHR || false;

  // Role-based access control
  if (requireHR && !isHR) {
    // HR route but user is not HR
    return <Navigate to="/student" replace />;
  } else if (!requireHR && isHR) {
    // Student route but user is HR
    return <Navigate to="/" replace />;
  }

  // User has correct role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
