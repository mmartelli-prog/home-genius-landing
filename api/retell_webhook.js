export default async function handler(req, res) {
  if (req.method === "POST") {
    // Log the incoming webhook payload for debugging
    console.log("Received Retell webhook:", req.body);

    // Respond with 200 OK so Retell knows it's received
    res.status(200).json({ status: "success" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
