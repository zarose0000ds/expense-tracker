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
    if (record) {
      // FOR CATEGORY SELECT OPTIONS
      return Category.find().lean().sort({ id: 'asc' }).then(category => {
        // FOR RETURNING CURRENT SELECTED CATEGORY
        for (let i = 0; i < category.length; i++) {
          if (category[i].id === Number(record.categoryId)) {
            category[i].selected = 'selected'
            break
          }
        }
        // TRANSFER DATE OBJECT TO STRING(ISO formation)
        record.date = record.date.toISOString().split('T')[0]

        res.render('edit', { record, category })
      })
    }
  }).catch(e => console.log(e))
})

router.put('/:id', recordValidator('edit'), (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { name, date, categoryId, amount } = req.body

  Record.findOne({ id, userId }).then(record => {
    if (record) {
      record.name = name
      record.date = new Date(date + 'T12:00:00.000+08:00')
      record.categoryId = Number(categoryId)
      record.amount = Number(amount)
      record.save()
    }
  }).then(() => res.redirect('/')).catch(e => console.log(e))
})

router.delete('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id

  Record.findOne({ id, userId }).then(record => {
    if (record) {
      record.remove()
    }
  }).then(() => res.redirect('/')).catch(e => console.log(e))
})

module.exports = router