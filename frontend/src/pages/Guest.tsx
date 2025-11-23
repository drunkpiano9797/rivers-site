import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Entry = { id: string; name: string; message: string; createdAt: string };

export default function GuestPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ name: '', message: '' });

  const load = () => axios.get<Entry[]>('/api/guest').then((r) => setEntries(r.data));
  useEffect(() => {
    load().catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/guest', form);
    setForm({ name: '', message: '' });
    load();
  };

  return (
    <div className="page">
      <h2>访客簿</h2>
      <form className="card stack" onSubmit={submit}>
        <input placeholder="名字" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea
          placeholder="留言"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button className="btn primary" type="submit">
          提交
        </button>
      </form>
      <div className="card-grid">
        {entries.map((g) => (
          <article key={g.id} className="card">
            <p>
              {g.name} · {new Date(g.createdAt).toLocaleString()}
            </p>
            <p>{g.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
