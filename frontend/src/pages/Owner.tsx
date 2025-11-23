import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Post = { id: string; title: string; section: string; isPublished: boolean; updatedAt: string };

export default function OwnerPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [me, setMe] = useState<{ id: string; email: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchMe = () => axios.get('/auth/me').then((r) => setMe(r.data));
  const fetchPosts = () => axios.get<Post[]>('/api/posts?limit=200').then((r) => setPosts(r.data));

  useEffect(() => {
    fetchMe().then(() => fetchPosts()).catch(() => {});
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/auth/login', { email, password });
    await fetchMe();
    fetchPosts();
  };

  return (
    <div className="page">
      <h2>主人入口</h2>
      {!me && (
        <form className="card stack" onSubmit={login}>
          <input placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            placeholder="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn primary" type="submit">
            登录
          </button>
        </form>
      )}
      {me && (
        <>
          <p>已登录：{me.email}</p>
          <table className="table card">
            <thead>
              <tr>
                <th>模块</th>
                <th>标题</th>
                <th>状态</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.section}</td>
                  <td>{p.title}</td>
                  <td>{p.isPublished ? '已发布' : '草稿'}</td>
                  <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
