const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
const routes = require('./routes')
require('./config/mongoose') //DB CONNECTION

const app = express()
const port = process.env.PORT

// TEMPLATE ENGINE
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// PASSPORT
usePassport(app)

// FLASH MESSAGE
app.use(flash())

// RES LOCALS
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// STATIC FILES
app.use(express.static('public'))

// ROUTER
app.use(routes)

// LISTENING
app.listen(port, () => {
  console.log('The app is listening')
})