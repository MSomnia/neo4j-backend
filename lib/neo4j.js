// lib/neo4j.js
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Test the connection
(async () => {
  try {
    const session = driver.session();
    await session.run('RETURN 1'); // Test query
    console.log('Connected to Neo4j successfully!');
    await session.close();
  } catch (error) {
    console.error('Failed to connect to Neo4j:', error);
  }
})();

export default driver;