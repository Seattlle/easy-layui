layui.define(['jquery','util'], function (exports) {
    window.$  =  layui.jquery;

    var util=layui.util;

    var ELEM_TABS='layui-tab',ELEM_TAB_TITLE='layui-tab-title',LAY_THIS='layui-this',ELEM_CONTENT='layui-tab-content',ELEM_ITEM='layui-tab-item',LAY_SHOW='layui-show',
        CONTEXT_MENU='admin-contextmenu',TAB_CLOSE='layui-tab-close',TAB_MENU='c_menu';

    var Tabs_Default={
        elem:undefined,
        selected:0,
        hoverChange:false,
        onChange:undefined,
        done:undefined,
        contextmenu:true,
        tab:{
            title:undefined,
            content:undefined,
            closed:true,
            iframe:false,
            url:undefined,
            showIcon:true
        }
    };

    var methods={
        init:function (options) {
            return this.each(function (i, item) {
                var _this = this;
                var c  =  $.data(_this, "tabs");
                var opt={};
                if(c){
                    opt = $.extend({},c, options);
                    opt.selected = 0;
                    $.data(_this, "tabs", opt);

                }else{
                    var _option = $(_this).data('options');
                    if(typeof _option==="string"){
                        opt = util.getOptions(_option);
                    }
                    opt = $.extend({}, Tabs_Default,opt, options);
                    $.data(_this, "tabs", opt);
                    methods.initDom.call(_this);
                }
            })
        },
        initDom:function(){
            var _this=this;
            var c  =  $.data(_this, "tabs");
            var $this=$(_this),
                title=$this.children('.'+ELEM_TAB_TITLE),
                content=$this.children('.'+ELEM_CONTENT);

            if(!c.width){
               if(this.style.width){
                   c.width=parseFloat(this.style.width);
               }else{
                   c.width=$this.parent().width();
               }
            }
            // content.css('width',c.width+'px');

            if(!c.height){
               if(this.style.height){
                   c.height=parseFloat(this.style.height);
               }else{
                   c.height=$this.parent().height();
               }
           }
            content.css('height',(c.height-Math.ceil(title.outerHeight()))+'px');
           $.data(_this, "tabs",c);

            title.find('li').each(function (i,v) {
                var that=$(v),
                    text= that.html();

                if(c.closed||c.tab.closed){
                    if(!that.hasClass('not-close')){
                        text+='<i class="layui-icon layui-unselect '+TAB_CLOSE+'">&#x1006;</i>';
                        that.html(text);
                    }
                }
                that[c.contextmenu?'addClass':'removeClass'](TAB_MENU);
            });

            methods.resizeTitle.call(this);
            methods.event.call(this);
        },
        resizeTitle:function(){
            var $this=$(this),
                _this=this.length>0?this[0]:this,
                title=$this.children('.'+ELEM_TAB_TITLE),
                c  =  $.data(_this, "tabs"),
                title_width=0;

                title.find('li').each(function (i,v) {
                    var that=$(v);
                    title_width+=that.outerWidth();
                });

            if(title_width>c.width){
                if(title.find('.layui-tab-bar').length===0){
                    $this.attr('overflow','');
                    title.append('<span class="layui-unselect layui-tab-bar" lay-stope="tabmore" ><i lay-stope="tabmore" class="layui-icon">&#xe61a;</i></span>')
                }
            }else{
                title.find('.layui-tab-bar').remove();
            }
        },
        event:function () {
            var _this=this,
                that=$(_this),
                spaceName='.tabs',
                title=that.children('.'+ELEM_TAB_TITLE),
                content=that.children('.'+ELEM_CONTENT);


            title.off(spaceName);
            //切换tab
            title.on('click'+spaceName,'li',function () {
                var $this=$(this),
                    c  =  $.data(_this, "tabs"),
                    menuId=$this.attr('data-menuId');

                if($this.hasClass(LAY_THIS))return;

                var index=$this.index();

                if(menuId){
                    top.currMenu=menuId;
                }

                title.find('.'+LAY_THIS).removeClass(LAY_THIS);
                $this.addClass(LAY_THIS);
                content.find('.'+LAY_SHOW).removeClass(LAY_SHOW);
                content.find('.'+ELEM_ITEM).eq(index).addClass(LAY_SHOW);

                c.selected=index;
                $.data(_this, "tabs",c);

                c.onChange&&c.onChange(index,$this);
            });

            //关闭tab
            title.on('click'+spaceName,'.'+TAB_CLOSE,function (e) {
                e.stopPropagation();
                var _index=$(this).parent().index();

                methods.del.call($(_this),_index);
            });

            //查看更多
            title.on('click'+spaceName,'.layui-tab-bar',function () {
                title.toggleClass('layui-tab-more');
            });

            //右键显示菜单
            title.on('contextmenu'+spaceName,'li.'+TAB_MENU,function (e) {
                var $that = $(e.target),
                    menuId=$that.attr('data-menuId');
                e.preventDefault();
                e.stopPropagation();

                if(menuId){
                    top.currMenu=menuId;
                }

                var $target = e.target.nodeName === 'LI' ? $(e.target) : $(e.target.parentElement);
                //判断，如果存在右键菜单的div，则移除，保存页面上只存在一个
                if ($(document).find('div.'+CONTEXT_MENU).length > 0) {
                    $(document).find('div.'+CONTEXT_MENU).remove();
                }
                //创建一个div
                var div = document.createElement('div');
                //设置一些属性
                div.className = CONTEXT_MENU;
                div.style.width = '130px';
                div.style.backgroundColor = 'white';
                div.setAttribute('data-index',$target.index());

                var canClose=$target.hasClass('close');

                var ul = '<ul>';
                ul += '<li data-target="refresh" title="刷新当前选项卡"><i class="fa fa-refresh" aria-hidden="true"></i> 刷新</li>';
                if(canClose){
                    ul += '<li data-target="closeCurrent" title="关闭当前选项卡"><i class="fa fa-del" aria-hidden="true"></i> 关闭当前</li>';
                }
                ul += '<li data-target="closeOther" title="关闭其他选项卡"><i class="fa fa-window-del-o" aria-hidden="true"></i> 关闭其他</li>';
                if(canClose){
                    ul += '<li data-target="closeAll" title="关闭全部选项卡"><i class="fa fa-window-del-o" aria-hidden="true"></i> 全部关闭</li>';
                }
                ul += '</ul>';
                div.innerHTML = ul;
                div.style.top = e.pageY+5 + 'px';
                div.style.left = e.pageX+5 + 'px';
                //将dom添加到body的末尾
                document.getElementsByTagName('body')[0].appendChild(div);

                $(document).on('click', function () {
                    $(div).remove();
                });
                return false;
            });

            //右键菜单操作
            $('body').on('click','.'+CONTEXT_MENU+' li',function () {
                var $that=$(this),
                    index=$that.parents('.'+CONTEXT_MENU).data('index'),
                    title=that.find('.'+ELEM_TAB_TITLE+' li'),
                    content=that.find('.'+ELEM_CONTENT+' .'+ELEM_ITEM).eq(index);

                    //获取点击的target值
                    var target = $that.data('target');

                    switch (target) {
                        case 'refresh': //刷新当前
                            var iframe=content.find('iframe');
                            if(iframe.length>0){
                                iframe.attr('src',iframe.attr('src'));
                            }
                            break;
                        case 'closeCurrent': //关闭当前
                            methods.del.call(that,index);
                            break;
                        case 'closeOther': //关闭其他
                            title.each(function (i,v) {
                                var _item=$(this);
                                if(i!==index && _item.hasClass('close')){
                                    var ii=methods.exist.call(that,v.innerHTML);
                                    methods.del.call(that,ii);
                                }
                            });
                            break;
                        case 'closeAll': //全部关闭
                            title.each(function (i,v) {
                                var _item=$(this);
                                if(_item.hasClass('close')) {
                                    var ii = methods.exist.call(that, v.innerHTML);
                                    methods.del.call(that, ii);
                                }
                            });
                            break;
                    }

                    //处理完后移除右键菜单的dom
                    $('.'+CONTEXT_MENU).remove();
            });
            $('body').on('CONTEXT_MENU','.admin-CONTEXT_MENU',function (e) {
                e.stopPropagation();
                return false;
            })
        },
        select:function (index) {
            index=index||0;
            var _this=this,
                 title=$(_this).children('.'+ELEM_TAB_TITLE);

            title.find('li').eq(index).click();
        },
        getSelected:function () {
            var _this=this[0],
                c  =  $.data(_this, "tabs");
            return c.selected;
        },
        del:function (index) {
            index=index||0;
            return this.each(function (i,v) {
                var that=$(v),
                    title=that.children('.'+ELEM_TAB_TITLE),
                    content=that.children('.'+ELEM_CONTENT);

                title.find('li').eq(index).remove();
                content.find('.'+ELEM_ITEM).eq(index).remove();

                if(title.find('.'+LAY_THIS).length<1){
                    index=index===title.find('li').length?index-1:index;
                    title.find('li').eq(index).click();
                }
                methods.resizeTitle.call(that);
            })
        },
        add:function (options) {
            var _this=this;
            options=$.extend({},Tabs_Default.tab,options);
            if(!options.title){
                throw Error('标题不能为空！');
            }
            return _this.each(function (i,v) {
                var that=$(v),
                    c  =  $.data(this, "tabs"),
                    title=that.children('.'+ELEM_TAB_TITLE),
                    content=that.children('.'+ELEM_CONTENT),
                    exist=methods.exist.call(_this,options.title),
                    isClose=options.closed||c.closed;

                if(exist===-1 || options.force){
                    if(exist>=0){
                        methods.del.call(_this,exist);
                    }
                    //标题
                    var _li=$('<li class="'+(c.contextmenu?TAB_MENU:"")+(isClose?' close':'')+'" data-menuId="'+(options.extra===undefined ? '':options.extra.menuId===undefined? '':options.extra.menuId)+'" data-title="'+options.title+'">'+(function () {
                        var title=options.title;
                        if(options.showIcon && options.icon){
                            title='<i class="layui-icon">'+options.icon+'</i>'+title;
                        }
                        if(isClose){
                            title+= '<i class="layui-icon layui-unselect '+TAB_CLOSE+'">&#x1006;</i>';
                        }
                        return title;
                    })()+'</li>');
                    var _last=title.find('li').last();
                    if(_last.length>0){
                        _last.after(_li);
                    }else{
                        title.append(_li);
                    }

                    //内容
                    content.append('<div class="layui-tab-item">'+(function () {
                        if(options.iframe){
                            return '<iframe class="layui-iframe" src="'+options.url+'" ></iframe>';
                        }
                        return options.content;
                    })()+'</div>');

                    _li.click();
                    methods.resizeTitle.call(_this);
                }else{
                    methods.select.call(this,exist);
                }
                c.done && c.done();
            });
        },
        exist:function (t) {
            var _this=this.length>0?this[0]:this,
                title=$(_this).children('.'+ELEM_TAB_TITLE),
                index=-1;

            t=t.split('<i')[0];
            title.find('li').each(function (i,v) {
                var _title=$(v).data('title');
                if(_title ===t){
                    index=i;
                }
            });
            return index;
        }
    };

    //在插件中使用对象
    $.fn.tabs  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tabs');
            return this;
        }
        return method.apply(this, arguments);
    };

    $(document).find('.'+ELEM_TABS).each(function (i,v) {
        $(v).tabs()
    });

    exports('tabs');
});