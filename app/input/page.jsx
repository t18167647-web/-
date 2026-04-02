"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function InputPage() {
  const [loading, setLoading] = useState(false);

  const [player, setPlayer] = useState("熊");
  const [pitchType, setPitchType] = useState("ブルペン");
  const [pitchCount, setPitchCount] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [elbow, setElbow] = useState("");
  const [comment, setComment] = useState("");

  const handleSave = async () => {
    if (!pitchCount) {
      alert("球数を入力して");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "pitch_data"), {
        player,
        pitchType,
        pitchCount: Number(pitchCount),
        shoulder,
        elbow,
        comment,
        createdAt: new Date()
      });

      alert("保存成功！");

      setPitchCount("");
      setComment("");
      setShoulder("");
      setElbow("");

    } catch (e) {
      console.error(e);
      alert("エラー：" + e.message);
    }

    setLoading(false);
  };

  const Button = ({ value, state, setState }) => {
    const color =
      value === "〇" ? "blue" : value === "△" ? "orange" : "red";

    return (
      <button
        onClick={() => setState(value)}
        style={{
          margin: 5,
          padding: 10,
          background: state === value ? color : "#eee",
          color: state === value ? "white" : "black",
          border: "none",
          borderRadius: 5
        }}
      >
        {value}
      </button>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>入力ページ</h1>

      <Link href="/">← ホームに戻る</Link>

      <div>
        <p>選手</p>
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          <option>熊</option>
          <option>坂田</option>
          <option>末永</option>
          <option>五島</option>
          <option>松尾</option>
        </select>
      </div>

      <div>
        <p>投球タイプ</p>
        <select value={pitchType} onChange={(e) => setPitchType(e.target.value)}>
          <option>ブルペン</option>
          <option>実践練習</option>
          <option>試合</option>
        </select>
      </div>

      <div>
        <p>球数</p>
        <input
          type="number"
          value={pitchCount}
          onChange={(e) => setPitchCount(e.target.value)}
        />
      </div>

      <div>
        <p>肩</p>
        <Button value="〇" state={shoulder} setState={setShoulder} />
        <Button value="△" state={shoulder} setState={setShoulder} />
        <Button value="×" state={shoulder} setState={setShoulder} />
      </div>

      <div>
        <p>肘</p>
        <Button value="〇" state={elbow} setState={setElbow} />
        <Button value="△" state={elbow} setState={setElbow} />
        <Button value="×" state={elbow} setState={setElbow} />
      </div>

      <div>
        <p>コメント</p>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button onClick={handleSave} disabled={loading}>
        {loading ? "保存中..." : "保存"}
      </button>
    </div>
  );
}