const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    first_name: {
         type: String, 
         required: true
     },
    last_name: {
         type: String, 
         required: true
    },
    birthday: { 
        type: Date, 
        required: true
    }
    });


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('User', userSchema);
