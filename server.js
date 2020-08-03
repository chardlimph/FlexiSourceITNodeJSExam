const express = require('express');

const app = express();

app.use(express.json({extended: false}));

app.get('/',(req,res) => res.send('Richard Lim - FlexiSourceIT NodeJS Code Exam API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server started on port ${PORT}`));