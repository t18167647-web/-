"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import Link from "next/link";

export default function TablePage() {
  const [data, setData] = useState([]);
  const [player, setPlayer] = useState("熊");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "pitch_data"));
    const list = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    setData(list);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "pitch_data", id));
    fetchData();
  };

  const handleCommentSave = async (id, comment) => {
    await updateDoc(doc(db, "pitch_data", id), {
      coachComment: comment
    });
    fetchData();
  };

  const players = ["熊", "坂田", "末永", "五島", "松尾"];
  const filtered = data.filter((d) => d.player === player);

  const getColor = (v) => {
    if (v === "〇") return "blue";
    if (v === "△") return "orange";
    if (v === "×") return "red";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>結果ページ</h1>

      <Link href="/">← ホームに戻る</Link>

      <div style={{ marginTop: 10 }}>
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          {players.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        {filtered.map((d) => (
          <Item
            key={d.id}
            data={d}
            onDelete={handleDelete}
            onSave={handleCommentSave}
            getColor={getColor}
          />
        ))}
      </div>
    </div>
  );
}

/* 1件ごとの表示 */
function Item({ data, onDelete, onSave, getColor }) {
  const [comment, setComment] = useState(data.coachComment || "");

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 10
      }}
    >
      <div>球数: {data.pitchCount}</div>
      <div>種類: {data.pitchType}</div>

      <div>
        肩:
        <span style={{ color: getColor(data.shoulder) }}>
          {data.shoulder}
        </span>
        {" / "}
        肘:
        <span style={{ color: getColor(data.elbow) }}>
          {data.elbow}
        </span>
      </div>

      <div>コメント: {data.comment}</div>

      {/* 指導者コメント */}
      <div style={{ marginTop: 10 }}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="指導者コメント"
        />

        <button onClick={() => onSave(data.id, comment)}>
          保存
        </button>
      </div>

      {/* 削除 */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => onDelete(data.id)}>
          削除
        </button>
      </div>
    </div>
  );
}