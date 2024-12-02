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
    const { user_email, course_id, course_title, note_title, note_content, note_tags } = req.body;

    if (!user_email || !course_id || !course_title || !note_title || !note_content || !Array.isArray(note_tags) || note_tags.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    //Validating the course existence
    const validateCypher = `
    MATCH (u:user {email: $user_email})-[:ENROLLED_IN]->(uni:university)
    MATCH (c:course {id: $course_id+"@"+uni.domain})
    RETURN COUNT(c) > 0 AS exists;
    `;

    const courseRes = await runQuery(validateCypher, { user_email, course_id});

    if (!courseRes.length > 0 || !courseRes[0].exists) {
        console.log("Course does not exist. "+course_id);
        const addCourseCypher = `
        MATCH (u:user {email: $user_email})-[:ENROLLED_IN]->(uni:university)
        CREATE (c:course {id: $course_id+"@"+uni.domain, title: $course_title})
        CREATE(c)-[:BELONGS_TO]->(uni)
        RETURN c.id;
        `
        try{
          const addRes = await runQuery(addCourseCypher, {user_email, course_id, course_title});
          if(addRes.length===0)
          {
            console.log("Can not create the course "+ course_id);
            return res.status(404).json({ success: false, message: 'Can not create the course '+course_id });
          }

        }catch(error)
        {
          console.log(error)
          return res.status(404).json({ success: false, message: 'Can not create the course '+course_id });
        }

        //return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const cypher = `
      // Create a new note node with an ascending id
      MATCH (u:user {email: $user_email})-[:ENROLLED_IN]->(uni:university), (c:course {id: $course_id + "@" + uni.domain})
      CREATE (newNote:note {
        id: randomUUID(), 
        title: $note_title, 
        content: $note_content,
        date: date()
      })
      MERGE (u)-[:OWNED]->(newNote)
      MERGE (newNote)-[:TAKEN_IN]->(c)
      WITH newNote
      // Handle note tags
      UNWIND $note_tags AS tagName
      MERGE (t:tag {name: tagName})
      MERGE (newNote)-[:CONTAINS]->(t)
      RETURN newNote.id AS note_id, newNote.title AS note_title, newNote.date AS note_created_date;
    `;

    try {
      const data = await runQuery(cypher, {
        user_email,
        course_id,
        course_title,
        note_title,
        note_content,
        note_tags,
      });

      if (data.length === 0) {
        res.status(404).json({ success: false, message: 'Can not create the note' });
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