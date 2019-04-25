let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let subscriberSchema = new Schema({
    email: {type: String, required: true}
});

module.exports = mongoose.model('Subscriber', subscriberSchema);