export default async function handler(req, res) {
  const { lookup_key, lookup_type } = req.body.args || req.body;
  
  // Hardcoded appointments for demo
  const appointments = {
    "2140688290": { 
      first_name: "Matt", 
      last_name: "Martelli", 
      appointment_id: "153706699648",
      product: "Gutters",
      division: "MidAtlantic",
      scheduled_at: "September 9th at 6 PM",
      phone: "2140688290"
    },
    "2399616568": { 
      first_name: "Erin", 
      last_name: "Patterson",
      appointment_id: "153795974777", 
      product: "Siding",
      division: "Detroit",
      scheduled_at: "September 9th at 6 PM",
      phone: "2399616568"
    },
    "6155757040": {
      first_name: "Chris",
      last_name: "Seibert",
      appointment_id: "153750372994",
      product: "Gutters",
      division: "MidAtlantic", 
      scheduled_at: "September 9th at 10 PM",
      phone: "6155757040"
    },
    "2406879193": {
      first_name: "Rashidat",
      last_name: "Azeez",
      appointment_id: "153795974777",
      product: "Roofing",
      division: "Cleveland",
      scheduled_at: "September 9th at 10 PM",
      phone: "2406879193"
    }
  };
  
  const appointment = appointments[lookup_key];
  
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
    address: {},
    appointment_date_spoken: appointment.scheduled_at,
    service: appointment.product,
    prep_notes: appointment.division || "No special notes"
  });
}
