const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy

const init = (passport, getUserByEmail) => {
  const auth = async (email, password, done) => {
    const user = await getUserByEmail({ email })
 
    if (!user || user === null) return done(null, false, {
      message: "Такого пользователя не существует"
    })

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: "Неверный пароль"
        })
      }
    } catch(e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: "email" }, auth))

  passport.serializeUser((user, done) => {
    return done(null, user.email)
  })

  passport.deserializeUser((email, done) => {
    return done(null, getUserByEmail({ email }))
  })
}

module.exports = init
