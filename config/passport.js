const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = app => {
  // INITIALIZE
  app.use(passport.initialize())
  app.use(passport.session())

  // STRATEGY
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email }).then(user => {
      if (!user) return done(null, false, req.flash('warning_msg', '此Email尚未註冊！'))

      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return done(null, false, req.flash('warning_msg', 'Email或密碼輸入錯誤！'))
        return done(null, user)
      })
    }).catch(e => done(e, false))
  }))

  // SERIALIZER
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // DESERIALIZER
  passport.deserializeUser((id, done) => {
    User.findOne({ id }).lean().then(user => done(null, user)).catch(e => done(e, null))
  })
}