const router = require('express').Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user.id

  // GET USER'S RECORDS SORTED WITH DATE IN DESCENDING ORDER
  Record.find({ userId }).lean().sort({ date: 'desc', id: 'desc' }).then(records => {
    if (records.length > 0) {
      const category = {} //FOR ID-ICON(FONT AWESOME) PAIRS
      const categorySelect = [] //FOR SELECT OPTIONS CONTENT

      // GET ALL CATEGORIES DATA SORTED WITH ID IN ASCENDING ORDER
      Category.find().lean().sort({ id: 'asc' }).then(categories => {
        categories.forEach(item => {
          category[item.id] = item.faIcon
          categorySelect.push({ id: item.id, name: item.name })
        })
      }).then(() => {
        records.forEach(record => {
          // FOR FRONT-END DISPLAY
          record.icon = category[record.categoryId]
          record.dateString = record.date.toISOString().split('T')[0].replace(/\-/g, '/')
        })
      }).then(() => res.render('index', { categorySelect, records }))
    }
  }).catch(e => console.log(e))
})

module.exports = router