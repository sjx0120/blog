const guard =  (req, res, next) => {
        //判断用户访问的是否是登录页面
        //判断用户的登录状态
        //如果用户是登录的，将请求放行
        //如果用户不是登录的，将请求重定向到登录页面
        if(req.url != '/login' && !req.session.username) {
          res.redirect('/admin/login');
        } else {
          //用户是登录状态，将请求放行
          //普通用户，跳转至首页
          if(req.session.role == 'normal'){
            return res.redirect('/home/index');
          }
          next();
        }
      }
      module.exports = guard;