// server/config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      console.log('Attempting authentication for email:', email);
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'User not found' });
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      
      console.log('Authentication successful for user:', user.email);
      return done(null, user);
    } catch (err) {
      console.error('Authentication error:', err);
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user:', id);
      const user = await User.findById(id);
      console.log('Deserialized user:', user ? user.email : 'not found');
      done(null, user);
    } catch (err) {
      console.error('Deserialization error:', err);
      done(err, null);
    }
  });
};