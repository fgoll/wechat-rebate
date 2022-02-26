

var request = require('request');
var Config = require('../config');

const {apiKey, siteId, adzoneId, uid} = Config;

class TKLService {

    /**
     * 淘口令解析
     */
    check(text) {
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.taokouling.com/tkl/viptkljm?apikey=${apiKey}&tkl=${encodeURI(text)}`,
                {json: true},
                (_err, _res, body) => {

                    if (body && body.code === 1) {
                        const data = body.url.split('?');
                        const obj = data[1].split('&');
                        let itemId = '';
                        for (let i = 0; i < obj.length; i++) {
                            const [key, value] = obj[i].split('=');
                            if (key === 'id') {
                                itemId = value;
                                break;
                            }
                        }
                        if (itemId) {
                            resolve(itemId);
                        }
                        else resolve(null)
                    }
                    reject('Error', _err, body);
                }
            );
        });
    }

    /**
     * 高佣转链接
     */
    createLink(itemId) {
      console.log('a', itemId)
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.taokouling.com/tkl/TbkPrivilegeGet?apikey=${apiKey}&itemid=${itemId}&siteid=${siteId}&adzoneid=${adzoneId}&uid=${uid}`,
                {json: true},
                (_err, _res, body) => {
                  console.log('_err, _res, body' , _err, body)
                    if (body && body.result && body.result.data) {
                        resolve(body.result.data);
                    } else {
                        reject('Create link error');
                    }
                }
            );
        });
    }

    getOrder() {
      return new Promise((resolve, reject) => {
        // const d = new Date()
        const curr = new Date();
        const year = curr.getFullYear()
        var month = curr.getMonth() + 1 
        month = month < 10 ? '0' + month : month

        var day = curr.getDate()
        day = day < 10 ? '0' + day : day

        var hours = curr.getHours()
        var minute  = curr.getMinutes()
        minute = minute < 10 ? '0' + minute : minute
        var second = curr.getSeconds()
        second = second < 10 ? '0' + second : second

        const start = `${year}-${month}-${day} ${hours-1 < 10 ? '0' + (hours-1) : hours-1}:${minute}:${second}`

        const end = `${year}-${month}-${day} ${hours < 10 ? '0' + hours : hours}:${minute}:${second}`

        request.get(
            `https://api.taokouling.com/tbk/TbkScOrderDetailsGet?uid=${uid}&start_time=${start}&end_time=${end}`,
            {json: true},
            (_err, _res, body) => {
              console.log('_err, _res, body' , _err, body)
                if (body && body.data && body.data.results && body.data.results.publisher_order_dto) {
                    resolve(body.data.results.publisher_order_dto);
                } else {
                    resolve([]);
                }
            }
        );
    });
    }
}

module.exports = TKLService