import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const note_id = req.query.note_id
    if(!note_id) { return res.status(400).json({ error: 'Missing data' });}

    const cypher = `
    MATCH(n:note{id:"5"})-[:CONTAINS]->(t:tag),
    (otherNote:note)-[:CONTAINS]->(t:tag{name:t.name}),
    (otherNote:note)-[:TAKEN_IN]->(c:course) 
    RETURN otherNote.id AS note_id, otherNote.title AS note_title, otherNote.content AS note_content,
    otherNote.date AS note_created_date, c.title AS course_title, COLLECT(DISTINCT t.name) AS tag_name
    `; 

    try {
        const data = await runQuery(cypher, {note_id});
        console.log("[Recommendation] Success. "+note_id);
        data.forEach((note)=>{
          if(note.note_created_date != null)
          {
            const string_date = note.note_created_date.year.low + '-'+ note.note_created_date.month.low + '-'+note.note_created_date.day.low
            note.note_created_date = string_date
          }
        })
        res.status(200).json({success: true, data});
    }catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({success: false, message: 'Failed to fetch data', error: error.message});
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({success: false, message: `Method ${req.method} Not Allowed`});
  }
}


