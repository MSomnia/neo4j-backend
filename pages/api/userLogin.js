import { runQuery } from '../../lib/neo4j'; // Adjust the path to your Neo4j utility

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify a specific origin
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
        return res.status(200).end(); // End the response
      }

    if (req.method === 'POST') {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
        return res.status(400).json({ success: false, message: 'Missing data' });
      }

    // Cypher query for user login
    const cypher = `
      MATCH (u:user {email: $user_email, password: $user_password})
      RETURN u.name AS name, u.email AS email;
    `;

    try {
      // Execute the query
      const data = await runQuery(cypher, { user_email, user_password });

      // Check if user exists
      if (data.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      } else {
        console.log('User logined. '+user_email)
        res.status(200).json({ success: true, user: data[0] });
      }
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}