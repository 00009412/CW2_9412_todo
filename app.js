require("dotenv").config()
const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initPassport = require("./lib/passport/init")

const { getUserByEmail } = require("./lib/db")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const tasksRouter = require("./routes/tasks")
const listsRouter = require("./routes/lists")
const apiv1Router = require("./routes/api")

const app = express()

initPassport(passport, getUserByEmail)

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/tasks", tasksRouter)
app.use("/lists", listsRouter)
app.use("/api/v1", apiv1Router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
