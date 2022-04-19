const express = require('express');
const path = require('path');
const fs = require('fs')
const util = require('util')
// Helper method for generating unique ids
const {v1: uuidv1} = require('uuid')

const PORT = 3001;

const app = express();
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

function read() {
    return readFileAsync('db/db.json', "utf8")
}

function write(note) {
    return writeFileAsync('db/db.json', JSON.stringify(note));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res)=> {
    read().then((notes)=> {
        let readNotes = []
        try{
            readNotes= [].concat(JSON.parse(notes))
        } catch(err){
            readNotes = []
        }
        return res.json (readNotes)
    }) 
})

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newNote = {title, text, id: uuidv1()};
    read().then((notes) => {
        let readNotes = [];
        try {
            readNotes= [].concat(JSON.parse(notes))
            readNotes.push(newNote)
            console.log(readNotes)
        }catch(err){
            readNotes = []
        }
        return write(readNotes)
    })
    .then((note) => res.json(note))
    .catch((err) => {
        res.status(500).json(err)
    })
})

app.get("/notes", (req, res)=> {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})
app.get("*", (req, res)=> {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, ()=> console.log(`listening on port ${PORT}`
))