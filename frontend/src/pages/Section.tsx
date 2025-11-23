import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Post = { id: string; title: string; summary?: string; body?: string; tags?: string[]; createdAt: string };

export default function SectionPage({ section }: { section: 'read' | 'think' | 'act' }) {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    axios.get<Post[]>(`/api/posts?section=${section}`).then((r) => setPosts(r.data)).catch(() => {});
  }, [section]);

  return (
    <div className="page">
      <h2>{section} 模块</h2>
      <div className="card-grid">
        {posts.map((p) => (
          <article key={p.id} className="card">
            <p>{new Date(p.createdAt).toLocaleDateString()}</p>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
