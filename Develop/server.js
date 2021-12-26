const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);
    console.log(typeof req.body);
    const newNote = req.body; 
    //const originalNote = '';
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const originalNote = JSON.parse(data);
        newNote.id = uuidv4();
        originalNote.push(newNote);
    
        console.log(originalNote);
        fs.writeFile('./db/db.json', JSON.stringify(originalNote), (err) => {
            if (err) {
                console.log(err);
                res.json({ success: false, newNote});
            } else {
                res.json({ success: true, newNote});
            }
        });
    });    
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(3001, () => console.log(`Listening on port 3001`));