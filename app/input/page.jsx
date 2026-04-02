"use client";
import { useState } from "react";

export default function InputPage() {
  const [player, setPlayer] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [elbow, setElbow] = useState("");

  const handleSubmit = () => {
    if (!player || !type || !count) {
      alert("必須項目を入力してください");
      return;
    }

    const newItem = {
      id: Date.now(),
      player,
      type,
      count: Number(count),
      shoulder: shoulder === "○",
      elbow: elbow === "○",
      comments: [], // ←ここ超重要
    };

    const existing = JSON.parse(localStorage.getItem("items")) || [];
    const updated = [...existing, newItem];

    localStorage.setItem("items", JSON.stringify(updated));

    alert("保存成功！");

    // 入力リセット
    setPlayer("");
    setType("");
    setCount("");
    setShoulder("");
    setElbow("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>入力ページ</h1>

      <div>
        <p>選手</p>
        <input value={player} onChange={(e) => setPlayer(e.target.value)} />
      </div>

      <div>
        <p>投球タイプ</p>
        <input value={type} onChange={(e) => setType(e.target.value)} />
      </div>

      <div>
        <p>球数</p>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </div>

      <div>
        <p>肩</p>
        <button onClick={() => setShoulder("○")}>○</button>
        <button onClick={() => setShoulder("△")}>△</button>
        <button onClick={() => setShoulder("×")}>×</button>
      </div>

      <div>
        <p>肘</p>
        <button onClick={() => setElbow("○")}>○</button>
        <button onClick={() => setElbow("△")}>△</button>
        <button onClick={() => setElbow("×")}>×</button>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        保存
      </button>
    </div>
  );
}

