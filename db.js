/**
 * Created by Alexandra on 11/4/2015.
 */
var MongoClient=require('mongodb').MongoClient;
var objectID=require('mongodb').ObjectId;
var url='mongodb://127.0.0.1/pageTest';//123.57.143.189 珠峰提供的服务器地址

var assert=require('assert');//nodeJS 自带断言包
//var mongo=require("mongodb");
//var host="127.0.0.1";
//var port=27017;
//var mydb=new mongo.Db("RESTful_test",new mongo.Server(host,port,{auto_connect:true}));//auto_connect:true

exports.insert=function(user,callback){

    MongoClient.connect(url,function(err,db){
        assert.equal(null,err);
        db.collection('user').save(user,function(err,ret){

            db.close();
                console.log("成功存起");
            callback(null,ret);
        });
    });
}

exports.update=function(user,callback){

    MongoClient.connect(url,function(err,db){
        assert.equal(null,err);
        console.dir(user);
        db.collection('user').update({_id:new objectID(user._id)},{username:user.username,password:user.password,email:user.email},function(err,ret){

            db.close();
            console.log("成功更新");
            callback(null,ret);
        });
    });
}

exports.list= function(callback){
    MongoClient.connect(url,function(err,db){
        db.collection('user').find({}).toArray(function(err,ret){
            db.close();
            callback(null,ret);
            //console.log("返回所有用户");
        });
    });
}
exports.delete=function(_id,callback){

    MongoClient.connect(url,function(err,db){
    // 删除的是一个对象 需要引用 new一个对象出来
        db.collection('user').remove({_id:new objectID(_id)},function(err,ret){

            db.close();
            console.log("成功删除");
            callback(null,ret);
        });
    });
}