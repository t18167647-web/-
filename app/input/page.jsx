"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

  const press = (e) => (e.currentTarget.style.transform = "scale(0.9)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

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
    const index = players.indexOf(player);
    if (index === -1) return;
    if (dir === "next") setPlayer(players[(index + 1) % players.length]);
    else setPlayer(players[(index - 1 + players.length) % players.length]);
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
      <Link href="/">
        <button style={homeBtn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>🏠</button>
      </Link>

      <h1>✏️ 入力ページ</h1>

      <div style={card}>
        <p>📅 日付</p>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div style={card}>
        <p>👤 選手</p>
        <div style={row}>
          <button onClick={() => changePlayer("prev")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>←</button>
          <select value={player} onChange={(e)=>setPlayer(e.target.value)}>
            <option value="">選択</option>
            {players.map(p=><option key={p}>{p}</option>)}
          </select>
          <button onClick={() => changePlayer("next")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>→</button>
        </div>

        <input value={newPlayer} onChange={(e)=>setNewPlayer(e.target.value)} placeholder="追加"/>
        <button onClick={addPlayer} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>追加</button>

        {players.map(p=>(
          <div key={p}>{p}
            <button onClick={()=>deletePlayer(p)} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>削除</button>
          </div>
        ))}
      </div>

      <div style={card}>
        <p>⚾ 投球タイプ</p>
        {["ブルペン","実践練習","試合"].map(t=>(
          <button key={t} onClick={()=>setType(t)} style={{
            background:type===t? (t==="試合"?"red":t==="実践練習"?"orange":"blue"):"#eee",
            color:type===t?"white":"black"
          }} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>{t}</button>
        ))}
      </div>

      <div style={card}>
        <p>球数</p>
        <input type="number" value={count} onChange={(e)=>setCount(e.target.value)} />
      </div>

      <div style={card}>
        <p>肩・肘</p>
        {["○","△","×"].map(v=>(
          <button key={v} onClick={()=>setShoulder(v)} style={{
            background:shoulder===v?(v==="○"?"blue":v==="△"?"gold":"red"):"#eee"
          }} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>{v}</button>
        ))}
        {["○","△","×"].map(v=>(
          <button key={v} onClick={()=>setElbow(v)} style={{
            background:elbow===v?(v==="○"?"blue":v==="△"?"gold":"red"):"#eee"
          }} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>{v}</button>
        ))}
      </div>

      <div style={card}>
        <input value={initialComment} onChange={(e)=>setInitialComment(e.target.value)} placeholder="コメント"/>
      </div>

      <button style={saveBtn} onClick={handleSubmit} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>保存</button>
    </div>
  );
}

const page={padding:20,background:"#f5f5f5",minHeight:"100vh"};
const card={background:"white",padding:15,marginBottom:10,borderRadius:10};
const saveBtn={padding:15,width:"100%",background:"#4facfe",color:"white",border:"none"};
const homeBtn={position:"fixed",top:15,left:15,background:"#333",color:"white",borderRadius:"50%",padding:12,boxShadow:"0 4px 10px rgba(0,0,0,0.3)"};
const row={display:"flex",gap:10};
