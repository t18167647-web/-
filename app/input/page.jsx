"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function InputPage() {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [elbow, setElbow] = useState("");
  const [initialComment, setInitialComment] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("players"));
    if (saved) {
      setPlayers(saved);
    } else {
      const initial = ["熊", "坂田", "末永", "五島", "松尾"];
      localStorage.setItem("players", JSON.stringify(initial));
      setPlayers(initial);
    }

    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const press = (e) => {
    e.currentTarget.style.transform = "scale(0.9)";
  };

  const release = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  const handleSubmit = () => {
    const newItem = {
      id: Date.now(),
      player,
      type,
      count: Number(count),
      shoulder,
      elbow,
      initialComment,
      date,
      comments: [],
    };

    const existing = JSON.parse(localStorage.getItem("items")) || [];
    localStorage.setItem("items", JSON.stringify([...existing, newItem]));

    alert("保存成功！");
  };

  return (
    <div style={page}>
      {/* 🏠 ホーム */}
      <Link href="/">
        <button
          style={homeBtn}
          onMouseDown={press}
          onMouseUp={release}
          onMouseLeave={release}
        >
          🏠
        </button>
      </Link>

      <h1>✏️ 入力ページ</h1>

      <div style={card}>
        <p>📅 日付</p>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div style={card}>
        <p>👤 選手</p>
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          <option value="">選択</option>
          {players.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={card}>
        <p>⚾ 投球タイプ</p>
        <input value={type} onChange={(e) => setType(e.target.value)} />

        <p>球数</p>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </div>

      <div style={card}>
        <p>肩</p>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setShoulder("○")}>○</button>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setShoulder("△")}>△</button>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setShoulder("×")}>×</button>

        <p>肘</p>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setElbow("○")}>○</button>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setElbow("△")}>△</button>
        <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} onClick={() => setElbow("×")}>×</button>
      </div>

      <div style={card}>
        <p>💬 コメント</p>
        <input
          value={initialComment}
          onChange={(e) => setInitialComment(e.target.value)}
        />
      </div>

      <button
        style={saveBtn}
        onClick={handleSubmit}
        onMouseDown={press}
        onMouseUp={release}
        onMouseLeave={release}
      >
        保存
      </button>
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
  padding: 15,
  marginBottom: 10,
  borderRadius: 10,
};

const saveBtn = {
  padding: 15,
  width: "100%",
  background: "#4facfe",
  color: "white",
  border: "none",
  borderRadius: 10,
};

const homeBtn = {
  position: "fixed",
  top: 15,
  left: 15,
  padding: "12px",
  borderRadius: "50%",
  background: "#333",
  color: "white",
  border: "none",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};


