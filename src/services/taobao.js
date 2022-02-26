

var Config = require('../config');

const {appKey, appSecret} = Config;

// @ts-ignore
var {ApiClient} = require('../lib/tb_sdk');

let client = new ApiClient({
    'appkey': appKey,
    'appsecret': appSecret,
    'url': 'http://gw.api.taobao.com/router/rest'
});

class TaoBaoService {
    basic(apiName, params) {
        return new Promise((resolve, reject) => {
            client.executeWithHeader(
                apiName,
                params || {},
                {},
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    /**
     *  淘宝客-公用-淘宝客商品详情查询(简版)
     */
    async getItemInfo(itemId) {
        const res = await this.basic(
            'taobao.tbk.item.info.get',
            {
                num_iids: itemId
            }
        );
        console.log('res', res.results)
        return res.results.n_tbk_item[0];
    }

    /**
     * 淘宝客-公用-淘口令生成
     */
    async createPwd(url, text) {
        const res = await this.basic(
            'taobao.tbk.tpwd.create',
            {
                url,
                text,
            }
        );
        return res.data;
    }

}

module.exports = TaoBaoService

