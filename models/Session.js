const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new mongoose.Schema({
    session_id: {
        type: String        
    },
    user_id: {
        type: Number
    },
    data: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    modified_at: {
        type: Date
    }
});

module.exports = Session = mongoose.model('session', SessionSchema);