// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import Navbar from "./components/Navbar";

// import Home from "./pages/Home";
// import MatchDetails from "./pages/MatchDetails";
// import MyBets from "./pages/MyBets";
// // import MyBets from "./pages/MyBets";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";

// export default function App() {

//   return (
//     <BrowserRouter>

//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/match/:id" element={<MatchDetails />} />
//         <Route path="/mybets" element={<MyBets />} />

//       </Routes>

//       <div className="bottom-nav">
//         <Link to="/">Home</Link>
//         <Link
//   className="nav-item"
//   onClick={() => navigate("/mybets")}
// >
//   My Bets
// </Link>

//         <Link to="/history">History</Link>
//       </div>

//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";

import Home from "./pages/Home";
import MatchDetails from "./pages/MatchDetails";
import MyBets from "./pages/MyBets";
import Login from "./pages/Login";
import AdminWithdrawals from "./pages/AdminWithdrawals";

import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {

  const { refreshUser, user } = useUser();

  useEffect(() => {

  // Only refresh if logged in
  if (!user) return;

  // First sync immediately
  refreshUser();

  // Then sync every 15 seconds
  const interval = setInterval(() => {
    refreshUser();
  }, 15000);

  return () => clearInterval(interval);

}, [user, refreshUser]);



  return (
    <BrowserRouter>

      <Navbar />


      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />


        {/* PROTECTED ROUTES */}

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


      {/* BOTTOM NAV */}

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


    </BrowserRouter>
  );
}
