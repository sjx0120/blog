const { query } = require('express');
var express = require('express');
var admin = express.Router();
const formidable = require('formidable');
const path = require('path');

//引入用户集合构造函数
const { User,validateUser } = require('../model/user');
//引入文章集合构造函数
const { Article } = require('../model/article');

admin.get('/login',(req,res) => {
    res.render('admin/login');
});

admin.post('/admin', async (req,res) => {
    //res.send(req.body);
    //接收请求参数
    const {username,password} = req.body;
    if(username.trim().length == 0||password.trim().length == 0){
         //return res.status(400).send('用户名或密码错误');
       res.status(400).render('admin/common/error',{msg:'用户名或密码错误'})
    }
    //根据用户名查询用户信息
    //如果查询成功返回user变量的值是对象类型，里面存储的是用户信息 数据库中的
    //如果查询失败，user变量为空
    const user = await User.findOne({username});
    //查询到了用户
    if(user){
        if(password == user.password){
            req.session.username = user.username;
            req.session.role = user.role;
            req.app.locals.userInfo = user;
            if(user.role == 'admin'){
                res.redirect('/admin/admin');
            }else{
                res.redirect('/home/index');
            }
            //重定向
            //res.redirect('/admin/admin');
            //res.send(users);
     //接收客户端传递过来的page参数
     let page = req.query.page || 1;
     //规定每页显示的数据条数
     let size = 5;
     //获取数据总条数
     let count = await User.countDocuments({});
     //计算页面数，向上取整
     let pages = Math.ceil(count/size);
     let start = (page-1)*size;
       //将用户从数据库中查询出来
       let users = await User.find({}).limit(size).skip(start);
            res.render('admin/admin',{
                users:users,
                pages:pages,
                page,page
            });

           
        }else{
            res.status(400).render('admin/common/error',{msg:'用户名或密码错误'});
           
        }
    }else{
        res.status(400).render('admin/common/error',{msg:'用户名不存在'});
        
        //return res.status(400).send('用户名bucunzai');

    }


});

admin.get('/admin',async (req,res) => {
  
     //res.send(users);
     //接收客户端传递过来的page参数
     let page = req.query.page || 1;
     //规定每页显示的数据条数
     let size = 5;
     //获取数据总条数
     let count = await User.countDocuments({});
     //计算页面数，向上取整
     let pages = Math.ceil(count/size);
     let start = (page-1)*size;
       //将用户从数据库中查询出来
       let users = await User.find({}).limit(size).skip(start);
     res.render('admin/admin',{
         users:users,
         pages:pages,
         page:page
     })
})

admin.get('/loginout',(req,res) =>{
    //删除session
    req.session.destroy(()=>{
        //删除cookie
        res.clearCookie('connect.sid');
        //重定向到登录界面
        res.redirect('/admin/login');
        //清楚模板中的用户信息
        req.app.locals.userInfo = null;
    });
});

//新增修改用户
admin.get('/user-edit',async (req,res) => {
    const { message,id } = req.query;
    //获取到当前的id
    if(id){
        let user = await User.findOne({_id:id});
        res.render('admin/user-edit',{
            message:message,
            user:user,
            link:'/admin/user-modify?id='+id,
            button:'修改'
        });
    }else{
        res.render('admin/user-edit',{
            message:message,
            link:'/admin/user-edit',
            button:'添加'
    });
    }
   
})
admin.post('/user-edit',require('../public/js/admin/user-edit'))

admin.get('/user-add',(req,res) => {
    res.render('admin/register');
})
admin.post('/user-add',async(req,res)=>{

    try {
        await validateUser(req.body)
    } catch (error) {
       return res.redirect(`/admin/login?message=${error.message}`)
    }

    //验证用户是否已经存在,根据用户名查看用户是否存在
    let user =await User.findOne({username:req.body.username});
    if(user){
        return res.redirect(`/admin/login?message=用户名已经存在`)
    }
    //否则，将用户添加到数据库
    
    await User.create(req.body);
    //将页面重定向到列表页面
    res.redirect('/admin/login');

})
admin.post('/user-modify',async (req,res) => {
    //接收客户端传递过来的请求参数
    const body = req.body;
    //res.send(req.body)
    //拿到即将要修改的用户ID
    const id = req.query.id;
    //res.send('修改成功');
    let user = await User.findOne({_id:id});
    //密码比对
    if(user.password == body.password){
        await User.updateOne({_id:id},{
            username:body.username,
            role:body.role
            
        })
        res.redirect('/admin/admin');
    }else{
        res.status(400).render('admin/common/error',{msg:'密码比对失败，不能进行修改'});
    }
   
})

admin.get('/user-delete',async (req,res) => {
    //获取要删除用户的id
    const id = req.query.id;
    await User.findOneAndDelete({_id:id});
    res.redirect('/admin/admin');
})
//文章部分
//文章列表页面路由
admin.get('/article',async (req,res) => {

    const page = req.query.page || 1;
    //1.先将文章从数据库中查询出来
    //规定每页显示的数据条数
    let size = 5;
    //获取数据总条数
    let count = await Article.countDocuments({});
    //计算页面数，向上取整
    let pages = Math.ceil(count/size);
    let start = (page-1)*size;

    let articles =await Article.find().populate('author').lean().limit(size).skip(start);

    //res.send(articles)
    res.render('admin/article',{
        articles:articles,
        page:page,
        pages:pages
    });
})
//文章编辑页面路由 新增修改文章
admin.get('/article-edit',async (req,res) => {
    const { id } = req.query;
    //获取到当前的id
    if(id){
        let article = await Article.findOne({_id:id});
        res.render('admin/article-edit',{
            article:article,
            link:'/admin/article-modify?id='+id,
            button:'修改'
        });
    }else{
        res.render('admin/article-edit',{
            link:'/admin/article-edit',
            button:'添加'
    });
    }
})
//文章修改提交
admin.post('/article-modify',async (req,res) => {
    const id = req.query.id;
   //1.创建表单解析对象
   const form = new formidable.IncomingForm();
   //2.配置上传文件的存放位置
   form.uploadDir = path.join(__dirname,'../','public','uploads');
   //3.保留文件后缀
   form.keepExtensions = true;
   //4.解析表单
   form.parse(req,async (err,fields,files) =>{
       //1.err，错误对象类型，表单解析失败，返回错误信息，成功返回null
       //2.fields,对象类型，返回普通表单数据
       //3.files,对象类型，返回与文件相关的信息
       //res.send(files.article.path.split('public')[1]);
       //res.send(fields)
       await Article.updateOne({_id:id},{
           articlename:fields.articlename,
           author:fields.author,
           publishdate:fields.publishdate,
           file:files.article.path.split('public')[1],
           description:fields.description
       }).then(()=>console.log('create success'))
       .catch(()=>console.log('create fail'));
       res.redirect('/admin/article');
   })
})

//文章添加功能路由
admin.post('/article-edit',async (req,res) => {
   
    //1.创建表单解析对象
    const form = new formidable.IncomingForm();
    //2.配置上传文件的存放位置
    form.uploadDir = path.join(__dirname,'../','public','uploads');
    //3.保留文件后缀
    form.keepExtensions = true;
    //4.解析表单
    form.parse(req,async (err,fields,files) =>{
        //1.err，错误对象类型，表单解析失败，返回错误信息，成功返回null
        //2.fields,对象类型，返回普通表单数据
        //3.files,对象类型，返回与文件相关的信息
        //res.send(files.article.path.split('public')[1]);
        //res.send(fields)
        await Article.create({
            articlename:fields.articlename,
            author:fields.author,
            publishdate:fields.publishdate,
            file:files.article.path.split('public')[1],
            description:fields.description
        }).then(()=>console.log('create success'))
        .catch(()=>console.log('create fail'));
        res.redirect('/admin/article');
    })

})
//文章删除路由
admin.get('/article-delete',async (req,res) => {
    //获取要删除的文章id
    const id = req.query.id;
    await Article.findOneAndDelete({_id:id});
    res.redirect('/admin/article');
})
module.exports = admin;