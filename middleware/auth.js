function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('warning_msg', '請先登入！')
  res.redirect('/users/login')
}

module.exports = auth