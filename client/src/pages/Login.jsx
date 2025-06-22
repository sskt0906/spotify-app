export default function Login() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Spotifyムード診断プレイリスト</h2>
      <a href="http://localhost:5000/auth/spotify">
        <button style={{ fontSize: 18, padding: '8px 24px' }}>
          Spotifyでログイン
        </button>
      </a>
    </div>
  );
}
