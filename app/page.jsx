"use client";
import Link from "next/link";

export default function Home() {
  const press = (e) => {
    e.currentTarget.style.transform = "scale(0.9)";
  };

  const release = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div style={container}>
      <h1 style={title}>⚾ 投手管理アプリ</h1>
      <p>肩・肘・球数を管理</p>

      <Link href="/input">
        <button
          style={btn}
          onMouseDown={press}
          onMouseUp={release}
          onMouseLeave={release}
        >
          ✏️ 入力する
        </button>
      </Link>

      <Link href="/table">
        <button
          style={btn}
          onMouseDown={press}
          onMouseUp={release}
          onMouseLeave={release}
        >
          📊 結果を見る
        </button>
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
  padding: "15px 25px",
  fontSize: 18,
  borderRadius: 10,
  border: "none",
  background: "white",
  color: "#333",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};
