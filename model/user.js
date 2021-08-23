//创建用户集合
//引入第三方模块
const mongoose = require('mongoose');
const Joi = require('joi');
//创建用户集合规则
const userschema =  new mongoose.Schema({
    username:{
        type:String,
        unique:true,//值唯一
        required:true,//不为空
        minlength:2,
        maxlength:20
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'normal'
    },
    //状态 0禁用 1 启用
    // state:{
    //     type:Number,
    //     required:true
    // }
    
});

//创建集合
const User = mongoose.model('User',userschema);

//create a user
// User.create({
//     username:'sjx',
//     password:'123456'
// }).then(()=>console.log('create success'))
//    .catch(()=>console.log('create fail'))
const validateUser = user =>{
    const schema = Joi.object({
    username:Joi.string().min(2).max(10).required().error(new Error('用户名不符合规范，必须是2-10个字')),
    password:Joi.string().min(3).max(30).required().error(new Error('密码输入不规范，请输入3-20个字符')),
    role:Joi.string().valid('normal','admin').error(new Error('请正确选择角色性质'))
    
        //字母数字开头，3-30位，$表示也必须以数字字母结尾
    });
    return schema.validateAsync(user)
}


//将用户集合作为模块成员进行导出
module.exports = {
    //User:User
    User,
    validateUser
}