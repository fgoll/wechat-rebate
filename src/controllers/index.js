
var TKLService = require('../services/taokouling');
var TaoBaoService = require('../services/taobao');
const { update } = require('./user')

const tkl = new TKLService();
const taobao = new TaoBaoService();

class TaoBaoController {

  async check(text) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    // 1. 检查淘口令
    var matchs = text.match(reg);
    const itemId = await tkl.check(matchs[0]);

    console.log('c', itemId)
    return itemId;
  }

  async getInfo(itemId) {  
      // 2. 高佣转链接
      const {coupon_click_url, coupon_info, max_commission_rate} = await tkl.createLink(itemId);
      // 3. 生成淘口令
      const pwd = await taobao.createPwd(coupon_click_url, '我的淘口令');
      const info = await taobao.getItemInfo(itemId);
      const rebate = (info.zk_final_price * max_commission_rate / 100 * 0.5).toFixed(2)
      const str = `----具体信息----\n\n${pwd.model}\n\n原价: ${info.zk_final_price}\n付费参考: ${info.zk_final_price}\n优惠券：${coupon_info || '无'}\n预计范俐：${rebate} 元`;
      return {str, rebate};
  }

  async checkBind(userPools) {
    try {

      const poolMap = userPools.reduce((prev, curr, index) => {
        if (!curr) return prev
        return {
          ...prev,
          [curr.itemId]: {
            ...curr,
            index
          }
        }
      }, {})

      try {
        const orderList = await tkl.getOrder();
        const handleIdxs = []
  
        for (let order of orderList) {
          console.log('or', order, poolMap)
          const orderItem = poolMap[order.item_id]
          if (orderItem) {
            userPools[orderItem.index].orderNo = order.trade_parent_id
            if (orderItem) {
              handleIdxs.push(orderItem.index)
            }
          }
        }
  
        for (let index of handleIdxs) {
          const item = userPools[index]
          console.log(update, 'item')
          update(item)
  
          userPools[index] = null
        }
      } catch(e) {
        console.log(e)
      }

      // console.log(orderList, userPools)
    } catch(e) {
      console.log(e)
    }
  }
}

module.exports = TaoBaoController