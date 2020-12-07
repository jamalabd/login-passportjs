// bring in dependancies
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// initialize local stratigy function to authenticat user
const initializeLocalStrategy = (passport, getUserByEmail, getUserById) => {
  // create helper function to authenticate user

  const authinticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password Incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new localStrategy({ usernameField: 'email' }, authinticateUser));
  // function to serialize user data
  passport.serializeUser((user, done) => done(null, user.id));
  // function to deserialize user data
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
};

module.exports = initializeLocalStrategy;
