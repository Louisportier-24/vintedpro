export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const notionPath = req.query.path;
  if (!notionPath || !notionPath.startsWith('/v1/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const TOKEN = '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';

  const notionRes = await fetch('https://api.notion.com' + notionPath, {
    method: req.method,
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  const data = await notionRes.json();
  return res.status(notionRes.status).json(data);
}
