const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const note = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
})

const noteSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    notes: [note]
});

module.exports = mongoose.model('Note' , noteSchema);