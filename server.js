const express = require('express');
const connectToDB = require('./config/db');

const app = express();

connectToDB();

app.use(express.json({extended: false}));

app.get('/',(req,res) => res.send('Richard Lim - FlexiSourceIT NodeJS Code Exam API Running'));

app.use('/database/sessions', require('./database/sessions'));

app.use('/external/sessions', require('./external/sessions'));

app.use('/filesystem/sessions', require('./filesystem/sessions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server started on port ${PORT}`));