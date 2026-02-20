
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";

import Home from "./pages/Home";
import MatchDetails from "./pages/MatchDetails";
import MyBets from "./pages/MyBets";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {

  const { refreshUser, user } = useUser();


  /* ================= AUTO REFRESH USER ================= */

  useEffect(() => {

    if (!user) return;

    // Refresh immediately
    refreshUser();

    // Refresh every 15 sec
    const interval = setInterval(() => {
      refreshUser();
    }, 15000);

    return () => clearInterval(interval);

  }, [user, refreshUser]);


  return (
    <BrowserRouter>

      {/* ================= TOP NAVBAR ================= */}
      <Navbar />



      {/* ================= ROUTES ================= */}

      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />


        {/* USER ROUTES */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match/:id"
          element={
            <ProtectedRoute>
              <MatchDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybets"
          element={
            <ProtectedRoute>
              <MyBets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />


        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <ProtectedRoute adminOnly>
              <AdminWithdrawals />
            </ProtectedRoute>
          }
        />

      </Routes>


      {/* ================= BOTTOM NAV ================= */}

      {user && (
        <div className="bottom-nav">

          <Link className="nav-item" to="/">
            Home
          </Link>

          <Link className="nav-item" to="/mybets">
            My Bets
          </Link>

          <Link className="nav-item" to="/history">
            History
          </Link>

        </div>
      )}

    </BrowserRouter>
  );
}
