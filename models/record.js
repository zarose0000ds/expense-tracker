const mongoose = require('mongoose')
const recordSchema = new mongoose.Schema({
  id: { type: Number, require: true },
  name: { type: String, require: true },
  date: { type: Date, require: true },
  amount: { type: Number, require: true },
  userId: { type: Number, require: true },
  categoryId: { type: Number, require: true },
})

module.exports = mongoose.model('Record', recordSchema)