if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')

const Category = require('../category')

const CATEGORY = {
  家居物業: 'https://fontawesome.com/icons/home?style=solid',
  交通出行: 'https://fontawesome.com/icons/shuttle-van?style=solid',
  休閒娛樂: 'https://fontawesome.com/icons/grin-beam?style=solid',
  餐飲食品: 'https://fontawesome.com/icons/utensils?style=solid',
  其他: 'https://fontawesome.com/icons/pen?style=solid'
}
const CATEGORY_NAMES = Object.keys(CATEGORY)

db.once('open', () => {
  const categories = []

  CATEGORY_NAMES.forEach((name, id) => {
    const faIcon = CATEGORY[name].split('/').pop().split('?')[0] //GET FONT AWESOME ICON NAME FOR <i class="fas fa-{{name}}"></i>
    const category = {
      id: id + 1,
      name,
      faIcon
    }
    categories.push(category)
  })

  Category.create(categories).then(() => {
    console.log('Category done')
    process.exit()
  }).catch(e => console.log(e))
})