const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true}), (req, res) => {})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '登出成功。')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirm_password } = req.body
  const errors = []

  if (!name || !email || !password || !confirm_password) {
    errors.push({ message: '所有項目皆為必填！' })
  }
  if (password !== confirm_password) {
    errors.push({ message: '兩組密碼不相同！' })
  }
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirm_password
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此Email已註冊！' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirm_password
      })
    }

    return User.estimatedDocumentCount().then(count => {
      const id = count + 1
      bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt)).then(hash => User.create({
        id,
        name,
        email,
        password: hash
      })).then(() => res.redirect('/users/login'))
    })
  }).catch(e => console.log(e))
})

module.exports = router