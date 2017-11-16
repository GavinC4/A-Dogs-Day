var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use('local-login', new LocalStrategy(
  function(username, password, done){
    db.User.findOne({
      where: {
        username: username
      }
    // }).then(function(err, user) {
    }).then(function(user) {

      if(!user) {
        return done(null, false, {errMsg: "Unknown user."});
      }
      if(!user.validPassword(password)) {
        return done(null, false, {errMsg: "Incorrect password."});
      }
      return done(null, user);
    });
  }
));

// Configure Passport authenticated session persistence
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

module.exports = passport;