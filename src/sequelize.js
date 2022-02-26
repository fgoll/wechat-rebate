const Sequelize = require('sequelize')
const Config  = require('./config')

const options = {
  host: '127.0.0.1',
  user: Config.database.root,
  password: Config.database.pwd,
  port: '3306',
}

const seq = new Sequelize(Config.database.name, options.user, options.password, {
  host: options.host,
  port: options.port,
  dialect: 'mysql',
  pool: {
    max: 10,
  }
})

seq
  .authenticate()
  .then(() => {
    console.log('MYSQL 连接成功......')
  })
  .catch(err => {
    console.error('链接失败:', err)
  })

  seq.sync()

module.exports = seq