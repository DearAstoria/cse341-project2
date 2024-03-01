const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "349481215638-lk90ncapv3j5i50jmqphv1j0tjdb8dvi.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the profile information to create or update a user in your database
      // The 'profile' object contains information about the authenticated user
      // You might want to store relevant details like email, display name, etc.
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
