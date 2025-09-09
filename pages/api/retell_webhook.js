export default function handler(req, res) {
  res.status(200).json({ message: "Retell webhook received!" });
}
