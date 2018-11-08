var openMock = false;
var projectName='easy-layui';
var bathPath = location.origin +'/'+projectName+ "/app";
var loginPath = bathPath + '/login.html';
var activitiPath= 'http://localhost:8081/activiti';
//权限path
var authorityPath = '/'+projectName;

var loadScript=function (src,id,fn) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    node.src = src+(openMock ? '?v='+new Date().getTime() : '');
    node.id=id || 'layui';
    var root_s = document.getElementsByTagName('head')[0];

    if(!document.getElementById(id)){
        root_s.appendChild(node);
        if(node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0)){
            node.attachEvent('onreadystatechange', function(e){
                if (typeof fn === "function") {
                    setTimeout(fn, 0)
                }
            });
        } else {
            node.addEventListener('load', function(e){
                if (typeof fn === "function") {
                    setTimeout(fn, 0)
                }
            }, false);
        }
    }else{
        fn && fn();
    }
}
var link = function(href,cssname){
    var that = this
        ,link = document.createElement('link')
        ,head = document.getElementsByTagName('head')[0];


    var app = (cssname || href).replace(/\.|\//g, '')
        ,id = link.id = 'layuicss-'+app;

    link.rel = 'stylesheet';
    link.href = href + (openMock ? '?v='+new Date().getTime() : '');
    link.media = 'all';

    if(!document.getElementById(id)){
        head.prepend(link);
    }
};
var config = {
    authorityPath: openMock ? bathPath : authorityPath + '/user',
    ajaxPath: location.origin +'/'+projectName,	// ajax
    bathPath: bathPath,
    loginPath: loginPath,
    activitiPath:activitiPath,
    mobileLogin:location.origin+'/'+projectName+'/mobile/login.html',
    browserCache: projectName,	// 浏览器数据库名称
    openMock:openMock,  //是否是mock
    resName:'vo',
}

window.webSiteConfig=config;

var Init=function(rely,fn) {
    loadScript(authorityPath+'/layui/layui.js','layui',function () {
        rely=rely ||[];
        layui.config({
            version:false
        });
        layui.use(rely,function() {
            fn && fn();
        });
    });
}