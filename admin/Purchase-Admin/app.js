const express = require('express');
const path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

const port = process.env.port || '4203';

app.listen(port, () => {
    console.log(`admin app started on port - ${port}`);
})
