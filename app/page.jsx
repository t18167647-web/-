import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>投手管理アプリ</h1>

      <div style={{ marginTop: 20 }}>
        <Link href="/input">▶ 入力ページへ</Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link href="/table">▶ 結果ページへ</Link>
      </div>
    </div>
  );
}