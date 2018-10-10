const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  secretToken:{
    type:String
  },
  activate:{
    type:Boolean
  },
  resetPasswordToken:{
    type:String
  },
  resetPasswordExpires:{
    type:Date
  },
    createdAt:{
      type:Date
    },
    updatedAt:{
      type:Date
    }
});



const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}


module.exports.getUserByEmail = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.getUserByToken = function(token, callback){
  const query = {secretToken: token}
  User.findOne(query, callback);
}

module.exports.getAllUsers = function( callback){
  User.find(callback);
}


module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) return err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}






module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
}
