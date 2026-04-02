"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
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
    <div style={page}>
      <Link href="/">
        <button style={homeBtn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>🏠</button>
      </Link>

      <h1>✏️ 入力</h1>

      <div style={card}>
        <p>📅 日付</p>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
      </div>

      <div style={card}>
        <p>👤 選手</p>

        <div style={row}>
          <button style={arrowBtn} onClick={()=>changePlayer("prev")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>←</button>

          <select value={player} onChange={(e)=>setPlayer(e.target.value)}>
            <option value="">選択</option>
            {players.map(p=><option key={p}>{p}</option>)}
          </select>

          <button style={arrowBtn} onClick={()=>changePlayer("next")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>→</button>
        </div>

        <div onClick={()=>setShowManage(!showManage)} style={toggleHeader}>
          👥 選手管理 {showManage ? "▲" : "▼"}
        </div>

        {showManage && (
          <>
            <div style={{display:"flex",gap:5}}>
              <input value={newPlayer} onChange={(e)=>setNewPlayer(e.target.value)} style={inputSmall}/>
              <button onClick={addPlayer}>追加</button>
            </div>

            {players.map(p=>(
              <div key={p} style={playerRow}>
                {p}
                <button onClick={()=>deletePlayer(p)}>✕</button>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={card}>
        <p>⚾ 投球タイプ</p>
        <select value={type} onChange={(e)=>setType(e.target.value)} style={selectStyle}>
          <option value="">選択</option>
          <option>ブルペン</option>
          <option>実践練習</option>
          <option>試合</option>
        </select>
      </div>

      <div style={card}>
        <p>球数（未入力OK）</p>
        <input type="number" value={count} onChange={(e)=>setCount(e.target.value)} />
      </div>

      <div style={card}>
        <p>💪 コンディション</p>

        <p>肩</p>
        <div style={btnGroup}>
          {["○","△","×"].map(v=>(
            <button
              key={v}
              onClick={()=>setShoulder(v)}
              style={{
                ...circleBtn,
                background: shoulder===v ? (v==="○"?"#4facfe":v==="△"?"#f9c74f":"#f94144") : "#eee",
                color: shoulder===v ? "white":"black",
                transform: shoulder===v ? "scale(1.1)" : "scale(1)"
              }}
              onMouseDown={press}
              onMouseUp={release}
              onMouseLeave={release}
            >
              {v}
            </button>
          ))}
        </div>

        <p>肘</p>
        <div style={btnGroup}>
          {["○","△","×"].map(v=>(
            <button
              key={v}
              onClick={()=>setElbow(v)}
              style={{
                ...circleBtn,
                background: elbow===v ? (v==="○"?"#4facfe":v==="△"?"#f9c74f":"#f94144") : "#eee",
                color: elbow===v ? "white":"black",
                transform: elbow===v ? "scale(1.1)" : "scale(1)"
              }}
              onMouseDown={press}
              onMouseUp={release}
              onMouseLeave={release}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <input
          value={initialComment}
          onChange={(e)=>setInitialComment(e.target.value)}
          placeholder="コメント"
          style={{width:"100%",padding:10}}
        />
      </div>

      <button style={saveBtn} onClick={handleSubmit}>保存</button>
    </div>
  );
}

/* スタイル（完全そのまま） */
const page={padding:20,minHeight:"100vh",background:"linear-gradient(135deg,#4facfe,#43e97b)"};
const card={background:"white",padding:15,marginBottom:15,borderRadius:15,boxShadow:"0 6px 15px rgba(0,0,0,0.15)"};
const saveBtn={padding:15,width:"100%",background:"linear-gradient(135deg,#36d1dc,#5b86e5)",color:"white",border:"none",borderRadius:15};
const homeBtn={position:"fixed",top:15,left:15};
const row={display:"flex",gap:10};
const arrowBtn={background:"#f0f0f0",border:"none",borderRadius:10,padding:"8px 12px"};
const toggleHeader={cursor:"pointer",fontWeight:"bold"};
const inputSmall={flex:1};
const playerRow={display:"flex",justifyContent:"space-between"};
const selectStyle={width:"100%",padding:10,borderRadius:10};
const btnGroup={display:"flex",justifyContent:"space-around"};
const circleBtn={width:60,height:60,borderRadius:"50%",border:"none",fontSize:18,fontWeight:"bold",boxShadow:"0 3px 8px rgba(0,0,0,0.2)",transition:"all 0.1s"};
