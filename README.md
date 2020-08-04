# NodeJS Coding Exam

## Installation and usage

From your Node.js command prompt execute the following command

```javascript

git clone https://github.com/chardlimph/FlexiSourceITNodeJSExam.git

cd FlexiSourceITNodeJSExam

npm install

npm start
```

API url is http://localhost:5000/

https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiUmljaGFyZCBMaW0iLCJyb2xlIjoiQXBwbGljYW50In0.RerWoB7TTp3NXwfcQaxCsvNqVnSotq243EEOo1UVHoI

## Config

Configuration file config/default.json

```javascript
{
    "mongoURI":"mongodb+srv://",
    "mockapiURI":"https://5f27d46df5d27e001612e662.mockapi.io/",
    "dataPath":"./data/sessions.json"
}
```

Name|Description
----|-----------
"mongoURI"|MongoDB connection string
"mockapiURI"|Mockapi.io CRUD endpoint
"dataPath"|JSON file path
"jwtSecret"|JWT secret key for token verification


## Service 1: CRUD API for database transactions

Method|Url|Code|Default Response
------|---|----|----------------
GET|/database/sessions|200|Array<Session>
GET|/database/sessions/:id|200|Session
POST|/database/sessions|201|Session
PUT|/database/sessions/:id|200|Session
DELETE|/database/sessions/:id|200|Session


## Service 2: CRUD API for external API transactions

Method|Url|Code|Default Response
------|---|----|----------------
GET|/external/sessions|200|Array<Session>
GET|/external/sessions/:id|200|Session
POST|/external/sessions|201|Session
PUT|/external/sessions/:id|200|Session
DELETE|/external/sessions/:id|200|Session


## Service 3: CRUD API for for filesystem (saving/modifying local json files)

Method|Url|Code|Default Response
------|---|----|----------------
GET|/filesystem/sessions|200|Array<Session>
GET|/filesystem/sessions/:id|200|Session
POST|/filesystem/sessions|201|Session
PUT|/filesystem/sessions/:id|200|Session
DELETE|/filesystem/sessions/:id|200|Session


## Bonus CRUD API for database transactions with JWT middleware for securing you endpoints

Method|Url|Code|Default Response
------|---|----|----------------
GET|/secured/sessions|200|Array<Session>
GET|/secured/sessions/:id|200|Session
POST|/secured/sessions|201|Session
PUT|/secured/sessions/:id|200|Session
DELETE|/secured/sessions/:id|200|Session

Sample Token 

```javascript
{
    "x-auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiUmljaGFyZCBMaW0iLCJyb2xlIjoiQXBwbGljYW50In0.RerWoB7TTp3NXwfcQaxCsvNqVnSotq243EEOo1UVHoI"
}
```

Add the above key value on your http request header


To generate more sample token open the link below 

https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiUmljaGFyZCBMaW0iLCJyb2xlIjoiQXBwbGljYW50In0.RerWoB7TTp3NXwfcQaxCsvNqVnSotq243EEOo1UVHoI

In the VERIFY SIGNATURE section of the page, replace the value of 'your-256-bit-secret' textbox with 'flexisourceitnodejscodingexam'.  This is the jwtSecret value from config/default.json 


## RETURN CODES & ERRORS

APIs return the following HTTP codes which needs to be checked by the end user:

Code|Message
----|-------
200|OK
201|OK
400|Validation error
401|Token is not valid
404|Session not found
409|Session already exist
500|Server error
