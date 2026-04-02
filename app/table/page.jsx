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

  const saveItems=(data)=>{
    setItems(data);
    localStorage.setItem("items",JSON.stringify(data));
  };

  const addComment=(id,text,author)=>{
    const updated=items.map(i=>{
      if(i.id===id){
        return {...i,comments:[...(i.comments||[]),{text,author}]};
      }
      return i;
    });
    saveItems(updated);
  };

  const editComment=(id,index,newText)=>{
    const updated=items.map(i=>{
      if(i.id===id){
        const c=[...i.comments];
        c[index].text=newText;
        return {...i,comments:c};
      }
      return i;
    });
    saveItems(updated);
  };

  const deleteComment=(id,index)=>{
    const updated=items.map(i=>{
      if(i.id===id){
        return {...i,comments:i.comments.filter((_,j)=>j!==index)};
      }
      return i;
    });
    saveItems(updated);
  };

  const changePlayer=(dir)=>{
    const i=players.indexOf(currentPlayer);
    if(dir==="next") setCurrentPlayer(players[(i+1)%players.length]);
    else setCurrentPlayer(players[(i-1+players.length)%players.length]);
  };

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

      {items.filter(i=>i.player===currentPlayer).map(item=>(
        <Item key={item.id} item={item} addComment={addComment} editComment={editComment} deleteComment={deleteComment} press={press} release={release}/>
      ))}
    </div>
  );
}

function Item({item,addComment,editComment,deleteComment,press,release}){
  const [text,setText]=useState("");
  const [author,setAuthor]=useState(item.player);
  const [editIndex,setEditIndex]=useState(null);
  const [editText,setEditText]=useState("");

  return(
    <div style={card}>
      <p>{item.date}</p>
      <p>{item.count}球</p>
      <p style={{color:item.type==="試合"?"red":item.type==="実践練習"?"orange":"blue"}}>{item.type}</p>
      <p>肩:{item.shoulder} 肘:{item.elbow}</p>

      <div>💬 {item.initialComment}</div>

      <select value={author} onChange={(e)=>setAuthor(e.target.value)}>
        <option value={item.player}>{item.player}</option>
        <option value="宗田先生">宗田先生</option>
        <option value="久保先生">久保先生</option>
      </select>

      <input value={text} onChange={(e)=>setText(e.target.value)} />

      <button onClick={()=>{if(!text)return;addComment(item.id,text,author);setText("");}} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
        送信
      </button>

      {(item.comments||[]).map((c,i)=>(
        <div key={i} style={{background:"#eee",marginTop:5,padding:5}}>
          {editIndex===i?(
            <>
              <input value={editText} onChange={(e)=>setEditText(e.target.value)}/>
              <button onClick={()=>{editComment(item.id,i,editText);setEditIndex(null);}}>保存</button>
            </>
          ):(
            <>
              {c.author}：{c.text}
              <button onClick={()=>{setEditIndex(i);setEditText(c.text);}}>✏️</button>
              <button onClick={()=>deleteComment(item.id,i)}>🗑</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const page={padding:20,minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#f7971e)"};
const card={background:"white",padding:15,marginBottom:15,borderRadius:15};
const homeBtn={position:"fixed",top:15,left:15};
const row={display:"flex",gap:10};

