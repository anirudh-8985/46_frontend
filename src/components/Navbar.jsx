import { useState } from "react";
import { useUser } from "../context/AuthContext";
import { Link } from "react-router-dom";

import UserPanel from "./UserPanel";
import "../styles/navbar.css";

export default function Navbar() {

  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header">

        {/* USER BUTTON */}
        <div
          className="user-btn"
          onClick={() => setOpen(true)}
        >
          ☰
        </div>

        <div className="logo">ANDHRA CRICKET 6666</div>

        <div className="balance-box">
          ₹ {user?.balance ?? 0}
        </div>

        {/* ADMIN LINK */}
      {user?.role === "admin" && (
        <Link to="/admin" className="admin-link">
          Admin
        </Link>
      )}

      </div>

      {/* Slide Panel */}
      {open && (
        <UserPanel onClose={() => setOpen(false)} />
      )}
    </>
  );
}
