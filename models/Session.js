const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const SessionSchema = new mongoose.Schema({
    id: {
        type: Number        
    },
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

SessionSchema.plugin(autoIncrement.plugin,{ model: 'Session', field: 'id', startAt: 1 });

module.exports = Session = mongoose.model('session', SessionSchema);