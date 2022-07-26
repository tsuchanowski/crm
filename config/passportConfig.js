const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/User')

module.exports = () => {

  // =============================
  // passport SESSION setup
  // =============================
  passport.serializeUser(function (email, done) {
    done(null, email._id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (error, user) {
      done(error, user)
    })
  })

  passport.use(
    'local-login',
    new LocalStrategy(function (email, password, done) {

      console.log('LocalStrategy User.findOne')
      console.log(email)
      console.log(password)

      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
            return done(
              null,
              false
            )
        }

        bcrypt.compare(password, user.password, function (error, res) {
            if (res) {
              // logged in
              return done(
                null,
                user
              )
            } else {
              // wrong password
              return done(
                null,
                false
              )
            }
          })

      })
    })
  )
}
