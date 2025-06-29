// src/App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Home from './pages/Home';
import Profile from './pages/Profile'; // ← 追加

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> {/* ← 追加 */}
      </Routes>
    </HashRouter>
  );
}
