//创建文章集合

//1.引入第三方模块
const mgdb = require('mongoose');
//与规则有关的模块
const Joi = require('joi');

//2.创建文章集合规则
const articleschema = new mgdb.Schema({
    articlename:{
        type:String,
        maxlength:30,
        minlength:2,
        required:[true,'请填写文章标题']
    },
    //作者就是用户集合里面的值，所以在这里把他们关联一下
    author:{
        type:mgdb.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'请传递作者']
    },
    publishdate:{
        type:Date,
        default:Date.now
    },
    file:{
        type:String,
        default:null
    },
    description:{
        type:String
    }
});

//3.根据规则创建文章集合
const Article = mgdb.model('Article',articleschema);

// create a article
// Article.create({
//     articlename:"张真源",
//     author:"lily",
//     publishdate:"",
//     file:"",
//     description:"hhhh",
// }).then(()=>console.log('create success'))
//    .catch(()=>console.log('create fail'))

//4.导出
module.exports = {
    Article
}