import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function AdminDashboard() {

  const [tab, setTab] = useState("users");

  const [withdrawals, setWithdrawals] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");


  /* ================= LOAD WITHDRAWALS ================= */

  const loadWithdrawals = async () => {

    const res = await fetch(
      "https://four6-backend.onrender.com/api/withdrawals/all",
      { credentials: "include" }
    );

    const data = await res.json();

    setWithdrawals(data);
  };


  useEffect(() => {
    loadWithdrawals();
  }, []);


  /* ================= ADD USER ================= */

  const handleAddUser = async () => {

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    const res = await fetch(
      "https://four6-backend.onrender.com/api/admin/add-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",

        body: JSON.stringify({
          username,
          password,
          balance: Number(balance)
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("✅ User Created");

    setUsername("");
    setPassword("");
    setBalance("");
  };


  /* ================= APPROVE ================= */

  const approve = async (id) => {

    await fetch(
      `https://four6-backend.onrender.com/api/withdrawals/approve/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    loadWithdrawals();
  };


  /* ================= REJECT ================= */

  const reject = async (id) => {

    await fetch(
      `https://four6-backend.onrender.com/api/withdrawals/reject/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    loadWithdrawals();
  };


  /* ================= UI ================= */

  return (
    <div className="admin-container">


      {/* HEADER */}
      <h1 className="admin-title">
        Admin Panel
      </h1>


      {/* TABS */}
      <div className="admin-tabs">

        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          ➕ Add User
        </button>

        <button
          className={tab === "withdrawals" ? "active" : ""}
          onClick={() => setTab("withdrawals")}
        >
          💰 Withdraw Requests
        </button>

      </div>


      {/* ================= ADD USER ================= */}

      {tab === "users" && (

        <div className="admin-card">

          <h3>Create New User</h3>

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <input
            type="number"
            placeholder="Initial Balance"
            value={balance}
            onChange={e => setBalance(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={handleAddUser}
          >
            Create User
          </button>

        </div>
      )}


      {/* ================= WITHDRAWALS ================= */}

      {tab === "withdrawals" && (

        <div className="withdraw-list">

          {withdrawals.length === 0 && (
            <p className="empty-text">
              No withdrawal requests
            </p>
          )}

          {withdrawals.map(w => (

            <div key={w._id} className="withdraw-card">

              <div className="withdraw-row">
                <span>User</span>
                <b>{w.userId?.username}</b>
              </div>

              <div className="withdraw-row">
                <span>Balance</span>
                <b>₹ {w.userId?.balance}</b>
              </div>

              <div className="withdraw-row">
                <span>Amount</span>
                <b>₹ {w.amount}</b>
              </div>

              <div className="withdraw-row">
                <span>UPI</span>
                <b>{w.upiId}</b>
              </div>

              <div className="withdraw-row">
                <span>Status</span>
                <b className={w.status.toLowerCase()}>
                  {w.status}
                </b>
              </div>


              {w.status === "PENDING" && (

                <div className="withdraw-actions">

                  <button
                    className="approve"
                    onClick={() => approve(w._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject"
                    onClick={() => reject(w._id)}
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
