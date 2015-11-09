/**
 * Created by Alexandra on 11/3/2015.
 */
var http=require('http');
var fs=require('fs');
var mime=require('mime');// 监控不同类型的content-type
var path=require('path');
var db=require('./db');
var url=require('url');
var server=http.createServer(function(req,res){
    var method =req.method;
    //var url=req.url;
    var urlobj=url.parse(req.url,true);//true 表示把查询字符串解析为对象（路径和内容）
    var pathname=urlobj.pathname;
    if(pathname=='/') {//将读取的数据流输送给response
        console.log("localhost arrived!");
        fs.createReadStream('./index.html').pipe(res);
    } else if(pathname=='/users'){
        db.list(function (err, ret) {
                res.end(JSON.stringify(ret));
           // console.log('ret=',JSON.stringify([ret]));
        })
    }else if(pathname=='/user') {
        var userData = {};

        //从用户请求数据中提取用户信息，为后面插入数据库准备
        req.on('data', function (data) {
            userData = JSON.parse(data.toString());
        });

        switch (method) {
            case 'POST':
            req.on('end', function () {
                //console.log("userdata=", JSON.stringify([userData]));
                //userdata
                /* db.insert(userData,function(err,ret){
                 res.end(JSON.stringify([userData]));//将userData string打包成数组返回
                 });*/
                db.insert(userData, function (err, ret) {
                    db.list(function (err, ret) {
                        res.end(JSON.stringify(ret));//不要加中括号!![ret],ret已是数组数据了
                        //console.log('ret=',JSON.stringify([ret]));
                    });
                });
            });
            break;

            case 'PUT':
                req.on('end', function () {
                    //console.log("userdata=", JSON.stringify([userData]));
                    //userdata
                    /* db.insert(userData,function(err,ret){
                     res.end(JSON.stringify([userData]));//将userData string打包成数组返回
                     });*/
                    db.update(userData, function (err, ret) {
                        db.list(function (err, ret) {
                            res.end(JSON.stringify(ret));//不要加中括号!![ret],ret已是数组数据了
                            //console.log('ret=',JSON.stringify([ret]));
                        });
                    });
                });
                break;

            case 'DELETE':
                req.on('end',function(){
                    //console.log("userdata=", JSON.stringify([userData]));
                    //userdata
                    db.delete(urlobj.query._id,function(err,ret){
                        //console.log("id=",urlobj.query.id);
                       db.list(function (err, ret) {
                            res.end(JSON.stringify(ret));
                        });
                        // res.end(JSON.stringify([{username:'deleted this user'}]));
                    });
                });
                break;

        }
    }
        //当用户请求事件完成，将获取的用户信息存入数据库
    else{//console.log("获取到angular!");
        //处理其他资源文件 angular 或bootstrap.js
        res.writeHead(200,{'Content-Type':mime.lookup(pathname)});//mime.lookup(pathname)
        fs.exists(path.join(__dirname,pathname),function(exists){

            if(exists) {
                fs.createReadStream(path.join(__dirname, pathname)).pipe(res);

            }else{
                res.end('404');
            }
        });
    }
});
server.listen(80);