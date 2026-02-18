import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly }) {

  const { user } = useUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin only route
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
