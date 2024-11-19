
import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user_email = req.body.user_email;
    if(!user_email) { return res.status(400).json({ error: 'Missing data' });}

    const cypher = `
    MATCH (u:user {email: $user_email})-[:OWNED]->(n:note)
    RETURN n.title AS note_title, n.id AS note_id;
    `; 

    try {
        const data = await runQuery(cypher, {user_email});
        console.log("[getAUserNotes] Success. "+user_email);
        res.status(200).json({success: true, data});
    }catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({success: false, message: 'Failed to fetch data', error: error.message});
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({success: false, message: `Method ${req.method} Not Allowed`});
  }
}


