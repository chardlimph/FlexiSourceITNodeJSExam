const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const axios = require('axios');

const config = require('config');
const mockapiSessionURI = `${config.get('mockapiURI')}/Session`;

// @route  GET external/sessions
// @desc   Get all sessions
// @access Private
router.get('/', async (req, res) => {
    try {
        axios.get(mockapiSessionURI)
            .then(function (response) {
                // handle success
                res.json(response.data);
            })
            .catch(function (err) {                
                console.error(err.message);
                res.status(500).send('Server Error');
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST external/sessions
// @desc   Create a session
// @access Private
router.post('/', [
    [   check('session_id', 'Session Id is required')
            .not()
            .isEmpty(),
        check('user_id', 'User Id is required')
            .not()
            .isEmpty()
    ]
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        session_id,
        user_id,
        data
    } = req.body;

    axios.get(`${mockapiSessionURI}?session_id=${session_id}&user_id=${user_id}`)
    .then(function (response) {

        if (response.data.length > 0) {
            return res.status(404).json({ msg: 'Session already exist'});
        }

        try {
            
            const newSession = new Session(
                {
                    session_id: session_id,
                    user_id: user_id,
                    data: data
                }
            );

            axios.post(mockapiSessionURI, newSession)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(function (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
    .catch(function (err) {                
        console.error(err.message);
        res.status(500).send('Server Error');
    });
    
});

// @route  PUT external/sessions
// @desc   Update session
// @access Private
router.put('/:id',[[  
    check('session_id', 'Session Id is required')
        .not()
        .isEmpty(),
    check('user_id', 'User Id is required')
        .not()
        .isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        session_id,
        user_id,
        data
    } = req.body;

    axios.get(`${mockapiSessionURI}/${req.params.id}`)
    .then(function (response) {

        if (response.data.length == 0) {
            return res.status(404).json({ msg: 'Session not found'});
        }

        const session = new Session(response.data);

        session.data = data;
        session.modified_at = Date.now();
        
        axios.put(`${mockapiSessionURI}/${req.params.id}`, session)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        });
    })
    .catch(function (err) {                
        console.error(err.message);
        res.status(500).send('Server Error');
    });
});


// @route  GET database/sessions/:id
// @desc   Get session by ID
// @access Private
router.get('/:id', async (req, res) => {
    try {

        axios.get(`${mockapiSessionURI}/${req.params.id}`)
        .then(function (response) {            
            if (response.data.length == 0) {
                return res.status(404).json({ msg: 'Session not found'});
            }

            res.json(response.data);
        })
        .catch(function (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  DELETE external/sessions/:id
// @desc   Delete a session
// @access Private
router.delete('/:id', async (req, res) => {
    try {

        axios.get(`${mockapiSessionURI}/${req.params.id}`)
        .then(function (response) {            
            if (response.data.length == 0) {
                return res.status(404).json({ msg: 'Session not found'});
            }

            axios.delete(`${mockapiSessionURI}/${req.params.id}`)
            .then(function (response) {
                res.json({ msg: 'Session removed'});
            })
            .catch(function (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
            
        })
        .catch(function (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        });

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Session not found'});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;