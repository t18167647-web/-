"use client";
import Link from "next/link";

export default function Home() {
  const press = (e) => (e.currentTarget.style.transform = "scale(0.9)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  return (
    <div style={container}>
      <h1 style={title}>⚾ 投手管理</h1>

      <Link href="/input">
        <button style={btn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
          ✏️ 入力
        </button>
      </Link>

      <Link href="/table">
        <button style={btn} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
          📊 結果
        </button>
      </Link>
    </div>
  );
}

const container = {
  height: "100vh",
  background: "linear-gradient(135deg, #4facfe, #43e97b)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const title = {
  fontSize: 34,
  fontWeight: "bold",
  marginBottom: 30,
};

const btn = {
  margin: 10,
  padding: "15px 25px",
  fontSize: 18,
  borderRadius: 15,
  border: "none",
  background: "white",
  color: "#333",
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
};
