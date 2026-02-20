import { useState, useEffect } from "react";
import { useUser } from "../context/AuthContext";
import { Link } from "react-router-dom";

import UserPanel from "./UserPanel";
import "../styles/navbar.css";

export default function Navbar() {

  const { user } = useUser();

  const [open, setOpen] = useState(false);


  /* Close panel on logout */
  useEffect(() => {
    if (!user) {
      setOpen(false);
    }
  }, [user]);


  return (
    <>
      <div className="header">

        {/* LEFT PLACEHOLDER (Keeps logo centered) */}
        <div className="nav-left"></div>


        {/* LOGO */}
        <div className="logo">
  <div className="logo-main">ANDHRA CRICKET</div>
  <div className="logo-sub">6666</div>
</div>



        {/* RIGHT SIDE */}
        <div className="nav-right">

          {user && (
            <>
              {/* BALANCE */}
              <div className="balance-box">
                ₹ {user.balance ?? 0}
              </div>

              {/* MENU */}
              <div
                className="user-btn"
                onClick={() => setOpen(true)}
              >
                ☰
              </div>

              {/* ADMIN */}
              {user?.role === "admin" && (
                <Link to="/admin" className="admin-link">
                  Admin
                </Link>
              )}
            </>
          )}

        </div>

      </div>


      {/* USER PANEL */}
      {open && user && (
        <UserPanel onClose={() => setOpen(false)} />
      )}
    </>
  );
}
