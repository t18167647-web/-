"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("items")) || [];
    setItems(saved);
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem("items", JSON.stringify(data));
  };

  const handleSaveComment = (id, comment) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          comments: [...(item.comments || []), comment],
        };
      }
      return item;
    });

    setItems(newItems);
    saveToLocal(newItems);
  };

  const handleDelete = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    saveToLocal(newItems);
  };

  return (
    <div>
      <h1>結果ページ</h1>

      {items.map((item) => (
        <Item
          key={item.id}
          data={item}
          onSave={handleSaveComment}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function Item({ data, onSave, onDelete }) {
  const [comment, setComment] = useState("");

  return (
    <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
      <p>球数: {data.count}</p>
      <p>種類: {data.type}</p>
      <p>
        肩: {data.shoulder ? "○" : "×"} / 肘: {data.elbow ? "○" : "×"}
      </p>

      {/* 入力欄 */}
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメント入力"
      />
      <button
        onClick={() => {
          if (!comment) return;
          onSave(data.id, comment);
          setComment("");
        }}
      >
        保存
      </button>

      {/* 👇ここがチャット表示 */}
      <div style={{ marginTop: 10 }}>
        <strong>コメント履歴:</strong>
        {(data.comments || []).map((c, i) => (
          <div
            key={i}
            style={{
              background: "#eee",
              marginTop: 5,
              padding: 5,
              borderRadius: 5,
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <button onClick={() => onDelete(data.id)}>削除</button>
    </div>
  );
}

