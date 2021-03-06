/**

 @Name：layui.util 工具集
 @Author：贤心
 @License：MIT
    
*/

layui.define(['jquery','defaultConfig','dialog'], function(exports){
  "use strict";
  
  var $ = layui.$
      ,getConfig=function () {
          var _config=layui.defaultConfig;
          return  $.isEmptyObject(_config)?{
              resName:'vo',
              totalName:'count',
              browserCache:'',
              ajaxPath:'',
              authorityPath:'',
              loginPath:''
          }:_config;
      }()
  //外部接口
  ,util = {
    //固定块
    fixbar: function(options){
      var ELEM = 'layui-fixbar', TOP_BAR = 'layui-fixbar-top'
      ,dom = $(document), body = $('body')
      ,is, timer;

      options = $.extend({
        showHeight: 200 //出现TOP的滚动条高度临界值
      }, options);
      
      options.bar1 = options.bar1 === true ? '&#xe606;' : options.bar1;
      options.bar2 = options.bar2 === true ? '&#xe607;' : options.bar2;
      options.bgcolor = options.bgcolor ? ('background-color:' + options.bgcolor) : '';
      
      var icon = [options.bar1, options.bar2, '&#xe604;'] //图标：信息、问号、TOP
      ,elem = $(['<ul class="'+ ELEM +'">'
        ,options.bar1 ? '<li class="layui-icon" lay-type="bar1" style="'+ options.bgcolor +'">'+ icon[0] +'</li>' : ''
        ,options.bar2 ? '<li class="layui-icon" lay-type="bar2" style="'+ options.bgcolor +'">'+ icon[1] +'</li>' : ''
        ,'<li class="layui-icon '+ TOP_BAR +'" lay-type="top" style="'+ options.bgcolor +'">'+ icon[2] +'</li>'
      ,'</ul>'].join(''))
      ,topBar = elem.find('.'+TOP_BAR)
      ,scroll = function(){
        var stop = dom.scrollTop();
        if(stop >= (options.showHeight)){
          is || (topBar.show(), is = 1);
        } else {
          is && (topBar.hide(), is = 0);
        }
      };
      if($('.'+ ELEM)[0]) return;
      
      typeof options.css === 'object' && elem.css(options.css);
      body.append(elem), scroll();
      
      //bar点击事件
      elem.find('li').on('click', function(){
        var othis = $(this), type = othis.attr('lay-type');
        if(type === 'top'){
          $('html,body').animate({
            scrollTop : 0
          }, 200);
        }
        options.click && options.click.call(this, type);
      });
      
      //Top显示控制
      dom.on('scroll', function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
          scroll();
        }, 100);
      }); 
    }
    
    //倒计时
    ,countdown: function(endTime, serverTime, callback){
      var that = this
      ,type = typeof serverTime === 'function'
      ,end = new Date(endTime).getTime()
      ,now = new Date((!serverTime || type) ? new Date().getTime() : serverTime).getTime()
      ,count = end - now
      ,time = [
        Math.floor(count/(1000*60*60*24)) //天
        ,Math.floor(count/(1000*60*60)) % 24 //时
        ,Math.floor(count/(1000*60)) % 60 //分
        ,Math.floor(count/1000) % 60 //秒
      ];
      
      if(type) callback = serverTime;
       
      var timer = setTimeout(function(){
        that.countdown(endTime, now + 1000, callback);
      }, 1000);
      
      callback && callback(count > 0 ? time : [0,0,0,0], serverTime, timer);
      
      if(count <= 0) clearTimeout(timer);
      return timer;
    }
    
    //某个时间在当前时间的多久前
    ,timeAgo: function(time, onlyDate){
      var that = this
      ,arr = [[], []]
      ,stamp = new Date().getTime() - new Date(time).getTime();
      
      //返回具体日期
      if(stamp > 1000*60*60*24*8){
        stamp =  new Date(time);
        arr[0][0] = that.digit(stamp.getFullYear(), 4);
        arr[0][1] = that.digit(stamp.getMonth() + 1);
        arr[0][2] = that.digit(stamp.getDate());
        
        //是否输出时间
        if(!onlyDate){
          arr[1][0] = that.digit(stamp.getHours());
          arr[1][1] = that.digit(stamp.getMinutes());
          arr[1][2] = that.digit(stamp.getSeconds());
        }
        return arr[0].join('-') + ' ' + arr[1].join(':');
      }
      
      //30天以内，返回“多久前”
      if(stamp >= 1000*60*60*24){
        return ((stamp/1000/60/60/24)|0) + '天前';
      } else if(stamp >= 1000*60*60){
        return ((stamp/1000/60/60)|0) + '小时前';
      } else if(stamp >= 1000*60*2){ //2分钟以内为：刚刚
        return ((stamp/1000/60)|0) + '分钟前';
      } else if(stamp < 0){
        return '未来';
      } else {
        return '刚刚';
      }
    }
    
    //数字前置补零
    ,digit: function(num, length){
      var str = '';
      num = String(num);
      length = length || 2;
      for(var i = num.length; i < length; i++){
        str += '0';
      }
      return num < Math.pow(10, length) ? str + (num|0) : num;
    }
    
    //转化为日期格式字符
    ,toDateString: function(time, format){
      var that = this
      ,date = new Date(parseInt(time) || new Date())
      ,ymd = [
        that.digit(date.getFullYear(), 4)
        ,that.digit(date.getMonth() + 1)
        ,that.digit(date.getDate())
      ]
      ,hms = [
        that.digit(date.getHours())
        ,that.digit(date.getMinutes())
        ,that.digit(date.getSeconds())
      ];

      format = format || 'yyyy-MM-dd HH:mm:ss';

      return format.replace(/yyyy/g, ymd[0])
      .replace(/MM/g, ymd[1])
      .replace(/dd/g, ymd[2])
      .replace(/HH/g, hms[0])
      .replace(/mm/g, hms[1])
      .replace(/ss/g, hms[2]);
    }

    //转换字符串为obj对象
    ,getOptions:function(str){
        if(str===undefined) return {};
        try{
            str  =  new Function('return '+ str)();
        } catch(e){
            throw Error(str+'不是一个有效个参数');
        }
        return str;
    }

    ,initAjax:function () {
       if(layui.device().ie<10){
           $.support.cors = true;
       }
       $.ajaxSetup({
            type: 'POST',
            dataType: 'json',
            //请求成功后触发
            success: function (data) {
                var _this=this;
                if("object"===typeof data){
                    if(!data.ok){
                        switch(data.code) {
                            case  100:
                                $.msg(data.msg, { icon: 5 },function(){
                                    _this.notOk && _this.notOk(data);
                                });
                                break;
                            case 300:
                                $.msg(data.msg, { icon: 5 },function () {
                                    top.location.href = util.webConfig.loginPath;
                                });
                                break;
                            case 200:
                            case 500:
                            default:
                                $.msg(data.msg, { icon: 5 },function(){
                                    // _this.successed && _this.successed(data);
                                    // _this.doFun && _this.doFun(data);
                                    _this.notOk && _this.notOk(data);
                                });
                                break;
                        }
                    }else{
                        this.successed && this.successed(data);
                        this.doFun && this.doFun(data);
                        this.Ok && this.Ok(data);
                    }
                }else{
                    _this.notOk && _this.notOk(data);
                }
            },
            //请求失败遇到异常触发
            error: function (XMLHttpRequest,status, e) {
                console.log('error', XMLHttpRequest);
            },
            //完成请求后触发。即在success或error触发后触发
            complete: function (XMLHttpRequest, status) {
                var dialogIndex=$('body').data('load_index');
                if(dialogIndex){
                    if($('#layui-layer'+dialogIndex).length>0){
                        $.close(dialogIndex);
                    }else{
                        setTimeout(function () {
                            $.close(dialogIndex);
                        },300)
                    }
                }
            },
            //发送请求前触发
            beforeSend: function (XMLHttpRequest) {
                var url = arguments[1].url;
                if(url.indexOf("?")!=-1){
                    if(url.indexOf("token")==-1) {
                        url = url.concat('&token=' + layui.data(getConfig.browserCache).token || '');
                    }
                }else{
                    url = url.concat('?token=' + layui.data(getConfig.browserCache).token || '');
                }
                arguments[1].url = url;//将序列化后的参数重
                // XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
                XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");

                if(!this.hideLoading){
                    $.showLoading();
                }
            }
        })
    }

    ,webConfig:getConfig
    ,getUUID:function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    ,getCurrParam:function(param) {
          var urlParam = {};
          var currHref = window.location.href;
          if (currHref.indexOf('?') != -1) {
              if(param){
                  var arr = currHref.split("?")[1].split("&");//分割参数
                  for (var i = 0; i < arr.length; i++) {
                      var tem = arr[i].split("="); //分割参数名和参数内容
                      if (tem[0] == param) {
                          return tem[1];
                      }
                  }
                  return null;
              }else{
                  var paramArray = currHref.substring(currHref.indexOf('?') + 1).split("&");
                  $.each(paramArray, function (index, item) {
                      if (item != '' && item.indexOf('=') != 1)
                          urlParam[item.substring(0, item.indexOf('='))] = decodeURI(item.substring(item.indexOf('=') + 1));
                  });
              }
          }
          return urlParam;
    }
    ,transData:function(a, id, pid, children) {
      if(!a){
                return [];
            }
            var r = [],
                hash = {},
                i = 0,
                j = 0,
                len = a.length;
            for (; i < len; i++) {
                hash[a[i][id]] = a[i];
            }
            for (; j < len; j++) {
                var aVal = a[j],
                    hashVP = hash[aVal[pid]];
                if (hashVP) {
                    !hashVP[children] && (hashVP[children] = []);
                    hashVP[children].push(aVal);
                } else {
                    r.push(aVal);
                }
            }
            return r;
    }
    
  };
  util.initAjax();
  
  exports('util', util);
});