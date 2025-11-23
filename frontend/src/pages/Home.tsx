import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Post = { id: string; title: string; section: string; summary?: string; createdAt: string };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    axios.get<Post[]>('/api/posts?limit=6').then((r) => setPosts(r.data)).catch(() => {});
  }, []);
  return (
    <div className="page">
      <h1>读 · 思 · 行 · 游乐场</h1>
      <p>前后端分离版本，后端 Nest + Postgres，支持文件工具页。</p>
      <div className="card-grid">
        {posts.map((p) => (
          <article key={p.id} className="card">
            <p>{p.section.toUpperCase()}</p>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
