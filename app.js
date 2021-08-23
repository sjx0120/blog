//引入express框架
const express = require("express");
//引入body-parser，处理Http请求中的信息
const bodyParser = require('body-parser');
//引入express-session模块
const session = require('express-session');
//导入dateformat第三方模块
const dateFormat = require('dateformat');
//引入art-template
const template = require('art-template');
//const morgan = requi('morgan');
//还未install

//处理路径
const path = require('path');

//创建网站服务器
const app = express();

//获取系统环境变量 返回值是对象
// if(process.env.NODE_ENV == 'development'){
//     console.log('这里是开发环境');
//     //因为Morgan也是express相关的啥啥啥。Morgan在上方引入
//      在开发环境中 将客户端发送给服务端的请求打印在控制台
//     app.use(morgan('dev'));
// }else{
//     console.log('这里是生产环境');
// }

//连接数据库
require('./model/connect');
//测试
//require('./model/user');

//1.告诉express框架使用什么模板引擎渲染什么后缀的模板文件
//虽然我们这路不需要加载art-template 但是也要安装
app.engine('html',require('express-art-template'));
//向模板内导入dateFormat变量
template.defaults.imports.dateFormat = dateFormat;

//2.告诉express框架模板的路径
// 第一个views是固定的,是express的配置项名字，告诉express框架模板存放的位置
// 第二个views是文件夹的名字
app.set('views',path.join(__dirname,'views'));
//3.告诉express框架模板后缀是什么
app.set('view engine','html');

//开放静态资源文件
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'pics')));

//处理post请求参数
app.use(bodyParser.urlencoded({extended:false}));

//配置session  saveUninitialized:false意思是：用户未登录，不要保存cookie
app.use(session({
    secret:'secret key',
    saveUninitialized:false,
    cookie:{
    // 设置cookie过期时间为一天
    maxAge: 24*60*60*1000
}
}));

//引入路由模块
const home = require('./route/home');
const admin = require('./route/admin');
const artTemplate = require("art-template");
const { userInfo } = require("os");

//就算输入账号，还是会重定向到login，似乎接收不到username
//app.use('/admin',require('./middleware/loginGuard'));

//为路由匹配请求路径
app.use('/home',home);
app.use('/admin',admin);

//监听端口
app.listen(3000,function(){
    console.log('server is running.....');
})