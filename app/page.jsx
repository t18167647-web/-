"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={page}>
      <h1 style={{marginBottom:30}}>投手管理</h1>

      <Link href="/input">
        <button style={mainBtn}>✏️ 入力する</button>
      </Link>

      <Link href="/table">
        <button style={mainBtn}>📊 結果を見る</button>
      </Link>
    </div>
  );
}

const page={
  padding:20,
  minHeight:"100vh",
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  background:"linear-gradient(135deg,#667eea,#f7971e)"
};

const mainBtn={
  width:"100%",
  padding:"20px",
  fontSize:"18px",
  borderRadius:"20px",
  border:"none",
  background:"linear-gradient(135deg,#4facfe,#43e97b)",
  color:"white",
  marginBottom:"15px",
  boxShadow:"0 6px 15px rgba(0,0,0,0.2)"
};


