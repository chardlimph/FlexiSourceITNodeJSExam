# NodeJS Coding Exam

## Installation and usage

```javascript

git clone https://github.com/chardlimph/FlexiSourceITNodeJSExam.git


cd FlexiSourceITNodeJSExam

npm install

npm start
```

API url is http://localhost:5000/



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


## RETURN CODES & ERRORS

APIs return the following HTTP codes which needs to be checked by the end user:

Code|Message
----|-------
200|OK
201|OK
400|Validation error
404|Session not found
409|Session already exist
500|Server error
