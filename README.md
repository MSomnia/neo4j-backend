# API instructions
## User system

dash.note.lat/api/userLogin
  - req: user_email, user_password
  - res: success (true or false), user (user_name, user_email)

dash.note.lat/api/addUser
  - req: uni_name, user_name, user_email, user_password
  - res: message, user (query result)

## Get

dash.note.lat/api/getAllUni
  - res: success (true or false), data

dash.note.lat/api/getANote
  - req: note_id
  - res: success, data

dash.note.lat/api/getAUserNotes
  - req: user_email
  - res: success, data

dash.note.lat/api/getCourseOfNote
  - req: note_id
  - res: success, data

dash.note.lat/api/getUniOfCourse
  - req: course_id
  - res: success, data

## Add

dash.note.lat/api/addCourse
  - req: uni_name, course_id, course_title
  - res: success (true or false), course

dash.note.lat/api/addNote
  - req: user_email, course_id, note_title, note_content, note_tags(array)
  - res: success, note (note_id, note_title)
