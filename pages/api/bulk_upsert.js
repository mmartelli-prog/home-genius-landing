import clientPromise from "../../db";
export const config = { api: { bodyParser: { sizeLimit: "4mb" }, maxDuration: 10 } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!Array.isArray(body)) return res.status(400).json({ ok: false, error: "Expect JSON array" });

    const col = (await clientPromise).db("homegenius").collection("facts");
    const ops = body.map(it => ({
      updateOne: {
        filter: { key: String(it.key) },
        update: {
          $set: {
            key: String(it.key),
            value: it.value ?? null,
            tags: Array.isArray(it.tags) ? it.tags : [],
            updated_at: new Date()
          }
        },
        upsert: true
      }
    }));
    if (!ops.length) return res.status(400).json({ ok: false, error: "Empty array" });
    const r = await col.bulkWrite(ops, { ordered: false });
    return res.status(200).json({ ok: true, modified: r.modifiedCount, upserted: r.upsertedCount });
  } catch (e) {
    console.error("bulk_upsert error", e);
    return res.status(500).json({ ok: false, error: e?.message || "unknown" });
  }
}
