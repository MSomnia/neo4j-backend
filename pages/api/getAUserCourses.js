import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email: user_email } = req.body;
    if(!user_email) { return res.status(400).json({ error: 'Missing data' });}

    console.log("================"+user_email)

    const cypher = `
    MATCH (u:user {email: $user_email})-[:OWNED]->(n:note)-[:TAKEN_IN]->(c:course)
    RETURN DISTINCT c.title AS course_name, c.id AS course_id
    ORDER BY c.title;
    `;

    try {
        const data = await runQuery(cypher, {user_email});
        console.log("[getAUserCourses] Success. "+user_email);
        console.log(data.length)
        res.status(200).json({success: true, data});
    }catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({success: false, message: 'Failed to fetch courses', error: error.message});
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({success: false, message: `Method ${req.method} Not Allowed`});
  }
}
