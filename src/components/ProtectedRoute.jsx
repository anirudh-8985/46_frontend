import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly }) {

  const { user, loading } = useUser();

  /* Wait until auth is loaded */
  if (loading) {
    return null; // or loading UI
  }

  /* Not logged in */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* Admin only */
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
