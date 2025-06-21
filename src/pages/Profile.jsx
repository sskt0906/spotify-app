import React, { useEffect, useState } from 'react';

const API_URL = 'https://spotify-app-server-h33q.onrender.com'; // ←ここを本番APIサーバーURLに

const Profile = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const fetchPlaylists = () => {
    fetch(`${API_URL}/api/user/playlists`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(() => setPlaylists(null));
  };

  if (user === null) return <div>ログインしてください。</div>;

  return (
    <div>
      <h2>Spotifyプロフィール</h2>
      <p>ユーザー名: {user.displayName}</p>
      <p>メール: {user.emails && user.emails[0].value}</p>
      <img
        src={user.photos?.[0]?.value}
        alt="user"
        style={{ width: 100, borderRadius: '50%' }}
      />
      <button onClick={fetchPlaylists}>プレイリストを取得</button>
      {playlists && (
        <div>
          <h3>プレイリスト一覧</h3>
          <ul>
            {playlists.items.map((pl) => (
              <li key={pl.id}>
                <a
                  href={pl.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pl.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
