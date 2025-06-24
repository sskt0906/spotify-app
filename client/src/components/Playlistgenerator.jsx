// src/components/PlaylistGenerator.jsx
// 1. バックエンドにアクセスしておすすめ曲を取得
// 2. プレイリスト作成ボタンを表示
// 3. 作成されたSpotifyプレイリストのリンクを表示

import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function PlaylistGenerator({ mood }) {
  const [tracks, setTracks] = useState([]);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // // ログイン済みユーザーのJWT
  const token = localStorage.getItem('token');

  // // ユーザーのSpotify履歴から曲リストを取得
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/user/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTracks(res.data.tracks))
      .finally(() => setLoading(false));
  }, [token]);

  // // プレイリストをSpotify上に作成
  const handleCreatePlaylist = async () => {
    setCreating(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/playlist`,
        { mood, tracks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaylistUrl(res.data.playlistUrl);
    } catch {
      alert('プレイリスト作成に失敗しました');
    }
    setCreating(false);
  };

  if (loading) return <div>曲データ取得中...</div>;
  if (playlistUrl)
    return (
      <div>
        <h3>プレイリストを作成しました！</h3>
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 18, color: '#388e3c' }}
        >
          Spotifyで開く
        </a>
      </div>
    );

  return (
    <div>
      <h3>おすすめ曲リスト</h3>
      <ul style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
        {tracks.map((track) => (
          <li key={track.id} style={{ margin: 6, fontSize: 16 }}>
            {track.name} / {track.artist}
          </li>
        ))}
      </ul>
      <button
        onClick={handleCreatePlaylist}
        style={{
          marginTop: 24,
          fontSize: 18,
          padding: '10px 28px',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
        disabled={creating}
      >
        {creating ? '作成中...' : 'この曲でSpotifyプレイリストを作成'}
      </button>
    </div>
  );
}
