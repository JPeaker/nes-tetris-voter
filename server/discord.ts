import 'reflect-metadata';
import express from 'express';
import DiscordOauth2 from 'discord-oauth2';
import { User } from './data/entity/User';

const port = process.env.PORT || 5000;
const location = process.env.NODE_ENV === 'production' ? 'https://nes-tetris-voter.herokuapp.com' : 'http://localhost';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const unencodedRedirect = `${location}:${port}/api/discord/callback`;
const redirect = encodeURIComponent(unencodedRedirect);

const router = express.Router();

const oauth = new DiscordOauth2();

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', async (req, res) => {
  if (!req.query.code) {
    throw new Error('No code provided');
  }
  const { code } = req.query;

  const token = await oauth.tokenRequest({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    code: code as string,
    scope: 'identify',
    grantType: 'authorization_code',
    redirectUri: unencodedRedirect,
  });

  const accessToken = token.access_token;

  let user = (await User.find({ where: { accessToken }}))[0];

  if (!user) {
    const u = new User();
    u.accessToken = accessToken;
    user = await u.save();
  }

  res.cookie('voterUser', user.id);
  res.redirect('/');
});

export default router;