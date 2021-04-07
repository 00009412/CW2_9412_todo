const express = require("express")
const {
  createTask,
  getTaskById,
  deleteTask,
  getUserListsByEmail,
  editTask,
  moveTask,
} = require("../lib/db")
const checkAuth = require("../lib/passport/checkAuth")
const router = express.Router()

router.post("/", checkAuth, async (req, res) => {
  const user = await req.user

  await createTask({
    email: user.email,
    task: req.body.task,
    list: req.body.list,
  })

  res.redirect("/")
})

router.get("/:id", checkAuth, async (req, res) => {
  const user = await req.user

  const task = await getTaskById({ email: user.email, taskId: req.params.id })
  const lists = await getUserListsByEmail({ email: user.email })

  res.render("task", {
    task,
    lists,
  })
})

router.get("/delete/:id", checkAuth, async (req, res) => {
  const user = await req.user

  await deleteTask({ email: user.email, taskId: req.params.id })

  res.redirect("/")
})

router.post("/edit/:id", checkAuth, async (req, res) => {
  const user = await req.user

  await editTask({
    email: user.email,
    taskId: req.params.id,
    task: req.body.task,
  })

  res.redirect(`/tasks/${req.params.id}`)
})

router.post("/move/:id", checkAuth, async (req, res) => {
  const user = await req.user

  await moveTask({
    email: user.email,
    taskId: req.params.id,
    list: req.body.list,
  })

  res.redirect(`/tasks/${req.params.id}`)
})

module.exports = router
