require('dotenv').config();
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const app = express();

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
app.use(passport.initialize());

// Spotify認証の入り口ルート
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

// Spotify認証後のコールバック
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    // 認証後の処理（例：フロントエンドにリダイレクト）
    res.send('Spotify認証成功！');
  }
);

app.get('/', (req, res) => res.send('Server is running!'));
app.listen(5000, () => console.log('Server started on port 5000'));
