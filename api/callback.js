module.exports = async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Code manquant');
  }

  const CLIENT_ID = '311d872b-594c-81eb-a0d2-0037326a99c3';
  const CLIENT_SECRET = 'secret_K64ArQImVhz2APqLg1W4vHTnggmhNmySka1IfTdQv8v';
  const REDIRECT_URI = 'https://vintedpro-git-main-louis-projects-d4e275c4.vercel.app/api/callback';

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();
  
  if (!tokenRes.ok) {
    return res.status(500).send('Erreur OAuth: ' + JSON.stringify(data));
  }

  // Rediriger vers le dashboard avec le token
  const token = data.access_token;
  res.redirect(`/?token=${token}`);
};
