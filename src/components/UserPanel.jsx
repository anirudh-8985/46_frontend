import { useState } from "react";
import { useUser } from "../context/AuthContext";
import ChangeProfileModal from "./ChangeProfileModal";
import "../styles/userpanel.css";
import WithdrawModal from "./WithdrawModal";

export default function UserPanel({ onClose }) {

  const { logout } = useUser();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
      {/* Background */}
      <div className="overlay" onClick={onClose}></div>

      {/* Drawer */}
      <div className="drawer">

        <div className="drawer-header">
          <span>User Panel</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">

          <button
            className="drawer-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Change Username / Password
          </button>

          <button
            className="drawer-btn"
            onClick={() => setShowWithdrawModal(true)}
          >
            Request Withdrawal
          </button>



          <button
            className="drawer-btn logout"
            onClick={() => {
                logout();
                onClose();   // ✅ Close panel
            }}
            >
            Logout
            </button>


        </div>

      </div>

      {/* Modal */}
      {showProfileModal && (
        <ChangeProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
      {showWithdrawModal && (
  <WithdrawModal
    onClose={() => setShowWithdrawModal(false)}
  />
)}

    </>
  );
}
