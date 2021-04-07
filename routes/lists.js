const express = require("express")
const {
  createList,
  getUserTasksByEmail,
  getUserListsByEmail,
  deleteList,
} = require("../lib/db")
const checkAuth = require("../lib/passport/checkAuth")
const router = express.Router()

router.post("/", checkAuth, async (req, res) => {
  const user = await req.user

  await createList({
    email: user.email,
    list: req.body.list,
  })

  res.redirect("/")
})

router.get("/:list", checkAuth, async (req, res) => {
  const user = await req.user

  const tasks = (await getUserTasksByEmail({ email: user.email })).filter(
    (task) => task.list === req.params.list
  )

  const lists = await getUserListsByEmail({ email: user.email })

  res.render("index", {
    email: user.email,
    tasks,
    lists,
    activeList: req.params.list,
  })
})

router.post("/delete", checkAuth, async (req, res) => {
  const user = await req.user

  await deleteList({ email: user.email, list: req.body.list })

  res.redirect("/")
})

module.exports = router
