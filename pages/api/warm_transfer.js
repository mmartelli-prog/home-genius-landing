export default async function handler(req, res) {
  return res.status(200).json({
    result: "I'll transfer you to our team right away. Please hold."
  });
}
