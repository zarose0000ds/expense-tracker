const router = require('express').Router()

const { recordValidator } = require('../../middleware/formValidate')

const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/new', (req, res) => {
  Category.find().lean().sort({ id: 'asc' }).then(category => res.render('new', { category })).catch(e => console.log(e))
})

router.post('/new', recordValidator('new'), (req, res) => {
  const userId = req.user.id
  const { name, date, categoryId, amount } = req.body

  Record.estimatedDocumentCount().then(count => {
    const id = count + 1
    const dateObject = new Date(date + 'T12:00:00.000+08:00')
    return Record.create({ id, name, date: dateObject, amount, userId, categoryId }).then(() => res.redirect('/'))
  }).catch(e => console.log(e))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user.id
  const id = req.params.id

  Record.findOne({ id, userId }).lean().then(record => {
    res.render('edit', { record })
  }).catch(e => console.log(e))
})

module.exports = router