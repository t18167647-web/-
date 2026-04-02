"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [items, setItems] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    setPlayers(savedPlayers);
    if (savedPlayers.length > 0) setCurrentPlayer(savedPlayers[0]);

    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "items"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{padding:20}}>
      <Link href="/">
        <button>🏠</button>
      </Link>

      <h1>結果ページ</h1>

      <select value={currentPlayer} onChange={(e)=>setCurrentPlayer(e.target.value)}>
        {players.map(p=><option key={p}>{p}</option>)}
      </select>

      {items.filter(i=>i.player===currentPlayer).map(item=>(
        <div key={item.id} style={{border:"1px solid #ccc",margin:10,padding:10}}>
          <p>{item.date}</p>
          <p>{item.count}球</p>
          <p>{item.type}</p>
          <p>肩:{item.shoulder} / 肘:{item.elbow}</p>
          <p>{item.initialComment}</p>
        </div>
      ))}
    </div>
  );
}

