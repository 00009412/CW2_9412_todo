const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.redirect("/signin")
}

module.exports = checkAuth
