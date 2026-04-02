"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export default function Page() {
  const [items, setItems] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("players")) || [];

    setPlayers(savedPlayers);
    if (savedPlayers.length > 0) setCurrentPlayer(savedPlayers[0]);

    fetchData();
  }, []);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setItems(data);
  };

  const press = (e) => (e.currentTarget.style.transform = "scale(0.9)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  // 🔥 データ削除（Firebase）
  const deleteItem = async (id) => {
    if (!confirm("このデータ削除する？")) return;
    await deleteDoc(doc(db, "items", id));
    fetchData();
  };

  // 🔥 コメント追加
  const addComment = async (id, text, author) => {
    const item = items.find(i => i.id === id);
    const updated = [...(item.comments || []), { text, author }];

    await updateDoc(doc(db, "items", id), {
      comments: updated
    });

    fetchData();
  };

  // 🔥 コメント編集
  const editComment = async (id, index, newText) => {
    const item = items.find(i => i.id === id);
    const c = [...(item.comments || [])];
    c[index].text = newText;

    await updateDoc(doc(db, "items", id), {
      comments: c
    });

    fetchData();
  };

  // 🔥 コメント削除
  const deleteComment = async (id, index) => {
    const item = items.find(i => i.id === id);
    const updated = item.comments.filter((_, i) => i !== index);

    await updateDoc(doc(db, "items", id), {
      comments: updated
    });

    fetchData();
  };

  const changePlayer = (dir) => {
    const i = players.indexOf(currentPlayer);
    if (dir === "next") setCurrentPlayer(players[(i + 1) % players.length]);
    else setCurrentPlayer(players[(i - 1 + players.length) % players.length]);
  };

  return (
    <div style={page}>
      <Link href="/">
        <button style={homeBtn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
          🏠
        </button>
      </Link>

      <h1>📊 結果</h1>

      <div style={row}>
        <button style={arrowBtn} onClick={() => changePlayer("prev")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>←</button>
        <select value={currentPlayer} onChange={(e)=>setCurrentPlayer(e.target.value)}>
          {players.map(p=><option key={p}>{p}</option>)}
        </select>
        <button style={arrowBtn} onClick={() => changePlayer("next")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>→</button>
      </div>

      {items.filter(i=>i.player===currentPlayer).map(item=>(
        <Item
          key={item.id}
          item={item}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          deleteItem={deleteItem}
          press={press}
          release={release}
        />
      ))}
    </div>
  );
}

function Item({ item, addComment, editComment, deleteComment, deleteItem, press, release }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState(item.player);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>{item.date}</p>
        <button style={deleteBtn} onClick={()=>deleteItem(item.id)}>🗑</button>
      </div>

      <p>{item.count === 0 ? "0球（なし）" : `${item.count}球`}</p>

      <p style={{color:item.type==="試合"?"#f94144":item.type==="実践練習"?"#f8961e":"#4facfe"}}>
        {item.type}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <span style={getConditionStyle(item.shoulder)}>肩:{item.shoulder}</span>
        <span style={getConditionStyle(item.elbow)}>肘:{item.elbow}</span>
      </div>

      <div style={{background:"#eef",padding:8,borderRadius:8,marginTop:5}}>
        💬 {item.initialComment}
      </div>

      <div style={{ marginTop: 10 }}>
        <select value={author} onChange={(e)=>setAuthor(e.target.value)}>
          <option value={item.player}>{item.player}</option>
          <option value="宗田先生">宗田先生</option>
          <option value="久保先生">久保先生</option>
        </select>

        <input value={text} onChange={(e)=>setText(e.target.value)} />

        <button style={sendBtn} onClick={()=>{
          if(!text) return;
          addComment(item.id,text,author);
          setText("");
        }}>
          送信
        </button>
      </div>

      {(item.comments || []).map((c, i) => (
        <div key={i} style={{...getCommentStyle(c.author),padding:8,marginTop:5,borderRadius:10}}>
          {editIndex===i ? (
            <>
              <input value={editText} onChange={(e)=>setEditText(e.target.value)} />
              <button onClick={()=>{editComment(item.id,i,editText);setEditIndex(null);}}>保存</button>
            </>
          ) : (
            <>
              <b>{c.author}</b>：{c.text}
              <div>
                <button onClick={()=>{setEditIndex(i);setEditText(c.text);}}>✏️</button>
                <button onClick={()=>deleteComment(item.id,i)}>🗑</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* スタイル（一切変更なし） */
const page={padding:20,minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#f7971e)"};
const card={background:"white",padding:15,marginBottom:15,borderRadius:15};
const homeBtn={position:"fixed",top:15,left:15};
const row={display:"flex",gap:10};
const arrowBtn={background:"#eee",borderRadius:10,padding:"5px 10px"};
const deleteBtn={background:"#f94144",color:"white",border:"none",borderRadius:8};
const sendBtn={background:"#4facfe",color:"white",border:"none",borderRadius:8,padding:"5px 10px"};

const getConditionStyle=(v)=>({
  background:v==="○"?"#4facfe":v==="△"?"#f9c74f":"#f94144",
  color:"white",
  padding:"5px 10px",
  borderRadius:10
});

const getCommentStyle=(a)=>{
  if(a==="宗田先生") return {background:"#ffe0e0",borderLeft:"5px solid #f94144"};
  if(a==="久保先生") return {background:"#e0ffe0",borderLeft:"5px solid #43aa8b"};
  return {background:"#e0f0ff",borderLeft:"5px solid #4facfe"};
};

