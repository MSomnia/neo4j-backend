import { runQuery } from '../../lib/neo4j'; // Adjust the path to your Neo4j utility

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify a specific origin
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
        return res.status(200).end(); // End the response
      }

  if (req.method === 'POST') {
    const { user_email, course_id, note_title, note_content, note_tags } = req.body;

    if (!user_email || !course_id || !note_title || !note_content || !Array.isArray(note_tags) || note_tags.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    //Validating the course existence
    const validateCypher = `
    MATCH (c:course {id: $course_id})
    RETURN COUNT(c) > 0 AS exists;
    `;

    const courseRes = await runQuery(validateCypher, { course_id});

    if (!courseRes.length > 0 || !courseRes[0].exists) {
        console.log("Course does not exist. "+course_id);
        return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const cypher = `
      // Create a new note node with an ascending id
      MATCH (u:user {email: $user_email}), (c:course {id: $course_id})
      MATCH (n:note)
      WITH u, c, COUNT(n) AS maxNoteId
      CREATE (newNote:note {
        id: toString(maxNoteId + 1), 
        title: $note_title, 
        content: $note_content
      })
      MERGE (u)-[:OWNED]->(newNote)
      MERGE (newNote)-[:TAKEN_IN]->(c)
      WITH newNote
      // Handle note tags
      UNWIND $note_tags AS tagName
      MERGE (t:tag {name: tagName})
      MERGE (newNote)-[:CONTAINS]->(t)
      RETURN newNote.id AS note_id, newNote.title AS note_title;
    `;

    try {
      const data = await runQuery(cypher, {
        user_email,
        course_id,
        note_title,
        note_content,
        note_tags,
      });

      if (data.length === 0) {
        res.status(404).json({ success: false, message: 'User or course not found' });
      } else {
        res.status(201).json({ success: true, note: data[0] });
      }
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}