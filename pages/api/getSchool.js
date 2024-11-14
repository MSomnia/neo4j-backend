import driver from '../../lib/neo4j';

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Only GET requests are allowed' });
        return;
    }
    const query

    try {
        const result = await session.run('MATCH (uni:university) RETURN uni.name,uni.domain');
        const nodes = result.records.map(record => record.get('uni').properties);
        res.status(200).json({nodes});
    }catch (error) {
        console.error('Neo4j query error:', error);
        res.status(500).json({ error: 'Failed to fetch data from Neo4j' });
    } finally {
        // Close the session
        await session.close();
    }


}
