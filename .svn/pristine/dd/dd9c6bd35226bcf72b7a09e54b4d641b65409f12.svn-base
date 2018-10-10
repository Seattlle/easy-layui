'use static';
layui.define(['jquery'], function (exports) {
    window.$=layui.jquery;

    var openMock = false;
    var projectName='credit';
    var bathPath = location.origin +'/'+projectName+ "/app";
    var loginPath = bathPath + '/login.html';
    //权限path
    var authorityPath = 'http://192.168.1.6:8500';

    var config = {
        authorityPath: openMock ? bathPath : authorityPath + '/user',
        ajaxPath: location.origin +'/'+projectName,	// ajax
        bathPath: bathPath,
        loginPath: loginPath,
        mobileLogin:location.origin+'/'+projectName+'/mobile/login.html',
        browserCache: projectName,	// 浏览器数据库名称
        openMock:openMock,  //是否是mock
        resName:'vo',
    }

    try{
        if(webSiteConfig){
            config=$.extend({},config,webSiteConfig);
        }
    }catch (e) {

    }
    exports('defaultConfig', config);
});