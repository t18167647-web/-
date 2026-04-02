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

  const saveItems=(data)=>{
    setItems(data);
    localStorage.setItem("items",JSON.stringify(data));
  };

  const deleteItem=(id)=>{
    if(!confirm("削除する？")) return;
    saveItems(items.filter(i=>i.id!==id));
  };

  const addComment=(id,text,author)=>{
    saveItems(items.map(i=>i.id===id?{...i,comments:[...(i.comments||[]),{text,author}]}:i));
  };

  return(
    <div style={page}>
      <Link href="/"><button>🏠</button></Link>

      {items.filter(i=>i.player===currentPlayer).map(item=>(
        <div key={item.id} style={card}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <p>{item.date}</p>
            <button onClick={()=>deleteItem(item.id)}>🗑</button>
          </div>

          <p>{item.count}球</p>

          <div>
            <span style={getConditionStyle(item.shoulder)}>肩:{item.shoulder}</span>
            <span style={getConditionStyle(item.elbow)}>肘:{item.elbow}</span>
          </div>

          {(item.comments||[]).map((c,i)=>(
            <div key={i} style={getCommentStyle(c.author)}>
              {c.author}:{c.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const getConditionStyle=(v)=>({
  background:v==="○"?"blue":v==="△"?"orange":"red",
  color:"white",
  padding:"5px",
  marginRight:5
});

const getCommentStyle=(a)=>{
  if(a==="宗田先生") return {background:"#ffe0e0"};
  if(a==="久保先生") return {background:"#e0ffe0"};
  return {background:"#e0f0ff"};
};

const page={padding:20};
const card={background:"white",padding:15,marginBottom:10};


