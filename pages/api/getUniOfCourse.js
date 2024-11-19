// api/getData.js
// api/getData.js
import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { course_id } = req.body;
        if(!course_id){
            return res.status(400).json({ error: 'Missing data' });
        }

        const cypher = 'MATCH(c:course{id:$course_id})-[:BELONGS_TO]->(u:university) RETURN u.name AS uni_name';
        try {
            const data = await runQuery(cypher,{course_id});
            res.status(200).json({success: true, data});
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({success: false, message: 'Failed to fetch data', error: error.message});
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({success: false, message: `Method ${req.method} Not Allowed`});
    }
}


