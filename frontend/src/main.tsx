import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './style.css';
import Home from './pages/Home';
import SectionPage from './pages/Section';
import GuestPage from './pages/Guest';
import OwnerPage from './pages/Owner';
import ToolsPage from './pages/Tools';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const match = document.cookie.match(/csrfToken=([^;]+)/);
  if (match) {
    config.headers = { ...(config.headers || {}), 'x-csrf-token': decodeURIComponent(match[1]) };
  }
  return config;
});

const Nav = () => (
  <header className="top-nav">
    <div className="logo">rivers*</div>
    <nav className="pill-nav">
      <Link to="/">首页</Link>
      <Link to="/read">读</Link>
      <Link to="/think">思</Link>
      <Link to="/act">行</Link>
      <Link to="/guest">访客</Link>
      <Link to="/owner">主人</Link>
      <Link to="/tools">工具</Link>
    </nav>
  </header>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/read" element={<SectionPage section="read" />} />
        <Route path="/think" element={<SectionPage section="think" />} />
        <Route path="/act" element={<SectionPage section="act" />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/tools" element={<ToolsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
