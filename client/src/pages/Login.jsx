// src/pages/Login.jsx

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Spotifyムード診断プレイリスト</h2>
      <a href={`${API_URL}/auth/spotify`}>
        <button style={{ fontSize: 18, padding: '8px 24px' }}>
          Spotifyでログイン
        </button>
      </a>
    </div>
  );
}
