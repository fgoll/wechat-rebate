var Wechat = require('./wechat')
var Koa = require('koa');
var xmlBody = require('koa-xml-body')
var Router = require('koa-router')
var Controller = require('./controllers')
// const middleConfig = require('./sequelize')

var app = new Koa();
var router = new Router()

var controller = new Controller()
var wechat = new Wechat()

wechat.getAccessToken()


var userPools = []

setInterval(() => {
  if (userPools.length)
  controller.checkBind(userPools)
  userPools = userPools.filter(item => item)
}, 1000 * 60 * 1)

router.get('/', async (ctx, next) => {
  console.log('ctx', ctx.request.query)

    const query = ctx.request.query
    const echostr = query.echostr
                           
    const b = wechat.checkSignature(query) ? echostr + '' : 'failed'
    console.log(b)
    ctx.body = b
})
app.use(xmlBody())


router.post('/', async (ctx, next) => {

  const xml = ctx.request.body;
  console.log(xml)
	const createTime = Date.parse(new Date());
	const msgType = xml.xml.MsgType[0];
	const toUserName = xml.xml.ToUserName[0];
	const toFromName = xml.xml.FromUserName[0];

  const content = xml.xml.Content[0]

	if(msgType == 'text'){ //关注后

    var itemId = await controller.check(content)

    if (itemId) {
      const {str,rebate} = await controller.getInfo(itemId)

      userPools.push({ itemId, userId: toFromName, rebate })

      ctx.body = `<xml>
        <ToUserName><![CDATA[${toFromName}]]></ToUserName>
        <FromUserName><![CDATA[${toUserName}]]></FromUserName>
        <CreateTime>${createTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${str}]]></Content>
        </xml>`;
      
    }
	}else{//其他情况
		ctx.body = `<xml>
		 <ToUserName><![CDATA[${toFromName}]]></ToUserName>
		 <FromUserName><![CDATA[${toUserName}]]></FromUserName>
		 <CreateTime>${createTime}</CreateTime>
		 <MsgType><![CDATA[text]]></MsgType>
		 <Content><![CDATA[啊~啊~啊~你在发什么消息？]]></Content>
		 </xml>`;
	}	
})

app.use(router.routes(), router.allowedMethods())

app.listen(8080);