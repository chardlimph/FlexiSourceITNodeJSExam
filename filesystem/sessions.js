const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const fs = require('fs');
const dataPath = require('config').get('dataPath');

const _ = require('underscore');

const Session = require('../models/Session');

// @route  GET filesystem/sessions
// @desc   Get all sessions
// @access Private
router.get('/', async (req, res) => {
    try {

        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            } else {
                return res.json(JSON.parse(data || '[]'));
            }
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  POST filesystem/sessions
// @desc   Create a session
// @access Private
router.post('/', [
    [   
        check('session_id', 'Session Id is required')
            .not()
            .isEmpty(),
        check('user_id', 'User Id is required')
            .not()
            .isEmpty()
    ]
], async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            session_id,
            user_id,
            data
        } = req.body;

        fs.readFile(dataPath, "utf8", (err, dat) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            } else {
                const sessions = JSON.parse(dat || '[]');
                const session = _.filter(sessions, { "session_id": session_id, "user_id": user_id });
            
                if (session.length == 0) {
                    const newSession = [new Session({
                        session_id: session_id,
                        user_id: user_id,
                        data: data,
                        id: sessions.length == 0 ? 1 : _.max(sessions, (e) => e.id).id+1 
                    })];

                    fs.writeFile(dataPath,JSON.stringify(_.union(sessions, newSession)),'utf8',(e) =>{
                        if (e) { 
                            console.error(e.message);
                            return res.status(500).send('Server Error');
                        } else {
                            return res.json(newSession);
                        }
                    });
                } else {
                    return res.status(409).json({ msg: 'Session already exist'});
                }
            }
        });
     
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  PUT filesystem/sessions
// @desc   Update session
// @access Private
router.put('/:id', async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            session_id,
            user_id,
            data
        } = req.body;
        
        const id = Number(req.params.id);

        fs.readFile(dataPath, "utf8", (err, dat) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            } else {
                const sessions = JSON.parse(dat || '[]')
                                     .map((e) => new Session(e));
                const session = _.filter(sessions, { "id": id });
             
                if (session.length == 0) {
                    return res.status(404).json({ msg: 'Session not found'});
                } else {
                                        
                    session[0].data = data;
                    session[0].modified_at = Date.now();

                    fs.writeFile(dataPath,JSON.stringify(_.union(sessions, session)),'utf8',(e) =>{
                        if (e) { 
                            return res.status(500).send('Server Error');
                        } else {
                            return res.json(session[0]);
                        }
                    });
                }
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET filesystem/sessions/:id
// @desc   Get session by ID
// @access Private
router.get('/:id', async (req, res) => {
    try {

        const id = Number(req.params.id);
        
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            } else {
                const session = _.filter(JSON.parse(data || '[]'), { "id": id })
                                 .map((e) => new Session(e));
                
                if (session.length == 0) {
                    return res.status(404).json({ msg: 'Session not found'});
                } else {
                    return res.json(session[0]);
                }
            }
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  DELETE filesystem/sessions/:id
// @desc   Delete a session
// @access Private
router.delete('/:id', async (req, res) => {
    try {

        const id = Number(req.params.id);

        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Server Error');
            } else {
                const sessions = JSON.parse(data || '[]');
                const removedSession = _.filter(sessions, { "id": id })
                                        .map(e => new Session(e));

                if (removedSession.length == 0) {
                    return res.status(404).json({ msg: 'Session not found'});
                } else {
                    fs.writeFile(dataPath,JSON.stringify(_.reject(sessions, (e) => e.id === id)),'utf8',(e) =>{
                        if (e) { 
                            console.error(e.message);
                            return res.status(500).send('Server Error');
                        } else {
                            return res.json(removedSession[0]);
                        }
                    });
                }
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;