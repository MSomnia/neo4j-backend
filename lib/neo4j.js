// lib/neo4j.js
import neo4j from 'neo4j-driver';

const DATABASE_NAME = "note";

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Test the connection
(async () => {
  try {
    const session = driver.session({database: DATABASE_NAME});
    await session.run('RETURN 1'); // Test query
    console.log('Connected to Neo4j successfully!');
    await session.close();
  } catch (error) {
    console.error('Failed to connect to Neo4j:', error);
  }
})();


/**
 * Run a Cypher query with optional parameters.
 * @param {string} cypher - The Cypher query to run.
 * @param {object} params - The parameters for the Cypher query.
 * @returns {Promise<Array>} - The query results as an array of objects.
 */
export async function runQuery(cypher, params = {}) {
  const session = driver.session({database: DATABASE_NAME});
  try {
    const result = await session.run(cypher, params);
    // Convert the result to an array of objects
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Close the Neo4j driver connection.
 */
export async function closeDriver() {
  await driver.close();
  console.log('Neo4j driver closed.');
}

export default driver;