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
    const { uni_name, course_id, course_title } = req.body;

    if (!uni_name || !course_id || !course_title) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    // Transform course_id to lowercase letters with numbers
    const transformedCourseId = course_id.toLowerCase();

    // Cypher query
    const cypher = `
      MATCH (uni:university {name: $uni_name}) // Find the university by name
      WITH uni, uni.domain AS uni_domain, $transformed_course_id + "@" + uni.domain AS final_course_id
      MERGE (c:course {id: final_course_id}) // Create course node if not exists
      SET c.title = $course_title // Set the course title
      MERGE (c)-[:BELONGS_TO]->(uni) // Connect course to university
      RETURN c.id AS course_id, c.title AS course_title, uni.name AS university_name;
    `;

    try {
      // Run the query with parameters
      const data = await runQuery(cypher, {
        uni_name,
        transformed_course_id: transformedCourseId,
        course_title,
      });

      // Handle result
      if (data.length === 0) {
        return res.status(404).json({ success: false, message: 'University not found' });
      }

      res.status(201).json({
        success: true,
        course: data[0],
      });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }

}