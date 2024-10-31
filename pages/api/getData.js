// api/getData.js
import driver from '../../lib/neo4j';

export default async function handler(req, res) {
  // Ensure the request method is GET
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Only GET requests are allowed' });
    return;
  }

  const session = driver.session();
  try {
    // Example Neo4j query to fetch nodes
    const result = await session.run('MATCH (n) RETURN n LIMIT 10');
    const nodes = result.records.map(record => record.get('n').properties);

    res.status(200).json({ nodes });
  } catch (error) {
    console.error('Neo4j query error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Neo4j' });
  } finally {
    // Close the session
    await session.close();
  }
}