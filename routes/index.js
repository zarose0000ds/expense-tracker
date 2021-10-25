const router = require('express').Router()
const auth = require('../middleware/auth')
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

router.use('/users', users)
router.use('/records', auth, records)
router.use('/', auth, home)

module.exports = router