//引入第三方模块
const mongoose = require('mongoose');
//连接数据库 端口号也可省略
mongoose.connect('mongodb://001:111111@localhost:27017/blog',{ useNewUrlParser: true })
    .then(()=>console.log('数据库连接成功'))
    .catch(()=>console.log('数据库连接失败'))