import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { role } = useAuth();

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
