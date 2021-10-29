module.exports = {
  recordValidator: (failureRedirect) => {
    return (req, res, next) => {
      const { name, date, categoryId, amount } = req.body
      const dateNow = Date.now()
      const errors = []

      if (!name || !date || Number(categoryId) <= 0 || !amount) {
        errors.push({ message: '請填寫所有必填項目！' })
      }
      if (date && Date.parse(date) > dateNow) {
        errors.push({ message: '日期不得超過今天！' })
      }
      if (amount && Number(amount) <= 0) {
        errors.push({ message: '金額需大於0！' })
      }
      if (errors.length > 0) {
        // FOR CATEGORY SELECT OPTIONS
        return require('../models/category').find().lean().sort({ id: 'asc' }).then(category => {
          // FOR RETURNING CURRENT SELECTED CATEGORY
          for (let i = 0; i < category.length; i++) {
            if (category[i].id === Number(categoryId)) {
              category[i].selected = 'selected'
              break
            }
          }
          res.render('new', { errors, category, record: req.body })
        }).catch(e => console.log(e))
      }

      next()
    }
  }
}