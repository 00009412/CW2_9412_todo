const express = require("express")
const {
  getUserTasksByEmail,
  getUserListsByEmail,
  getTaskById,
} = require("../lib/db")
const checkAuth = require("../lib/passport/checkAuth")
const checkNonAuth = require("../lib/passport/checkNonAuth")
const router = express.Router()

router.get("/", checkAuth, async (req, res) => {
  const user = await req.user
  const tasks = await getUserTasksByEmail({ email: user.email })
  const lists = await getUserListsByEmail({ email: user.email })

  res.render("index", {
    email: user.email,
    tasks,
    lists,
    activeList: "All",
  })
})

router.get("/signin", checkNonAuth, (req, res) => {
  res.render("signin")
})

router.get("/signup", checkNonAuth, (req, res) => {
  res.render("signup")
})

module.exports = router
