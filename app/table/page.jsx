"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

  const saveToLocal = (data) => {
    localStorage.setItem("items", JSON.stringify(data));
  };

  const handleAddComment = (id, text, author) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          comments: [...(item.comments || []), { text, author }],
        };
      }
      return item;
    });

    setItems(updated);
    saveToLocal(updated);
  };

  const press = (e) => {
    e.currentTarget.style.transform = "scale(0.9)";
  };

  const release = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

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
      {/* 🏠 ホームボタン */}
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

      <h1>📊 結果ページ</h1>

      {/* 選手 */}
      <select
        value={currentPlayer}
        onChange={(e) => setCurrentPlayer(e.target.value)}
      >
        {players.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {/* 球数 */}
      <p style={{ color: weeklyTotal >= 300 ? "red" : "black" }}>
        今週の球数: {weeklyTotal}球
        {weeklyTotal >= 300 && " ⚠ 投げすぎ注意"}
      </p>

      {/* データ */}
      {filtered.map((item) => (
        <Item
          key={item.id}
          data={item}
          onAddComment={handleAddComment}
          press={press}
          release={release}
        />
      ))}
    </div>
  );
}

function Item({ data, onAddComment, press, release }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("選手");

  return (
    <div style={card}>
      <p style={{ color: "gray" }}>{data.date}</p>
      <h3>{data.player}</h3>

      <p>⚾ {data.count}球</p>
      <p>{data.type}</p>
      <p>肩:{data.shoulder} / 肘:{data.elbow}</p>

      <div style={initComment}>
        💬 {data.initialComment}
      </div>

      {/* 入力 */}
      <div>
        <select value={author} onChange={(e) => setAuthor(e.target.value)}>
          <option>選手</option>
          <option>指導者</option>
        </select>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => {
            if (!text) return;
            onAddComment(data.id, text, author);
            setText("");
          }}
          onMouseDown={press}
          onMouseUp={release}
          onMouseLeave={release}
        >
          送信
        </button>
      </div>

      {/* コメント */}
      {(data.comments || []).map((c, i) => (
        <div
          key={i}
          style={{
            background:
              c.author === "指導者" ? "#ffe0e0" : "#e0f0ff",
            padding: 8,
            marginTop: 5,
            borderRadius: 10,
          }}
        >
          {c.author}：{c.text}
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
  padding: 15,
  marginBottom: 15,
  borderRadius: 10,
};

const initComment = {
  background: "#eef",
  padding: 8,
  borderRadius: 5,
  marginTop: 10,
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

