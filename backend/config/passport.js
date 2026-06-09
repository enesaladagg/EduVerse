const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/email');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Helper function to create or update an OAuth user
const handleOAuthUser = async (profile, provider, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error(`No email provided by ${provider}.`));
    }

    let user;
    if (provider === 'google') {
      user = await User.findOne({ googleId: profile.id });
    } else if (provider === 'linkedin') {
      user = await User.findOne({ linkedinId: profile.id });
    }

    if (user) {
      return done(null, user);
    }

    // Try finding by email
    user = await User.findOne({ email });

    if (user) {
      // Link the account
      if (provider === 'google') user.googleId = profile.id;
      if (provider === 'linkedin') user.linkedinId = profile.id;
      if (!user.profilePicture && profile.photos && profile.photos.length > 0) {
        user.profilePicture = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }

    // Create a new user
    const newUser = new User({
      name: profile.displayName || profile.name?.givenName || 'User',
      email,
      role: 'student',
      isVerified: true,
      profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
    });

    if (provider === 'google') newUser.googleId = profile.id;
    if (provider === 'linkedin') newUser.linkedinId = profile.id;

    await newUser.save();

    // Send welcome email for new OAuth users
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const providerLabel = provider === 'google' ? 'Google' : 'LinkedIn';
      sendEmail({
        email: newUser.email,
        subject: `EduVerse'e Hoş Geldiniz! 🎓`,
        template: 'welcome',
        data: { name: newUser.name, provider: providerLabel },
      }).catch((err) => console.error('OAuth welcome email gönderilemedi:', err.message));
    }

    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
};

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      await handleOAuthUser(profile, 'google', done);
    }
  ));
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/api/auth/linkedin/callback",
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    async (accessToken, refreshToken, profile, done) => {
      await handleOAuthUser(profile, 'linkedin', done);
    }
  ));
}

module.exports = passport;
