import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const query = `
        MATCH (u:user {email: $email})-[:ENROLLED_IN]->(uni:university)
        OPTIONAL MATCH (u)-[:OWNED]->(:note)-[:TAKEN_IN]->(c:course)
        RETURN u.name AS user_name, u.email AS user_email, uni.name AS university_name,
        COLLECT(DISTINCT c.id) AS course_ids
        `;

        try {
            const result = await runQuery(query, { email });
            
            if (result.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ 
                success: true,
                user: {
                    ...result[0],
                    course_ids: result[0].course_ids || []
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch user information' });
        }
    }

    // Handle other HTTP methods
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method Not Allowed' });
}
