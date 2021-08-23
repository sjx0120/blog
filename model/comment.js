const mongoose = require('mongoose');
//创建评论集合规则
const commentSchema = new mongoose.Schema({
    //文章
    aid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article'
    },
    //用户
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //评论时间
    time:{
        type:Date
    },
    //评论内容
    content:{
        type:String,
        required:true
    }
})
//根据规则创建集合
const Comment = mongoose.model('Comment',commentSchema);

module.exports = {
    Comment
}