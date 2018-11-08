layui.define(['jquery','util'], function (exports) {
    window.$  =  layui.jquery;

    var util=layui.util;
    var body=$('body');

    var ELEM='layui-nav',ELEM_ITEM='layui-nav-item',LAY_THIS='layui-this',LAY_SHOW='layui-show',ELEM_CHILD='layui-nav-child',ELEM_BEDGE='layui-badge',
        ELEM_DOT='layui-badge-dot',ELEM_IMG='layui-nav-img',ELEM_TREE='layui-nav-tree',ELEM_OPEN='layui-nav-itemed',ELEM_SIDE='layui-nav-side',
        ELEM_BAR='layui-nav-bar',ELEM_MORE='layui-nav-more',ELEM_ANIM='layui-anim',ELEM_UPBIT='layui-anim-upbit';

    var Nav_Default={
        data:[],
        url:undefined,
        vertical:false,
        slide:false,
        showChild:true,
        showOneChild:true,
        childNode:undefined,
        showIcon:true,
        sysCode:util.webConfig.browserCache,
        response:{
            dataName:undefined,
            idName:'menuId',
            parentName:'pid',
            childName:'children'
        },
        cached:false
    };

    var methods={
        init:function (options) {
            return this.each(function (i, item) {
                var _this = this;
                var c  =  $.data(_this, "nav");
                var opt={};
                if(c){
                    opt = $.extend({},c, options);
                    $.data(_this, "nav", opt);

                    if(opt.data.length<1){
                        methods.getInitData.call(_this);
                    }else{
                        methods.initDom.call(_this);
                    }
                }else{
                    var _option = $(_this).data('options');
                    if(typeof _option==="string"){
                        opt = util.getOptions(_option);
                    }
                    opt = $.extend({}, Nav_Default,opt, options);
                    $.data(_this, "nav", opt);
                    if(opt.data.length<1){
                        methods.getInitData.call(_this);
                    }else{
                        methods.initDom.call(_this);
                    }
                }
            })
        },
        initDom:function(){
            var _this=this,
                c  =  $.data(_this, "nav"),
                childName=c.response.childName,
                $this=$(_this),
                li=[]
                ,iconName=c.iconName||'icon';

            $.each(c.data,function (i,v) {
                if(c.open!==undefined&&isNaN(c.open)&&v.name===c.open){
                    c.open=i;
                }
                li.push('<li class="'+ELEM_ITEM+function () {
                    if(c.vertical && body.find('.collapse').length>0 && body.find('.layui-hover-open').length===0){
                        if(v[childName]){
                            return ' hasChildMenu"';
                        }else{
                            return ' tooltip " data-options="{content:\''+v.name+'\',position:\'right\'}"';
                        }
                    }else{
                        return '"';
                    }
                }()+'><a href="'+(v.url?v.url:'javascript:;')+'" >'+(function () {
                    var name='<cite>'+v.name+'</cite>';
                    if(c.showIcon && v[iconName]){
                        if(v[iconName].indexOf('fa')>-1){
                            name='<i class="fa '+v[iconName]+'"></i>'+name;
                        }else{
                            name='<i class="layui-icon">'+v[iconName]+'</i>'+name;
                        }
                    }
                    if(c.showChild&&v[childName]){
                        name+='<span class="'+ELEM_MORE+'"></span>';
                    }
                    return name;
                })()+'</a>'+(function () {
                    var child=[];
                    if(c.showChild&&v[childName]){
                        child=['<dl class="'+ELEM_CHILD+' '+ELEM_ANIM+' '+ELEM_UPBIT+'">'];
                        $.each(v[childName],function (ii,vv) {
                            child.push('<dd><a href="'+(vv.url?vv.url:'javascript:;')+'">'+(function () {
                                var name='<cite>'+vv.name+'</cite>';
                                if(c.showIcon && vv[iconName]){
                                    if(vv[iconName].indexOf('fa')>-1){
                                        name='<i class="fa '+vv[iconName]+'"></i>'+name;
                                    }else{
                                        name='<i class="layui-icon">'+vv[iconName]+'</i>'+name;
                                    }
                                }
                                return name;
                            })()+'</a></dd>')
                        });
                        child.push('</dl>');
                    }
                    return child.join('');
                })()+'</li>');
            });
            li.push('<span class="'+ ELEM_BAR +'"></span>');

            if(_this.nodeName==="UL"){
                $this.html(li.join(''));
            }else{
                $this.html('<ul class="'+(function () {
                    var _class=ELEM;
                    if(c.vertical){
                        _class=ELEM+' '+ELEM_TREE;
                    }
                    if(c.slide){
                        _class=ELEM+' '+ELEM_TREE+' '+ELEM_SIDE;
                    }
                    return _class;
                })()+'">'+li.join('')+'</ul>');
            }
            methods.event.call(_this);

            if(c.open!==undefined){

                $this.find('.'+ELEM_ITEM).eq(c.open).click();
            }

            c.done && c.done();
        },
        getInitData:function(){
            var _this=this,
                c = $.data(_this, "nav"),
                response=c.response;
            if(!c.url) {
                methods.event.call(_this);
                return;
                // throw Error('链接不能为空！');
            }
            $.ajax({
                url:c.url,
                data:{sysCode:c.sysCode},
                successed:function (res) {
                    c.data=util.transData(res[response.dataName || util.webConfig.resName], response.idName, response.parentName,response.childName);
                    $.data(_this, "nav",c);
                    methods.initDom.call(_this);
                }
            })
        },
        findNodeByName:function(name){
            var _this=this,
                c  =  _this.data('nav'),
                childName=c.response.childName;

            name+="";

            var findData=function (arr) {
                for(var i=0;i<arr.length;i++){
                    if((arr[i]['name']+"")===name){
                        return arr[i];
                    }
                    if(arr[i][childName]){
                        var result=findData(arr[i][childName]);
                        if(result){
                            return result;
                        }
                    }
                }
                return null;
            };
            return findData(c.data);
        },
        event:function () {
            var that=this,
                $this=this.nodeName==="UL"?$(this):$(this).find('.'+ELEM),
                bar = $this.find('.'+ELEM_BAR),
                spaceName='.nav',
                selectedData={};

            $this.off(spaceName);

            //一级菜单
            $this.on('click'+spaceName,'.'+ELEM_ITEM,function () {
                var _this=$(this),
                    c = $.data(that, "nav"),
                    index=_this.index(),
                    data=c.data[index],
                    childName=c.response.childName,
                    child= _this.find('.'+ELEM_CHILD),
                    _a=_this.children('a'),
                    cite=_a.find('cite'),
                    title=cite.length>0?cite.html():_a.html(),
                    url=_a.attr('href');


                // if(_this.hasClass(LAY_THIS)){
                //     if(url && !data){
                //         c.onClick && c.onClick(data || {title:title,url:url});
                //     }
                //     return;
                // }

                //收缩其他菜单
                if(c.showOneChild && !_this.hasClass(ELEM_OPEN)){
                    $this.find('.'+ELEM_OPEN).each(function (i,v) {
                        var $$this=$(v);
                        $$this.removeClass(ELEM_OPEN);
                        $$this.children('a').find('.'+ELEM_MORE).removeClass(ELEM_MORE+'d');
                    })
                }

                //展开树形菜单的二级菜单
                if($this.hasClass(ELEM_TREE) && child.length>0){

                    _this.toggleClass(ELEM_OPEN);
                    _a.find('.'+ELEM_MORE).toggleClass(ELEM_MORE+'d');

                }else{

                    $this.find('.'+LAY_THIS).removeClass(LAY_THIS);
                    _this.addClass(LAY_THIS);

                    if(c.showChild && url && child.length<1){
                        c.onClick && c.onClick(data || {title:title,url:url});
                    }else{

                        if(c.childNode && data && data[childName]){
                            $(c.childNode).nav({
                                data:data[childName],
                                vertical:true,
                                iconName:c.iconName,
                                onClick:c.onClick
                            });
                            return ;
                        }else{
                            $(c.childNode).html('');
                            if(url){
                                c.onClick && c.onClick(data || {title:title,url:url});
                            }
                        }
                    }
                }

                selectedData=data;
            });

            //二级菜单
            $this.on('click'+spaceName,'.'+ELEM_CHILD+' dd',function (e) {
                e.stopPropagation();
                var _this=$(this),
                    c = $.data(that, "nav"),
                    childName=c.response.childName,
                    index=_this.index(),
                    _a=_this.children('a'),
                    cite=_a.find('cite'),
                    title=cite.length>0?cite.html():_a.html(),
                    url=_a.attr('href');

                $this.find('.'+LAY_THIS).removeClass(LAY_THIS);

                _this.addClass(LAY_THIS);

                if(url){
                    var node=selectedData && selectedData[childName] ?selectedData[childName][index]:{title:title,url:url};
                    c.onClick && c.onClick(node);
                }
            });

            $this.on('mouseenter'+spaceName,'.'+ELEM_ITEM,function () {
                var _this=$(this),
                    timer=$.data(this,'item_timer'),
                    nav_timer=$.data($this,'nav_timer'),
                    more=_this.find('.'+ELEM_MORE),
                    child=_this.find('.'+ELEM_CHILD);

                if(bar.length<1){
                    bar =$('<span class="'+ ELEM_BAR +'"></span>');
                    $this.append(bar);
                }
                clearTimeout(timer);
                clearTimeout(nav_timer);
                //判断是不是垂直或侧边导航
                if($this.hasClass(ELEM_TREE)){
                    bar.css({
                        top: _this.position().top
                        ,height: _this.children('a').height()
                        ,opacity: 1
                    });
                } else {
                    more.addClass(ELEM_MORE+'d');
                    child.addClass(LAY_SHOW);
                    bar.css({
                        left: _this.position().left + parseFloat(_this.css('marginLeft'))
                        ,top: _this.position().top + _this.height() - bar.height()
                    });
                    setTimeout(function () {
                        bar.css({
                            width: _this.width()
                            ,opacity: 1
                        });
                    },100)
                }
            });
            $this.on('mouseleave'+spaceName,'.'+ELEM_ITEM,function () {

                var _this=$(this),
                    timer=$.data(_this,'item_timer'),
                    more=_this.find('.'+ELEM_MORE),
                    child=_this.find('.'+ELEM_CHILD);

                clearTimeout(timer);

                //判断是不是垂直或侧边导航
                if(!($this.hasClass(ELEM_TREE)&&child.length>0)) {
                    timer = setTimeout(function () {
                        more.removeClass(ELEM_MORE + 'd');
                        child.removeClass(LAY_SHOW);

                    }, 100);
                    $.data(this, 'item_timer', timer);
                }
            });
            $this.on('mouseleave'+spaceName,function () {
                var timer=$.data($this,'nav_timer');

                clearTimeout(timer);
                if(bar.length>0){
                    timer=setTimeout(function ()    {
                        //判断是不是垂直或侧边导航
                        if($this.hasClass(ELEM_TREE)){
                            bar.css({
                                height: 0
                                ,top: bar.position().top + bar.height()/2
                                ,opacity: 0
                            });
                        } else {
                            bar.css({
                                width: 0
                                ,left: bar.position().left + bar.width()/2
                                ,opacity: 0
                            });
                        }
                    },200);
                    $.data($this,'nav_timer',timer);
                }
            });

            $this.on('click'+spaceName,'a',function (e) {
                var url=$(this).attr('href'),
                    c = $.data(that, "nav");

                if(c.onClick&&url!=="javascript:;"){
                    if ( e && e.preventDefault ){
                        e.preventDefault();
                    }else {
                        window.event.returnValue = false;
                    }
                }
            });
        }
    };

    //在插件中使用对象
    $.fn.nav  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.nav');
            return this;
        }
        return method.apply(this, arguments);
    };

    $(document).find('.'+ELEM).each(function (i,v) {
        $(v).nav()
    });

    exports('nav');
});