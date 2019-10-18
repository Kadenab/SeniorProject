var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  college: String,
  collegeInfo:String,
  skills: String,
  gender: String,
  name: String,
  birthday: String,
  state: String,
  occupation: String,
  bio: String


});

var User = mongoose.model('Users', userSchema);
module.exports = User;