require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const SpotifyStrategy = require('passport-spotify').Strategy;

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
    res.send('Spotify認証成功！');
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
