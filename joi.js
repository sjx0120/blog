//引入joi模块
const Joi = require('joi');

//定义对象验证规则
const schema = Joi.object({
    //required代表必须填写
    
    username:Joi.string().min(2).max(10).required().error(new Error('用户名不符合规范，必须是2-10个字')),
    password:Joi.string().min(3).max(20).required().error(new Error('密码输入不规范，请输入3-20个字符'))
});




//用异步函数的方式
async function run(){
    try {
        //实施验证
        await schema.validateAsync({username:'qq'},{password:'q'});
    } catch (error) {
        console.log(error.message);
        return;
    }
    console.log('验证成功')
}
run();