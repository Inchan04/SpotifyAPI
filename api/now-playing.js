import fetch from 'node-fetch';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

export default async (req, res) => {
  try {
    const authResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
    });
    
    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (nowPlayingResponse.status === 204) {
      return res.status(200).json({});
    }

    const nowPlayingData = await nowPlayingResponse.json();
    return res.status(200).json(nowPlayingData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};