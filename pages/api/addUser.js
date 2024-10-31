// pages/api/handleMessage.js
export default function handler(req, res) {
    if (req.method === 'OPTIONS') {
      // Handle preflight requests
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify a specific origin
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
      return res.status(200).end(); // End the response
    }
  
    if (req.method === 'POST') {
      // Handle the POST request
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is missing' });
      }
  
      console.log('Received message:', message);
      return res.status(200).json({ success: true, receivedMessage: message });
    }
  
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }