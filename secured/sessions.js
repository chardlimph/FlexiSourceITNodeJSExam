const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const Session = require('../models/Session');

// @route  GET database/sessions
// @desc   Get all sessions
// @access Private
router.get('/', auth, async (req, res) => {
    try {

        console.log('Authenticated user details :');
        console.log(req.user);

        const sessions = await Session.find().sort({ date: -1});
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST database/sessions
// @desc   Create a session
// @access Private
router.post('/', [auth,
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

        const session = await Session.findOne({ session_id: session_id, user_id: user_id});

        if (session) {
            return res.status(409).json({ msg: 'Session already exist'});
        }

        const newSession = new Session(
            {
                session_id: session_id,
                user_id: user_id,
                data: data
            }
        );

        const savedSession = await newSession.save();

        res.json(savedSession);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  PUT database/sessions
// @desc   Update session
// @access Private
router.put('/',[auth, [  
    check('session_id', 'Session Id is required')
        .not()
        .isEmpty(),
    check('user_id', 'User Id is required')
        .not()
        .isEmpty()
]] , async (req, res) => {
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

        const session = await Session.findOne({ session_id: session_id, user_id: user_id});

        if (!session) {
            return res.status(404).json({ msg: 'Session not found'});
        }

        session.data = data;
        session.modified_at = Date.now();

        await session.save();

        res.json(session);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET database/sessions/:id
// @desc   Get session by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOne({ id: req.params.id});

        if (!session) {
            return res.status(404).json({ msg: 'Session not found'});
        }

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  DELETE database/sessions/:id
// @desc   Delete a session
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOne({ id: req.params.id});
        
        if (!session) {
            return res.status(404).json({ msg: 'Session not found'});
        }

        await session.remove();

        res.json({ msg: 'Session removed'});
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Session not found'});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;