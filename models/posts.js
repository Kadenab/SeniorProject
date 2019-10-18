var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
  name: String,
  comment: String,
  date: Date
});


var Posts = mongoose.model('posts', postsSchema);
module.exports = Posts;