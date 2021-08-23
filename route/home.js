var express = require('express');
//创建博客展示界面路由
var home = express.Router();

//引入文章集合
const { Article } = require('../model/article');
//引入评论集合
const { Comment } = require('../model/comment');
const { User } = require('../model/user');
const formidable = require('formidable');
const path = require('path');

//前台首页
home.get('/index',async (req,res) => {
    let page = req.query.page || 1;
    let size = 2;
    //总条数
    let count = await Article.countDocuments({});
    //总页数 向上取整
    let pages = Math.ceil(count/size);
    let start = (page-1)*size;
    let article = await Article.find().populate('author').lean().limit(size).skip(start);
    // res.send(result);
    //return 组织代码继续向下执行
    // return;
    res.render('home/index',{
        article,
        page,
        pages
    })
})
//前台文章详情
home.get('/article',async (req,res) => {
    //获取id
    let id = req.query.id;
    let article = await Article.findOne({_id:id}).populate('author').lean();
    let comments = await Comment.find({aid:id}).populate('uid').lean();
    // res.send(comments);
    // return;
    res.render('home/article',{
        article,
        comments
    })
})
//评论路由
home.post('/comment',async (req,res) => {
    const {content,uid,aid} = req.body;
    //存储在数据库中
    await Comment.create({
        content:content,
        uid:uid,
        aid:aid,
        time:new Date()
    })
    res.redirect('/home/article?id='+aid);
})
home.get('/article-crud',async (req,res)=>{

    const page = req.query.page || 1;
    //1.先将文章从数据库中查询出来
    //规定每页显示的数据条数
    let size = 5;
    //获取数据总条数
    let count = await Article.countDocuments({});
    //计算页面数，向上取整
    let pages = Math.ceil(count/size);
    let start = (page-1)*size;

    const uid = req.query.id;
    let articles = await Article.find({author:uid}).limit(size).skip(start);
    // res.send(articles);
    // return;
    res.render('home/article-crud',{
        articles:articles,
        page:page,
        pages:pages
    });
})
home.get('/article-edit',async (req,res) =>{
    const aid = req.query.id;
    // res.send(aid);
    // return;
    if(aid){
        let article = await Article.findOne({_id:aid});
        res.render('home/article-edit',{
            article:article,
            link:'/home/article-modify?id='+aid,
            button:'修改'
        });
    }else{
        res.render('home/article-edit',{
            link:'/home/article-edit',
            button:'添加'
        });
    }
    
})
//文章添加
home.post('/article-edit',async (req,res) => {
    //1.创建表单解析对象
    const form = new formidable.IncomingForm();
    //2.配置文件上传路径
    form.uploadDir = path.join(__dirname,'../','public','uploads');
    //3.保留文件后缀
    form.keepExtensions = true;
    //4.解析表单
    form.parse(req, async (err,fields,files) => {
        await Article.create({
            articlename:fields.articlename,
            author:fields.author,
            publishdate:fields.publishdate,
            file:files.article.path.split('public')[1],
            description:fields.description
        }).then(()=>console.log('create success'))
        .catch(()=>console.log('create fail'));
        res.redirect('/home/article-edit');
        })
})
//文章修改
home.post('/article-modify',async (req,res) => {
    const id = req.query.id;
    //1.创建表单解析对象
    const form = new formidable.IncomingForm();
    //2.配置文件存储位置
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
    res.redirect('/home/article-crud?id='+fields.author);
    })
})
//文章删除
home.get('/article-delete',async (req,res) => {
    //获取要删除的文章id
    const id = req.query.id;
    await Article.findOneAndDelete({_id:id});
    res.redirect('/home/index');
})
module.exports = home;