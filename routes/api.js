const express = require("express")
const { getUserTasksByEmail, getUserListsByEmail } = require("../lib/db")
const router = express.Router()

router.get("/user/:email/tasks", async (req, res) => {
  res.json(await getUserTasksByEmail({ email: req.params.email }))
})

router.get("/user/:email/lists", async (req, res) => {
  res.json(await getUserListsByEmail({ email: req.params.email }))
})

module.exports = router
