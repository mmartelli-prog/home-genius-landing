export default async function handler(req, res) {
  const { lookup_key, lookup_type } = req.body.args || {};
  
  // For now, just return a message
  return res.status(200).json({
    result: "I couldn't find an appointment for " + lookup_key + ". Can you provide your phone number or confirmation number?"
  });
}
