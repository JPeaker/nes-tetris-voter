import 'reflect-metadata';
import express from 'express';
import btoa from 'btoa';
import fetch from 'node-fetch';

const port = process.env.PORT || 5000;
const location = process.env.NODE_ENV === 'production' ? 'https://nes-tetris-voter.herokuapp.com' : 'http://localhost';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const unencodedRedirect = `${location}:${port}/api/discord/callback`;
const redirect = encodeURIComponent(unencodedRedirect);

const router = express.Router();

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', async (req, res) => {
  if (!req.query.code) {
    throw new Error('No code provided');
  }
  const { code } = req.query;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  let data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code as string,
    'redirect_uri': unencodedRedirect,
    'scope': 'identify',
  } as { [key: string]: string };

  const response = await fetch(`https://discordapp.com/api/oauth2/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&'),
    });

  const json = await response.json();
  console.log('JOSH LOOK', json);
  res.redirect(`/?token=${json.access_token}`);
});

export default router;