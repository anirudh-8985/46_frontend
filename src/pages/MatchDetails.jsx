import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/match.css";
import { useUser } from "../context/AuthContext";

export default function MatchDetails() {
  const { user, setUser, refreshUser } = useUser();

  const { id } = useParams();

  const [match, setMatch] = useState(null);

  const [selectedBet, setSelectedBet] = useState(null);
  const [amount, setAmount] = useState("");


  /* ================= FETCH MATCH ================= */

  useEffect(() => {

    fetch("https://four6-backend.onrender.com/api/matches")
      .then(res => res.json())
      .then(data => {
        const m = data.data.find(x => x.id === id);
        setMatch(m);
      })
      .catch(err => console.error(err));

  }, [id]);


  if (!match) return <div>Loading...</div>;


  /* ================= TOGGLE HANDLER ================= */
  const handlePlaceBet = async () => {

  if (!selectedBet || !amount) {
    alert("Select odd and enter amount");
    return;
  }

  try {

    const res = await fetch("https://four6-backend.onrender.com/api/bets/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",

      body: JSON.stringify({

        matchId: match.id,

        betType: selectedBet.type,   // h2h / question

        betKey: selectedBet.key,

        teamSelected: selectedBet.label, // ✅ IMPORTANT

        questionIndex:
    selectedBet.type === "question"
      ? selectedBet.questionIndex
      : null,

        odds: selectedBet.odds,

        amount: Number(amount)

      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Bet placed!");

    // ✅ Update balance instantly
    // Update locally
      setUser(prev => ({
        ...prev,
        balance: data.balance
      }));

      // Sync with backend (safety)
      await refreshUser();


    setAmount("");
    setSelectedBet(null);


  } catch (err) {
    console.error(err);
    alert("Bet failed");
  }
};


  const toggleBet = (betObj) => {

    if (selectedBet?.key === betObj.key) {
      setSelectedBet(null);
      setAmount("");
    } else {
      setSelectedBet(betObj);
      setAmount("");
    }

  };


  return (
    <div>



      <div className="main">


        {/* MATCH STATUS */}
        <div className="section-title">
          {match.live ? "Live Match" : "Upcoming Match"}
        </div>


        {/* SCORE */}
        <div className="score-card">

          <div className="team-block">
            <h2>{match.home}</h2>
            <p>
              {match.score?.home || "-"} /
              {match.score?.wickets1 || "-"} (
              {match.score?.overs1 || "-"} ov)
            </p>
          </div>


          <div className="team-block">
            <h2>{match.away}</h2>
            <p>
              {match.score?.away || "-"} /
              {match.score?.wickets2 || "-"} (
              {match.score?.overs2 || "-"} ov)
            </p>
          </div>

        </div>


        {/* ================= HEAD TO HEAD ================= */}

        <h3 className="sub-title">Head to Head</h3>

        <div className="odds-container">

          {/* HOME */}
          <button
            className={`odd-box ${
              selectedBet?.key === "home" ? "active-odd" : ""
            }`}
            onClick={() =>
              setSelectedBet({
                type: "h2h",
                key: "home",
                label: match.home,   // ✅ ADD THIS
                odds: match.odds1
              })
            }

          >
            {match.home}
            <br />
            {match.odds1}x
          </button>


          {/* AWAY */}
          <button
            className={`odd-box ${
              selectedBet?.key === "away" ? "active-odd" : ""
            }`}
            onClick={() =>
            setSelectedBet({
              type: "h2h",
              key: "away",
              label: match.away,   // ✅ ADD THIS
              odds: match.odds2
            })
}

          >
            {match.away}
            <br />
            {match.odds2}x
          </button>

        </div>


        {/* H2H BET PANEL */}
        {selectedBet?.type === "h2h" && (
          <BetPanel
            selectedBet={selectedBet}
            amount={amount}
            setAmount={setAmount}
            onPlaceBet={handlePlaceBet}
          />

        )}


        {/* ================= FANCY BETS ================= */}

        <h3 className="sub-title">Fancy Bet</h3>


        {match.questions
          ?.filter(q => q.active)
          .map((q, index) => (

            <div key={index} className="question-box">

              <div className="question-title">
                {q.question}
              </div>


              <div className="odds-container">


                {/* YES */}
                <button
                  className={`odd-box ${
                    selectedBet?.key === `q${index}-1`
                      ? "active-odd"
                      : ""
                  }`}
                  onClick={() =>
                    toggleBet({
                      type: "question",
                      key: `q${index}-1`,
                      label: q.team1,          // ✅ ADD THIS
                      odds: q.odds1,
                      questionIndex: index,
                    })
                  }

                >
                  {q.team1}
                  <br />
                  {q.odds1}x
                </button>


                {/* NO */}
                <button
                  className={`odd-box ${
                    selectedBet?.key === `q${index}-2`
                      ? "active-odd"
                      : ""
                  }`}
                  onClick={() =>
                    toggleBet({
                      type: "question",
                      key: `q${index}-2`,
                      label: q.team2,          // ✅ ADD THIS
                      odds: q.odds2,
                      questionIndex: index,
                    })
                  }

                >
                  {q.team2}
                  <br />
                  {q.odds2}x
                </button>

              </div>


              {/* QUESTION BET PANEL */}
              {selectedBet?.type === "question" &&
                selectedBet?.questionIndex === index && (

                  <BetPanel
                    selectedBet={selectedBet}
                    amount={amount}
                    setAmount={setAmount}
                    onPlaceBet={handlePlaceBet}
                  />


              )}

            </div>

        ))}

      </div>

    </div>
  );
}



/* ================= BET PANEL ================= */

function BetPanel({ selectedBet, amount, setAmount, onPlaceBet }) {


  const potentialWin =
    amount && selectedBet
      ? (Number(amount) * Number(selectedBet.odds)).toFixed(2)
      : 0;


  return (
    <div className="bet-panel">

      <div className="bet-header">
        Odds: {selectedBet.odds}x
      </div>


      <div className="bet-body">

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />


        <div className="returns">
          You Win ₹ {potentialWin}
        </div>


        <button
  className="place-btn"
  onClick={onPlaceBet}
>
  Place Bet
</button>


      </div>

    </div>
  );
}
