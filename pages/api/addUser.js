// pages/api/handleMessage.js
import { runQuery } from "../../lib/neo4j";

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
      // Handle preflight requests
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify a specific origin
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
      return res.status(200).end(); // End the response
    }
  
    if (req.method === 'POST') {
      // Handle the POST request
      const { uni_name, user_name, user_email, user_password } = req.body;
      if (!uni_name || !user_name || !user_email || !user_password) {
        return res.status(400).json({ error: 'Missing data' });
      }
      console.log("User created" + " "+ uni_name+" "+user_name+" "+user_email+" "+user_password)
    //create user
    const user_query = `
    MATCH (uni:university {name: $uni_name})
    CREATE (usr:user {id: randomUUID(), name: $user_name, email: $user_email, password: $user_password})
    CREATE (usr)-[:ENROLLED_IN]->(uni)
    RETURN usr.name AS user_name, usr.email AS user_email
    `;
    try{
      const user_result = await runQuery(user_query, { uni_name, user_name, user_email, user_password });
      console.log('User created:', user_result);
      return res.status(200).json({ message: 'User created successfully', user: user_result });

    } catch(email_error){
      console.error(email_error)
      if (email_error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        res.status(409).json({ error: 'A user with this email already exists' });
      } 
      else {
        res.status(500).json({ error: '[User]Failed to create user' });
      }
    }
      // console.log('Received message:', message);
      // return res.status(200).json({ success: true, receivedMessage: message });
    }
  
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }