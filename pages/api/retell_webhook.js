import { createHmac, timingSafeEqual } from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return Buffer.from(
    await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    }),
  );
}

export default async function handler(req, res) {
  const signature = req.headers['x-retell-signature'];
  const secret = process.env.RETELL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('RETELL_WEBHOOK_SECRET is not defined');
    return res.status(500).send('Server misconfigured');
  }

  // Read the raw request body
  const rawBody = await getRawBody(req);

  // Compute HMAC (sha256) of the raw body using the shared secret
  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody);
  const expected = hmac.digest('hex');

  // Validate the signature using constant-time comparison
  const valid =
    typeof signature === 'string' &&
    timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expected, 'utf8'));
  if (!valid) {
    return res.status(401).send('unauthorized');
  }

  // Parse JSON only after verifying the signature
  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).send('invalid json');
  }

  // Acknowledge immediately (Retell docs recommend 204 or 200)
  res.status(204).end();

  // Process payload asynchronously (e.g., log to MongoDB)
  // await logRetellEvent(payload);
}
