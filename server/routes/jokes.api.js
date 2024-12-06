'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
let jokes = []
let id_counter;

/**
 * Use express json middleware to get json request body in POST request
 */
router.use(express.json())

fs.readFile('./server/data/jokes.json', (err, data) => {
    if (err) throw err;

    jokes = JSON.parse(data);
    id_counter = jokes.length;
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
    let vis_jokes = jokes.filter((joke) => {
        return joke.visible;
    });
    let index = Math.floor(Math.random() * vis_jokes.length);
    res.send(vis_jokes[index]);
});

/**
 * @swagger
 * /api/jokes/create:
 *  post:
 *      summary: Add a new joke
 *      description: Add a new joke to the list of jokes
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: joke
 *          description: The joke to be added
 *          schema:
 *              type: object
 *              required:
 *                  - type
 *                  - lead
 *                  - punchline
 *                  - tags
 *                  - author 
 *              properties:
 *                  type:
 *                      type: string
 *                  lead:
 *                      type: string
 *                  punchline:
 *                      type: string
 *                  tags:
 *                      type: array
 *                      example: ["tag1", "tag2"]
 *                  author:
 *                      type: string
 *      responses:
 *          200:
 *              description: Successfully added a new joke to the list of jokes
 *              content:
 *                  application/text:
 *                      schema:
 *                          type: string
 *                          example: success
 *          400:
 *              description: Bad request, parameters have not been provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              type:
 *                                  type: bool
 *                                  example: false
 *                              lead:
 *                                  type: bool
 *                                  example: true
 *                              punchline:
 *                                  type: bool
 *                                  example: true
 *                              tags:
 *                                  type: bool
 *                                  example: true
 *                              author:
 *                                  type: bool
 *                                  example: false
 *
 */
router.post('/create', (req, res) => {
    /**
     * checks whether all parameters have been provided
     * ! This endpoint needs further testing and error-checking
     */
    if (!(req.body.type && req.body.lead && req.body.punchline && req.body.tags && req.body.author)) {
        let fail_response = {
            "id": (id_counter ? true : false),
            "type": (req.body.type ? true : false),
            "lead": (req.body.lead ? true : false),
            "punchline": (req.body.punchline ? true : false),
            "tags": (req.body.tags ? true : false),
            "author": (req.body.author ? true : false),
            "visible": false,
            "reports": 0
        };
        res.status(400);
        res.send(fail_response);
        res.end();
    }
    jokes.push({
        "id": id_counter,
        "type": req.body.type,
        "lead": req.body.lead,
        "punchline": req.body.punchline,
        "tags": req.bod.tags.toString().split(','),
        "author": req.body.author,
        "visible": true,
        "reports": 0
    });
    id_counter++;
    // Naive approach, shouldn't re-write the entire object every time a joke is added, just add the joke to the file
    fs.writeFileSync('./server/data/jokes.json', JSON.stringify(jokes));
    res.status(200);
    res.send("success");

});

/**
 * @swagger
 * /api/jokes/report:
 *  post:
 *      summary: report a potentially offensive joke
 *      description: Adds a report to a joke - once a joke has received a certain number of reports, it is no longer visible and needs to be reviewed
 *      parameters:
 *        - in: query
 *          name: id
 *          scheme:
 *              type: int
 *          description: Unique identifier of the joke
 *          required: true
 *      responses:
 *          200:
 *              description: Joke has been reported succesfully
 *              content:
 *                  application/text:
 *                      schema:
 *                          type: string
 *                          example: success
 *          400:
 *              description: The provided joke ID was not found/doesn't exist or is invalid
 *              content:
 *                  application/text:
 *                      schema:
 *                          type: string
 *                          example: Joke does not exist
 */
router.post('/report', (req, res) => {
    if (req.query.id > jokes.length || req.query.id < 0) {
        res.status(400)
        res.send("Joke does not exist");
        res.end();
    }

    jokes[req.query.id].reports++;
    if (jokes[req.query.id].reports >= 10) {
        jokes[req.query.id].visible = false
    }

    fs.writeFileSync('./server/data/jokes.json', JSON.stringify(jokes));
    res.status(200);
    res.send("success");
    res.end();
});

module.exports = router