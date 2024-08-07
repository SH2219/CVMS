// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, user, ...props }) => {
  return user ? <Component {...props} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
