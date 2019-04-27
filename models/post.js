let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = Schema({
	date: {type: Date, default: Date.now},
    title: {type: String, required: true},
    body: {type: Buffer, required: true},
    tags:[{type: String}],
    url:[{type: String}],
    author: {type: String, required: true},
    comments: [{ body: String, date: Date }]
});


module.exports = mongoose.model('Post', postSchema);