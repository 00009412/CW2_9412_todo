const express = require("express")
const bcrypt = require("bcrypt")
const { createUser } = require("../lib/db")
const passport = require("passport")
const router = express.Router()

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
  })
)

router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  await createUser({
    email: req.body.email,
    password: hashedPassword,
  })

  passport.authenticate("local")(req, res, function () {
    res.redirect("/")
  })
})

router.get("/signout", (req, res) => {
  req.logout()
  res.redirect("/signin")
})

module.exports = router
