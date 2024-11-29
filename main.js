'use strict';

const express = require('express');
const app = express();

let jokes = require('data/jokes.json')

app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

/* 
 *------------- ! API Endpoints ! -------------------
 */

/**
 * 
 */
app.get('/api/joke/random', (req, res) => {
    let index = Math.floor(Math.random() * jokes.length);
    res.send(jokes[index])
});

app.post('/api/joke/new')

app.listen(process.env.PORT);