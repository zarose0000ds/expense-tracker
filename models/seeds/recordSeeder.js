const bcrypt = require('bcrypt')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')

const User = require('../user')
const Record = require('../record')

const SEED_USER = [
  {
    id: 1,
    name: '廣志',
    email: 'hiroshi@example.com',
    password: '12345678',
    seed_record_index: [0, 1, 2]
  },
  {
    id: 2,
    name: '小新',
    email: 'shinnosuke@example.com',
    password: '12345678',
    seed_record_index: [3, 4, 5]
  }
]
const SEED_RECORD = [
  {
    id: 1,
    name: '午餐',
    date: new Date('2019-04-23T12:00:00.000+08:00'),
    amount: 80,
    categoryId: 4
  },
  {
    id: 2,
    name: '晚餐',
    date: new Date('2019-04-23T12:00:00.000+08:00'),
    amount: 120,
    categoryId: 4
  },
  {
    id: 3,
    name: '捷運',
    date: new Date('2019-04-23T12:00:00.000+08:00'),
    amount: 100,
    categoryId: 2
  },
  {
    id: 4,
    name: '電影：動感超人',
    date: new Date('2019-04-24T12:00:00.000+08:00'),
    amount: 60,
    categoryId: 3
  },
  {
    id: 5,
    name: '水費',
    date: new Date('2019-04-24T12:00:00.000+08:00'),
    amount: 1200,
    categoryId: 1
  },
  {
    id: 6,
    name: '小熊餅乾',
    date: new Date('2019-04-25T12:00:00.000+08:00'),
    amount: 160,
    categoryId: 4
  }
]

db.once('open', () => {
  User.estimatedDocumentCount().then(userCount => {
    Record.estimatedDocumentCount().then(recordCount => {
      Promise.all(Array.from(SEED_USER, seedUser => {
        const id = userCount + seedUser.id

        return bcrypt.genSalt(10).then(salt => bcrypt.hash(seedUser.password, salt)).then(hash => User.create({
          id,
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        })).then(user => {
          const records = []

          seedUser.seed_record_index.forEach(index => {
            SEED_RECORD[index].id += recordCount
            SEED_RECORD[index].userId = user.id
            records.push(SEED_RECORD[index])
          })

          return Record.create(records)
        })
      })).then(() => {
        console.log('Record done')
        process.exit()
      })
    })
  }).catch(e => console.log(e))
})