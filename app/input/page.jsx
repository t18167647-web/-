"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function InputPage() {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [elbow, setElbow] = useState("");
  const [initialComment, setInitialComment] = useState("");
  const [date, setDate] = useState("");
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("players"));
    if (saved) setPlayers(saved);
    else {
      const initial = ["熊","坂田","末永","五島","松尾"];
      localStorage.setItem("players", JSON.stringify(initial));
      setPlayers(initial);
    }
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const savePlayers = (list) => {
    setPlayers(list);
    localStorage.setItem("players", JSON.stringify(list));
  };

  const addPlayer = () => {
    if (!newPlayer || players.includes(newPlayer)) return;
    savePlayers([...players, newPlayer]);
    setNewPlayer("");
  };

  const deletePlayer = (name) => {
    const updated = players.filter((p) => p !== name);
    savePlayers(updated);
    if (player === name) setPlayer(updated[0] || "");
  };

  const changePlayer = (dir) => {
    const i = players.indexOf(player);
    if (i === -1) return;
    if (dir === "next") setPlayer(players[(i + 1) % players.length]);
    else setPlayer(players[(i - 1 + players.length) % players.length]);
  };

  const handleSubmit = async () => {
    if (!player) return alert("選手選んで");

    await addDoc(collection(db, "items"), {
      player,
      type,
      count: Number(count) || 0,
      shoulder,
      elbow,
      initialComment,
      date,
      comments: [],
      createdAt: new Date(),
    });

    alert("保存成功！");
  };

  return (
    <div style={{padding:20}}>
      <Link href="/"><button>🏠</button></Link>
      <h1>入力ページ</h1>

      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

      <div>
        <button onClick={()=>changePlayer("prev")}>←</button>
        <select value={player} onChange={(e)=>setPlayer(e.target.value)}>
          <option value="">選択</option>
          {players.map(p=><option key={p}>{p}</option>)}
        </select>
        <button onClick={()=>changePlayer("next")}>→</button>
      </div>

      <input value={newPlayer} onChange={(e)=>setNewPlayer(e.target.value)} placeholder="追加"/>
      <button onClick={addPlayer}>追加</button>

      {players.map(p=>(
        <div key={p}>
          {p}
          <button onClick={()=>deletePlayer(p)}>削除</button>
        </div>
      ))}

      <select value={type} onChange={(e)=>setType(e.target.value)}>
        <option value="">選択</option>
        <option>ブルペン</option>
        <option>実践練習</option>
        <option>試合</option>
      </select>

      <input type="number" value={count} onChange={(e)=>setCount(e.target.value)} placeholder="球数"/>

      <div>
        肩:
        {["○","△","×"].map(v=>(
          <button key={v} onClick={()=>setShoulder(v)}>{v}</button>
        ))}
      </div>

      <div>
        肘:
        {["○","△","×"].map(v=>(
          <button key={v} onClick={()=>setElbow(v)}>{v}</button>
        ))}
      </div>

      <input value={initialComment} onChange={(e)=>setInitialComment(e.target.value)} placeholder="コメント"/>

      <button onClick={handleSubmit}>保存</button>
    </div>
  );
}
