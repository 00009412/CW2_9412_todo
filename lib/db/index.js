const path = require("path")
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync(path.join(__dirname, "data.json"))

const db = low(adapter)

db.defaults({ users: [] }).write()

exports.createUser = async ({ email, password }) => {
  if (!db.get("users").find({ email }).value())
    db.get("users")
      .push({
        email,
        password,
        tasks: [],
        lists: ["Inbox", "Work", "Education"],
      })
      .write()
}

exports.getUserByEmail = async ({ email }) => {
  return db.get("users").find({ email }).value()
}

exports.getUserTasksByEmail = async ({ email }) => {
  return db.get("users").find({ email }).value().tasks
}

exports.getUserListsByEmail = async ({ email }) => {
  return db.get("users").find({ email }).value().lists
}

exports.createTask = async ({ email, task, list }) => {
  const tasks = db.get("users").find({ email }).get("tasks").value()

  tasks.push({
    id: `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`,
    task,
    list,
  })

  db.get("users").find({ email }).assign({ tasks }).write()
}

exports.getTaskById = async ({ email, taskId }) => {
  return db
    .get("users")
    .find({ email })
    .value()
    .tasks.find((task) => task.id === taskId)
}

exports.createList = async ({ email, list }) => {
  const lists = db.get("users").find({ email }).get("lists").value()

  lists.push(list)

  db.get("users").find({ email }).assign({ lists }).write()
}

exports.deleteList = async ({ email, list }) => {
  const lists = db
    .get("users")
    .find({ email })
    .get("lists")
    .value()
    .filter((l) => l !== list)

  db.get("users").find({ email }).assign({ lists }).write()
}

exports.deleteTask = async ({ email, taskId }) => {
  const tasks = db
    .get("users")
    .find({ email })
    .get("tasks")
    .value()
    .filter((task) => task.id !== taskId)

  db.get("users").find({ email }).assign({ tasks }).write()
}

exports.editTask = async ({ email, taskId, task }) => {
  const tasks = db
    .get("users")
    .find({ email })
    .get("tasks")
    .value()
    .map((t) => {
      if (t.id !== taskId) return t

      return {
        ...t,
        task,
      }
    })

  db.get("users").find({ email }).assign({ tasks }).write()
}

exports.moveTask = async ({ email, taskId, list }) => {
  const tasks = db
    .get("users")
    .find({ email })
    .get("tasks")
    .value()
    .map((t) => {
      if (t.id !== taskId) return t

      return {
        ...t,
        list,
      }
    })

  db.get("users").find({ email }).assign({ tasks }).write()
}
