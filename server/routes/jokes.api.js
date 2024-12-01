'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
let jokes = []

fs.readFile('./server/data/jokes.json', (err, data) => {
    if (err) throw err;

    jokes = JSON.parse(data);
});

/**
 * @swagger
 * /api/jokes/random:
 *  get:
 *      summary: Get a random joke
 *      description: Read from the file storing all the jokes and generate a random index to choose one of the jokes
 *      responses:
 *          200:
 *              description: Random joke in JSON sent to client
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              type:
 *                                  type: string,
 *                                  description: The type of joke
 *                                  example: "Dry"
 *                              lead:
 *                                  type: string,
 *                                  description: The lead of the joke
 *                                  example: "Why did the chicken cross the road"
 *                              punchline:
 *                                  type: string
 *                                  description: The punchline of the joke
 *                                  example: "To get to the other side"
 *                              tags:
 *                                  type: array
 *                                  description: An array of tags pertaining to the joke
 *                                  example: ["dry", "depressing", "whack"]
 *                                  items:
 *                                      type: string
 *                                      example: "hilarious"
 *                              author:
 *                                  type: string
 *                                  description: The author/source of the joke
 *                                  example: "John Smith"
 *                                          
 */
router.get('/random', (req, res) => {
    let index = Math.floor(Math.random() * jokes.length);
    res.send(jokes[index]);
});

/**
 * @swagger
 * /api/jokes/create:
 *  post:
 *      summary: Add a new joke
 *      description: Add a new joke to the list of jokes
 */
router.post('/create', (req, res) => {
    if (!(req.query.type && req.query.lead && req.query.punchline && req.query.tags && req.query.author)) {
        res.status(400);
        res.send('Required arguments not provided for ');
    }
    res.send('you are not nice');
});

module.exports = router