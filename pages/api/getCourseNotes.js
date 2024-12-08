import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { course_id } = req.body;
        if(!course_id){
            return res.status(400).json({ error: 'Missing data' });
        }

        const cypher = `MATCH(n:note)-[:TAKEN_IN]->(c:course {id: $course_id}) 
        RETURN n.id AS note_id, n.title AS note_title,n.content AS note_content,
        c.title AS course_of_note, n.date AS note_created_date;`
        try {
            const data = await runQuery(cypher,{course_id});
            data.forEach((note)=>{
                if(note.note_created_date != null)
                {
                  const string_date = note.note_created_date.year.low + '-'+ note.note_created_date.month.low + '-'+note.note_created_date.day.low
                  note.note_created_date = string_date
                }
              })
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
