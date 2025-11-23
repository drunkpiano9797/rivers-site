import React, { useEffect, useState } from 'react';
import axios from 'axios';

type FileRow = { id: string; name: string; size: number; mime: string; createdAt: string };

export default function ToolsPage() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<File | null>(null);

  const load = () => axios.get<FileRow[]>('/api/files', { params: { q } }).then((r) => setFiles(r.data));
  useEffect(() => {
    load().catch(() => {});
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelected(file);
  };

  const upload = async () => {
    if (!selected) return;
    const checksum = 'demo'; // TODO: compute SHA256 in real impl
    await axios.post('/api/files', {
      name: selected.name,
      size: selected.size,
      mime: selected.type || 'application/octet-stream',
      checksum
    });
    setSelected(null);
    load();
  };

  return (
    <div className="page">
      <h2>工具 / 文件站</h2>
      <div className="card stack">
        <input placeholder="搜索文件" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={load}>
          搜索
        </button>
        <div className="dropzone">
          <input type="file" onChange={onFileChange} />
          {selected && (
            <div>
              {selected.name} · {Math.round(selected.size / 1024)} KB
              <button className="btn primary" style={{ marginLeft: 10 }} onClick={upload}>
                上传
              </button>
            </div>
          )}
        </div>
      </div>
      <table className="table card" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>名称</th>
            <th>大小</th>
            <th>类型</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{Math.round(f.size / 1024)} KB</td>
              <td>{f.mime}</td>
              <td>{new Date(f.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
