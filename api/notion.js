module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const notionPath = req.query.path;
  if (!notionPath || !notionPath.startsWith('/v1/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const TOKEN = process.env.NOTION_TOKEN;
  if (!TOKEN) return res.status(500).json({ error: 'Token non configuré' });

  let bodyText = '';
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    await new Promise((resolve) => {
      req.on('data', chunk => { bodyText += chunk; });
      req.on('end', resolve);
    });
  }

  const notionRes = await fetch('https://api.notion.com' + notionPath, {
    method: req.method,
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: bodyText || undefined,
  });

  const data = await notionRes.json();
  return res.status(notionRes.status).json(data);
};
