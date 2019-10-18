var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var threadsSchema = new Schema({
	userName: String,
	threadTitle: String,
	posts: [{
		owner: String,
		comment: String,
		date: { type: Date, default: Date.now }
	}]
});

var Threads = mongoose.model('Threads', threadsSchema);
Threads = mongoose.model('thread', threadsSchema);
module.exports = Threads;