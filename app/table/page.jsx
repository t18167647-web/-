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

  const deleteItem = async (id) => {
    if (!confirm("このデータ削除する？")) return;
    await deleteDoc(doc(db, "items", id));
    fetchData();
  };

  const addComment = async (id, text, author) => {
    const item = items.find(i => i.id === id);
    const updated = [...(item.comments || []), { text, author }];

    await updateDoc(doc(db, "items", id), {
      comments: updated
    });

    fetchData();
  };

  const editComment = async (id, index, newText) => {
    const item = items.find(i => i.id === id);
    const c = [...(item.comments || [])];
    c[index].text = newText;

    await updateDoc(doc(db, "items", id), {
      comments: c
    });

    fetchData();
  };

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

  // 🔥 週間投球数（月曜リセット）
  const getWeeklyCount = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0,0,0,0);

    return items
      .filter(i => i.player === currentPlayer)
      .filter(i => new Date(i.date) >= monday)
      .reduce((sum, i) => sum + (i.count || 0), 0);
  };

  const weekly = getWeeklyCount();

  return (
    <div style={page}>
      <Link href="/">
        <button style={homeBtn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>🏠</button>
      </Link>

      <h1>📊 結果</h1>

      {/* 週間投球数 */}
      <div style={{
        background:"white",
        padding:10,
        borderRadius:10,
        marginBottom:10,
        textAlign:"center",
        fontWeight:"bold",
        color: weekly > 300 ? "#f94144" : "#333"
      }}>
        今週の投球数：{weekly}球
      </div>

      {/* 選手切替 */}
      <div style={row}>
        <button style={arrowBtn} onClick={() => changePlayer("prev")} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>←</button>
        <select value={currentPlayer} onChange={(e)=>setCurrentPlayer(e.target.value)} style={{fontSize:"16px"}}>
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

  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [showManage, setShowManage] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("authors"));
    if (saved) setAuthors(saved);
    else {
      const init = ["宗田先生","久保先生"];
      localStorage.setItem("authors", JSON.stringify(init));
      setAuthors(init);
    }
  }, []);

  const saveAuthors = (list) => {
    setAuthors(list);
    localStorage.setItem("authors", JSON.stringify(list));
  };

  const addAuthor = () => {
    if (!newAuthor || authors.includes(newAuthor)) return;
    saveAuthors([...authors, newAuthor]);
    setNewAuthor("");
  };

  const deleteAuthor = (name) => {
    saveAuthors(authors.filter(a=>a!==name));
    if (author === name) setAuthor(item.player);
  };

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

      <div style={{ display: "flex", gap: 6 }}>
        <span style={getConditionStyle(item.shoulder)}>肩:{item.shoulder}</span>
        <span style={getConditionStyle(item.elbow)}>肘:{item.elbow}</span>
      </div>

      <div style={{background:"#eef",padding:6,borderRadius:8,marginTop:4}}>
        💬 {item.initialComment}
      </div>

      {/* 投稿 */}
      <div style={{ marginTop: 8 }}>
        <select value={author} onChange={(e)=>setAuthor(e.target.value)} style={{fontSize:"16px"}}>
          <option value={item.player}>{item.player}</option>
          {authors.map(a=><option key={a}>{a}</option>)}
        </select>

        <input value={text} onChange={(e)=>setText(e.target.value)} style={{fontSize:"16px"}} />

        <button style={sendBtn} onClick={()=>{
          if(!text) return;
          addComment(item.id,text,author);
          setText("");
        }}>
          送信
        </button>
      </div>

      {/* 作者管理 */}
      <div onClick={()=>setShowManage(!showManage)} style={{marginTop:5,cursor:"pointer"}}>
        👥 コメントする人管理 {showManage ? "▲" : "▼"}
      </div>

      {showManage && (
        <>
          <div style={{display:"flex",gap:5}}>
            <input value={newAuthor} onChange={(e)=>setNewAuthor(e.target.value)} style={{fontSize:"16px"}} />
            <button onClick={addAuthor}>追加</button>
          </div>

          {authors.map(a=>(
            <div key={a} style={{display:"flex",justifyContent:"space-between"}}>
              {a}
              <button onClick={()=>deleteAuthor(a)}>✕</button>
            </div>
          ))}
        </>
      )}

      {/* コメント一覧 */}
      {(item.comments || []).map((c, i) => (
        <div key={i} style={{...getCommentStyle(c.author),padding:6,marginTop:4,borderRadius:10}}>
          {editIndex===i ? (
            <>
              <input value={editText} onChange={(e)=>setEditText(e.target.value)} style={{fontSize:"16px"}} />
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

/* スタイル */
const page={padding:20,minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#f7971e)"};
const card={background:"white",padding:10,marginBottom:8,borderRadius:10};
const homeBtn={position:"fixed",top:15,left:15};
const row={display:"flex",gap:8};
const arrowBtn={background:"#eee",borderRadius:10,padding:"5px 10px"};
const deleteBtn={background:"#f94144",color:"white",border:"none",borderRadius:8};
const sendBtn={background:"#4facfe",color:"white",border:"none",borderRadius:8,padding:"5px 10px"};

const getConditionStyle=(v)=>({
  background:v==="○"?"#4facfe":v==="△"?"#f9c74f":"#f94144",
  color:"white",
  padding:"4px 8px",
  borderRadius:10
});

const getCommentStyle=(a)=>{
  if(a==="宗田先生") return {background:"#ffe0e0",borderLeft:"5px solid #f94144"};
  if(a==="久保先生") return {background:"#e0ffe0",borderLeft:"5px solid #43aa8b"};
  return {background:"#e0f0ff",borderLeft:"5px solid #4facfe"};
};
