
//引入用户构造集合
const { User,validateUser } = require('../../../model/user');

module.exports =async (req,res) => {
    
    try {
        await validateUser(req.body)
    } catch (error) {
       return res.redirect(`/admin/user-edit?message=${error.message}`)
    }

    //验证用户是否已经存在,根据用户名查看用户是否存在
    let user =await User.findOne({username:req.body.username});
    if(user){
        return res.redirect(`/admin/user-edit?message=用户名已经存在`)
    }
    //否则，将用户添加到数据库
    
    await User.create(req.body);
    //将页面重定向到列表页面
    res.redirect('/admin/user-edit');
}

  
    