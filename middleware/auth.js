function auth(req, res, next) {
  if (req.isAuthenticated) {
    return next()
  }
  req.flash('warning_msg', 'Please login first!')
  res.redirect('/users/login')
}

module.exports = auth