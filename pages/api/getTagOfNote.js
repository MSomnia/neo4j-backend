import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { note_id } = req.body;
        if(!note_id){
            return res.status(400).json({ error: 'Missing data' });
        }

        const cypher = 'MATCH(n:note{id:$note_id})-[:CONTAINS]->(t:tag) RETURN COLLECT(t.name) AS tag_name';
        try {
            const data = await runQuery(cypher,{note_id});
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
