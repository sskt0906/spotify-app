require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

// ★ここでセッションミドルウェアを追加（initializeの前！）
app.use(
  session({
    secret: 'your-session-secret', // ランダムな長い文字列にしてください
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // RenderならfalseでOK
  })
);

// ★ユーザーのシリアライズ・デシリアライズ（必須！）
passport.serializeUser((user, done) => {
  done(null, user); // そのまま全プロフィールを保存する例
});

passport.deserializeUser((user, done) => {
  done(null, user); // そのまま全プロフィールを復元
});

// Passportの設定
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      profile.accessToken = accessToken;
      // ここでユーザー情報をDB保存やセッション管理
      return done(null, profile);
    }
  )
);

// ★ここでpassport初期化＆セッション対応
app.use(passport.initialize());
app.use(passport.session());

// --- 以降、ルーティングは今のままでOK ---

app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'playlist-modify-public',
      'user-top-read',
      'user-read-recently-played',
    ],
  })
);

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(
      'https://spotify-a3bp0iys9-takashi-sasakis-projects-9c875311.vercel.app/profile'
    ); // 例：Reactの/profileページ
  }
);

app.get('/', (req, res) => res.send('Server is running!'));
app.listen(5000, () => console.log('Server started on port 5000'));
app.get('/api/user', (req, res) => {
  // ここではaccessTokenをreq.userから取得する例
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  // Spotifyのユーザープロフィール情報を返す
  res.json(req.user);
});
app.get('/api/user/playlists', async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  // ここでaccessTokenを取得（SpotifyStrategyのコールバックで保存しておくと便利）
  // 例：req.user.accessTokenとして持たせておく
  const accessToken = req.user.accessToken; // ★

  if (!accessToken) {
    return res.status(400).send('No access token');
  }

  // Spotify Web APIクライアントをセットアップ
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const playlists = await spotifyApi.getUserPlaylists();
    res.json(playlists.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/profile', (req, res) => {
  // 認証済みならユーザー情報を表示、未認証ならエラーを返す
  if (!req.user) {
    return res
      .status(401)
      .send('未ログインです。/auth/spotify からログインしてください。');
  }
  // ユーザー名やメールなどをHTMLやテキストで返す例
  res.send(`
    <h2>Spotify認証成功！</h2>
    <p>ユーザー名: ${req.user.displayName || 'No Name'}</p>
    <p>メール: ${req.user.emails ? req.user.emails[0].value : 'No email'}</p>
    <pre>${JSON.stringify(req.user, null, 2)}</pre>
    <a href="/api/user/playlists">あなたのプレイリスト一覧を見る</a>
  `);
});
