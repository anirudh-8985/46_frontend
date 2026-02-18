import { useEffect, useState } from "react";

export default function AdminWithdrawals() {

  const [list, setList] = useState([]);


  const load = async () => {

    const res = await fetch(
      "http://four6-backend.onrender.com/api/withdrawals/all",
      { credentials: "include" }
    );

    const data = await res.json();

    setList(data);
  };


  useEffect(() => {
    load();
  }, []);


  const approve = async (id) => {

    await fetch(
      `http://four6-backend.onrender.com/api/withdrawals/approve/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    load();
  };


  const reject = async (id) => {

    await fetch(
      `http://four6-backend.onrender.com/api/withdrawals/reject/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    load();
  };


  return (
    <div className="admin-page">

      <h2>Withdrawal Requests</h2>

      {list.map(w => (

        <div key={w._id} className="admin-card">

          <p>User: {w.userId.username}</p>
          <p>Balance: ₹ {w.userId.balance}</p>
          <p>Amount: ₹ {w.amount}</p>
          <p>UPI: {w.upiId}</p>
          <p>Status: {w.status}</p>


          {w.status === "PENDING" && (
            <div>

              <button onClick={() => approve(w._id)}>
                Approve
              </button>

              <button onClick={() => reject(w._id)}>
                Reject
              </button>

            </div>
          )}

        </div>
      ))}

    </div>
  );
}
