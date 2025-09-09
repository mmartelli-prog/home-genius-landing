import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.status(200).json({ ok: true, route: "query" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
