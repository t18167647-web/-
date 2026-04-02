"use client";
import { useState, useEffect } from "react";

export default function InputPage() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [player, setPlayer] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [elbow, setElbow] = useState("");
  const [initialComment, setInitialComment] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("players"));
    if (saved) {
      setPlayers(saved);
    } else {
      const initial = ["熊", "坂田", "末永", "五島", "松尾"];
      localStorage.setItem("players", JSON.stringify(initial));
      setPlayers(initial);
    }
  }, []);

  const savePlayers = (list) => {
    setPlayers(list);
    localStorage.setItem("players", JSON.stringify(list));
  };

  const addPlayer = () => {
    if (!newPlayer) return;
    savePlayers([...players, newPlayer]);
    setNewPlayer("");
  };

  const deletePlayer = (name) => {
    savePlayers(players.filter((p) => p !== name));
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
      date: new Date().toLocaleString(),
      comments: [],
    };

    const existing = JSON.parse(localStorage.getItem("items")) || [];
    localStorage.setItem("items", JSON.stringify([...existing, newItem]));

    alert("保存成功！");
  };

  return (
    <div style={page}>
      <h1>✏️ 入力ページ</h1>

      <div style={card}>
        <p>👤 選手</p>
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          <option value="">選択</option>
          {players.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <div>
          <input
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="選手追加"
          />
          <button onClick={addPlayer}>追加</button>
        </div>

        {players.map((p) => (
          <div key={p}>
            {p} <button onClick={() => deletePlayer(p)}>削除</button>
          </div>
        ))}
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
        <button style={{ background: "blue", color: "white" }} onClick={() => setShoulder("○")}>○</button>
        <button style={{ background: "gold" }} onClick={() => setShoulder("△")}>△</button>
        <button style={{ background: "red", color: "white" }} onClick={() => setShoulder("×")}>×</button>

        <p>肘</p>
        <button style={{ background: "blue", color: "white" }} onClick={() => setElbow("○")}>○</button>
        <button style={{ background: "gold" }} onClick={() => setElbow("△")}>△</button>
        <button style={{ background: "red", color: "white" }} onClick={() => setElbow("×")}>×</button>
      </div>

      <div style={card}>
        <p>💬 初期コメント</p>
        <input
          value={initialComment}
          onChange={(e) => setInitialComment(e.target.value)}
        />
      </div>

      <button style={saveBtn} onClick={handleSubmit}>
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


