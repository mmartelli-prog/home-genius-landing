import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  const { lookup_key, lookup_type } = req.body.args || req.body;
  
  if (!lookup_key || !lookup_type) {
    return res.status(400).json({
      error: "1",
      message: "Missing required parameters: lookup_key and lookup_type"
    });
  }

  let client;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('homegenius');
    const appointments = database.collection('Appointments'); // Capital A to match your collection
    
    let query;
    
    if (lookup_type === 'phone') {
      query = { phone: lookup_key };
    } else if (lookup_type === 'name') {
      const nameParts = lookup_key.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      query = {
        first_name: firstName,
        last_name: lastName
      };
    }
    
    const appointment = await appointments.findOne(query);
    
    if (!appointment) {
      return res.status(404).json({
        error: "1",
        message: "Appointment not found for provided lookup_key."
      });
    }
    
    return res.status(200).json({
      appointment_id: appointment.appointment_id,
      customer_name: `${appointment.first_name} ${appointment.last_name}`,
      phone: appointment.phone,
      address: appointment.address || {},
      appointment_date_spoken: appointment.scheduled_at,
      service: appointment.product,
      prep_notes: appointment.division || "No special notes"
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      error: "1",
      message: "Database connection error"
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
