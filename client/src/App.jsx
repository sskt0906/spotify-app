// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Home from './pages/Home';
import Profile from './pages/Profile'; // ← 追加

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> {/* ← 追加 */}
      </Routes>
    </BrowserRouter>
  );
}
