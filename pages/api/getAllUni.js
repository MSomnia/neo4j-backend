// api/getData.js
// api/getData.js
import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cypher = 'MATCH (u:university) RETURN u'; // Modify this query based on your dataset and schema
    try {
        const universities = await runQuery(cypher); // Execute the query
        const formattedData = universities.map((record) => ({
          ...record.u.properties, // Extract properties of each "u" node
        }));
        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({success: false, message: 'Failed to fetch data', error: error.message});
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({success: false, message: `Method ${req.method} Not Allowed`});
  }
}


