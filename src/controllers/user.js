const { Sequelize } = require('sequelize');
const seq = require('../sequelize')
const user = require('../models/user');

// 增加
const create = async function (obj) {
  const UserModel = user(seq)
  console.log(obj)
   // UserModel.sync(); 第一次使用， 并将下面的创建注释掉，第二次，打开创建， 这行是新建表
  await UserModel.create({
    userId: obj.userId,
    itemId: obj.itemId,
    orderNo: obj.orderNo,
    price: obj.rebate
  }).then(res => {
    console.log('创建', JSON.parse(JSON.stringify(res)));
  })
}

const update = async function(obj) {
  const UserModel = user(seq)

  const info = await getInfo(obj)

  console.log(info)

  if (!info) {
    await create(obj)
  } else {

    const user = info.dataValues
    console.log(user)
    if (user.orderNo.indexOf(obj.orderNo) === -1) {
      let orderNo = user.orderNo + ',' + obj.orderNo
      UserModel.update({
        price: +user.price + +obj.rebate,
        orderNo
      }, {
        where: {
          userId: user.userId 
        }
      })

    }
  }

}

// 删除
// const deleteItem = function (ctx) {
//     const id = ctx.params.id
//     const UserModel = test(seq)
//     UserModel.destroy({
//       where: {
//         id: id
//       }
//     }).then(() => {
//       console.log('删除', `id: ${id}`)
//     })
// }

// 获取所有信息
const getInfo = function (obj) {
  return new Promise((resolve, reject) => {
    const UserModel = user(seq)
    UserModel.findAll({
      where: {
        userId: obj.userId
      }
    }).then(res => {
      resolve(res[0])
    }).catch(err => {
      reject(err)
    })
  })
}


module.exports = {
    create,
    update,
    getInfo,
}