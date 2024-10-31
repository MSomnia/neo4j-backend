// pages/api/addUser.js
export default function handler(req, res) {
    // Check if the request method is POST
    if (req.method === 'POST') {
      // Extract the data from the request body
      const { message } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: 'Message is missing' });
      }

    if (req.method === 'OPTION'){
        return res.status(200).end(); // End the response
    }

      // Log the message or use it for further processing
      console.log('Received message:', message);
  
      // Respond with a success status and message
      res.status(200).json({ success: true, receivedMessage: message });
    } else {
      // Handle any other HTTP methods
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }