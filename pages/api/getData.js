// api/getData.js
// api/getData.js
import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cypher = 'MATCH (n) RETURN n'; // Modify this query based on your dataset and schema
    try {
      const data = await runQuery(cypher);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch data', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}

// export default async function handler(req, res) {
//   // Ensure the request method is GET
//   if (req.method !== 'GET') {
//     res.status(405).json({ message: 'Only GET requests are allowed' });
//     return;
//   }

//   const database = "neo4j"
//   const session = driver.session({database});
//   try {
//     // Example Neo4j query to fetch nodes
//     const result = await session.run('MATCH (n) RETURN n LIMIT 10');
//     const nodes = result.records.map(record => record.get('n').properties);

//     res.status(200).json({ nodes });
//   } catch (error) {
//     console.error('Neo4j query error:', error);
//     res.status(500).json({ error: 'Failed to fetch data from Neo4j' });
//   } finally {
//     // Close the session
//     await session.close();
//   }
// }