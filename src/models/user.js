const { Sequelize } = require('sequelize')
const moment = require('moment')

const user = function (seq) {
  const UserModal = seq.define('user', {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    itemId: Sequelize.STRING,
    orderNo: Sequelize.STRING,
    price: Sequelize.STRING
  })

  return UserModal
}

user(require('../sequelize')).sync()

module.exports = user