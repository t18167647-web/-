"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const [items,setItems]=useState([]);
  const [players,setPlayers]=useState([]);
  const [currentPlayer,setCurrentPlayer]=useState("");

  useEffect(()=>{
    setItems(JSON.parse(localStorage.getItem("items"))||[]);
    const p=JSON.parse(localStorage.getItem("players"))||[];
    setPlayers(p);
    if(p.length>0) setCurrentPlayer(p[0]);
  },[]);

  const press=(e)=>e.currentTarget.style.transform="scale(0.9)";
  const release=(e)=>e.currentTarget.style.transform="scale(1)";

  const changePlayer=(dir)=>{
    const i=players.indexOf(currentPlayer);
    if(dir==="next") setCurrentPlayer(players[(i+1)%players.length]);
    else setCurrentPlayer(players[(i-1+players.length)%players.length]);
  };

  const filtered=items.filter(i=>i.player===currentPlayer);

  return(
    <div style={page}>
      <Link href="/"><button style={homeBtn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>🏠</button></Link>

      <h1>📊 結果</h1>

      <div style={row}>
        <button onClick={()=>changePlayer("prev")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>←</button>
        <select value={currentPlayer} onChange={(e)=>setCurrentPlayer(e.target.value)}>
          {players.map(p=><option key={p}>{p}</option>)}
        </select>
        <button onClick={()=>changePlayer("next")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>→</button>
      </div>

      {filtered.map(item=>(
        <div key={item.id} style={card}>
          <p>{item.date}</p>
          <p>{item.count}球</p>
          <p style={{color:item.type==="試合"?"red":item.type==="実践練習"?"orange":"blue"}}>{item.type}</p>
          <p>肩:{item.shoulder} 肘:{item.elbow}</p>
          <p>{item.initialComment}</p>
        </div>
      ))}
    </div>
  );
}

const page={padding:20,background:"#f5f5f5",minHeight:"100vh"};
const card={background:"white",padding:15,marginBottom:10,borderRadius:10};
const homeBtn={position:"fixed",top:15,left:15,background:"#333",color:"white",borderRadius:"50%",padding:12,boxShadow:"0 4px 10px rgba(0,0,0,0.3)"};
const row={display:"flex",gap:10};
