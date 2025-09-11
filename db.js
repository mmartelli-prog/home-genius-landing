import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI");
const OPTIONS = { maxPoolSize: 25, minPoolSize: 1, serverSelectionTimeoutMS: 3000, retryReads: true, retryWrites: true };
let client, clientPromise;
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) { client = new MongoClient(uri, OPTIONS); global._mongoClientPromise = client.connect().then(initIndexes); }
  clientPromise = global._mongoClientPromise;
} else { client = new MongoClient(uri, OPTIONS); clientPromise = client.connect().then(initIndexes); }
async function initIndexes(client) {
  if (global._indexesReady) return client;
  const db = client.db("homegenius");
  await db.collection("facts").createIndexes([{ key: { key: 1 }, name: "facts_key_unique", unique: true }, { key: { key: "text", value: "text", tags: "text" }, name: "facts_text" }]);
  await db.collection("customers").createIndexes([{ key: { customer_id: 1 }, name: "cust_id_unique", unique: true, sparse: true }, { key: { email: 1 }, name: "cust_email" }]);
  await db.collection("appointments").createIndexes([{ key: { appointment_id: 1 }, name: "appt_id_unique", unique: true, sparse: true }, { key: { email: 1 }, name: "appt_email" }, { key: { phone: 1 }, name: "appt_phone" }, { key: { scheduled_at: 1 }, name: "appt_time" }]);
  await db.collection("retell_events").createIndexes([{ key: { key: 1 }, name: "evt_key_unique", unique: true }, { key: { received_at: 1 }, name: "evt_ttl_30d", expireAfterSeconds: 2592000 }]);
  global._indexesReady = true; return client;
}
export default clientPromise;
