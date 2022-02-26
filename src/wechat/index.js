var sha1 = require('sha1');
var request = require('request')

var config = require('../config')

class Wechat {
  constructor() {
    this.accessToken = null
  }

  checkSignature(opts) {

    var token = config.wechat.token
  
    var signature = opts.signature;
    var nonce = opts.nonce;
    var timestamp = opts.timestamp;
  
    var str = [token,timestamp,nonce].sort().join(''); //按字典排序，拼接字符串
    var sha = sha1(str); //加密
  
    return sha === signature
  }

  getAccessToken() {
    let option = {
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      qs: {
        grant_type: 'client_credential',
        appid: config.wechat.appID,
        secret: config.wechat.appSecret
      },
      method: 'get',
      headers: {
        'content-type': 'application/json'
      }
    }
  
    return request(option, function(error, response, body) {
      console.log(error, body)
      var data = JSON.parse(body)
      if (error) {
        this.accessToken = null;
          return null;
      } else {
          switch(data.errcode) {
              case 45009:
                  console.log('token调用上限')
                  this.accessToken = null;
                  return null;
  
              case 0:
                  console.log('当前access_token', data)
                  // 定时重新获取access_token
                  clearTimeout(this.getAccessTokenTimer)
                  this.getAccessTokenTimer = setTimeout(() => {
                      this.getAccessToken()
                  }, (data.expires_in - 60) * 1000 || 60000)

                  this.accessToken = data;

                  return data;
          }
      }
    })
  }
}

module.exports = Wechat