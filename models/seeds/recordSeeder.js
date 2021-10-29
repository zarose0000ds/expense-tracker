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
    seed_record_index: [0, 2, 4, 6, 8]
  },
  {
    id: 2,
    name: '小新',
    email: 'shinnosuke@example.com',
    password: '12345678',
    seed_record_index: [1, 3, 5, 7, 9]
  }
]
const SEED_RECORD = [
  {
    id: 1,
    name: '水費',
    date: new Date('2021-10-01T12:00:00.000+08:00'),
    amount: 1210,
    categoryId: 1
  },
  {
    id: 2,
    name: '房租',
    date: new Date('2021-10-01T12:00:00.000+08:00'),
    amount: 8000,
    categoryId: 1
  },
  {
    id: 3,
    name: '捷運',
    date: new Date('2021-10-01T12:00:00.000+08:00'),
    amount: 100,
    categoryId: 2
  },
  {
    id: 4,
    name: '高鐵',
    date: new Date('2021-10-01T12:00:00.000+08:00'),
    amount: 710,
    categoryId: 2
  },
  {
    id: 5,
    name: '戰車模型',
    date: new Date('2021-10-15T12:00:00.000+08:00'),
    amount: 2400,
    categoryId: 3
  },
  {
    id: 6,
    name: '動感超人',
    date: new Date('2021-10-15T12:00:00.000+08:00'),
    amount: 800,
    categoryId: 3
  },
  {
    id: 7,
    name: '午餐',
    date: new Date('2021-10-15T12:00:00.000+08:00'),
    amount: 320,
    categoryId: 4
  },
  {
    id: 8,
    name: '點心',
    date: new Date('2021-10-15T12:00:00.000+08:00'),
    amount: 60,
    categoryId: 4
  },
  {
    id: 9,
    name: '保護費',
    date: new Date('2021-10-20T12:00:00.000+08:00'),
    amount: 600,
    categoryId: 5
  },
  {
    id: 10,
    name: '保護費',
    date: new Date('2021-10-20T12:00:00.000+08:00'),
    amount: 60,
    categoryId: 5
  }
]

db.once('open', () => {
  // GET CURRENT DATA COUNT TO SET ID(AVOID DUPLICATED ID WHEN THE SEED DATA ISN'T THE FIRST SET)
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

          // GET ALL USER'S RECORDS DATA ACCORDING TO 'seed_record_index'
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