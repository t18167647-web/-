"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={container}>
      <h1 style={title}>⚾ 投手管理アプリ</h1>
      <p style={{ marginBottom: 30 }}>肩・肘・球数をしっかり管理</p>

      <Link href="/input">
        <button style={btn}>✏️ 入力する</button>
      </Link>

      <Link href="/table">
        <button style={btn}>📊 結果を見る</button>
      </Link>
    </div>
  );
}

const container = {
  height: "100vh",
  background: "linear-gradient(to bottom, #4facfe, #00f2fe)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const title = {
  fontSize: 30,
};

const btn = {
  margin: 10,
  padding: "12px 20px",
  fontSize: 16,
  borderRadius: 10,
  border: "none",
};
