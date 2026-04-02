"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [items, setItems] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    const savedPlayers = JSON.parse(localStorage.getItem("players")) || [];

    setItems(savedItems);
    setPlayers(savedPlayers);

    if (savedPlayers.length > 0) {
      setCurrentPlayer(savedPlayers[0]);
    }
  }, []);

  const isThisWeek = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);

    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay());

    const last = new Date(first);
    last.setDate(first.getDate() + 6);

    return d >= first && d <= last;
  };

  const filtered = items.filter((i) => i.player === currentPlayer);

  const weeklyTotal = filtered
    .filter((i) => isThisWeek(i.date))
    .reduce((sum, i) => sum + (i.count || 0), 0);

  return (
    <div style={page}>
      <h1>📊 結果ページ</h1>

      <select value={currentPlayer} onChange={(e) => setCurrentPlayer(e.target.value)}>
        {players.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <p style={{ color: weeklyTotal >= 300 ? "red" : "black" }}>
        今週の球数: {weeklyTotal}球
        {weeklyTotal >= 300 && " ⚠注意"}
      </p>

      {filtered.map((item) => (
        <div key={item.id} style={card}>
          <p>{item.date}</p>
          <p>⚾ {item.count}球</p>
          <p>{item.type}</p>
          <p>肩:{item.shoulder} / 肘:{item.elbow}</p>
          <p>💬 {item.initialComment}</p>
        </div>
      ))}
    </div>
  );
}

const page = {
  padding: 20,
  background: "#f5f5f5",
  minHeight: "100vh",
};

const card = {
  background: "white",
  padding: 10,
  marginBottom: 10,
  borderRadius: 10,
};

