// server/config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy({ 
    usernameField: 'email' 
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'User not found' });
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      
      return done(null, user);
    } catch (err) {
      console.error('Authentication error:', err);
      return done(err);
    }
  }));

  // Google Strategy
 // In the Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails[0].value;

    if (!email.endsWith('@iiitn.ac.in')) {
      return done(null, false, { 
        message: 'Please use your IIIT Nagpur email (@iiitn.ac.in) to sign in.' 
      });
    }

    let user = await User.findOne({ email: email });
    
    if (!user) {
      return done(null, false, { 
        message: 'This email is not registered in our system. Please contact the administrator.' 
      });
    }

    // Update user's Google info
    user.googleId = profile.id;
    if (profile.photos && profile.photos[0]) {
      user.avatar = profile.photos[0].value;
    }
    await user.save();

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Deserialization error:', err);
      done(err, null);
    }
  });
};