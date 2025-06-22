// src/pages/Callback.jsx
// Spotify認証後、JWTトークンを取得してローカルストレージ保存 & /homeへリダイレクト

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // クエリからtokenを取得
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token); // ローカルストレージに保存
      navigate('/home');
    }
  }, [navigate]);

  return <div>ログイン処理中...</div>;
}
