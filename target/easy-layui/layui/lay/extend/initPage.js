layui.define(['jquery','datagrid','util','tmpl','myform','laydate'], function (exports) {
    window.$  =  layui.jquery;

    var util=layui.util
        ,tmpl=layui.tmpl
        ,laytpl=layui.laytpl;

    var eventsName = '.global';
    var events = ['input', 'change', 'click', 'mousedown', 'mouseup']; // 事件类型

    var methods={
        init:function (options) {
            return this.each(function (i, item) {
                var _this = $(this);
                var c  =  $.data(_this, "initPage");
                var opt={};
                if(c){
                    opt = $.extend({},c, options);
                    $.data(_this, "initPage", opt);
                }else{
                    var _option = $(_this).data('options');
                    if(typeof _option==="string"){
                        opt = util.getOptions(_option);
                    }
                    opt = $.extend({}, opt, options);
                    $.data(_this, "initPage", opt);
                }
                methods.render.call(_this);
            })
        },
        render:function () {
            var _this=this,
                c  =  $.data(_this, "initPage");

            if(c.searchs){
                methods.initSearchs.call(_this);
            }
            if(c.menus){
                methods.initMenus.call(_this);
            }
            if(c.table){
                methods.initTables.call(_this);
            }
            methods.event.call(_this);
        },
        //初始化搜索表单
        initSearchs:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,searchs=_this.find('#searchs');

            if(searchs.length===0){
                searchs=$('<div id="searchs"></div>');
                _this.prepend(searchs);
            }

            methods.setTemplate({
                elem:searchs,
                type:'search',
                data:c.searchs
            });

            $.each(c.searchs,function (i,v) {
                if ('date' ===  v.type) {
                    layui.laydate.render({
                        elem: $(' [name=' + v.name + ']', searchs)[0]
                    })
                }else if(v.type==='select'){
                    $('select[name='+v.name+']',searchs).select();
                }
            })
        },
        //初始化按钮事件
        initMenus:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,menus=_this.find('#menus');

            if(menus.length===0){
                var searchs=_this.find('#searchs');
                menus=$('<div id="menus"></div>');
                searchs.length>0?searchs.after(menus):  _this.prepend(menus);
            }
            var currMenu=top.window.currMenu ;
            $.getJSON(c.menus,{ menuId: currMenu },function (res) {
                if(res.ok){
                    methods.setTemplate({
                        elem:menus,
                        type:'menu',
                        data:res[util.webConfig.resName]
                    })
                }
            });
        },
        //初始化表格
        initTables:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,tables=_this.find('#tables');

            if(tables.length===0){
                tables=$('<div id="tables"></div>');
                _this.append(tables);
            }

            var options=$.extend({},{
                page: true,
                singleSelect: true,
                checkOnClick:true,
            },c.table);

            tables.datagrid(options);

            _this.data('tables',tables);
        },
        setTemplate:function (params) {
            laytpl(tmpl[params.type]).render(params.data, function(html) {
                if(params.append){
                    params.elem.append(html);
                }else{
                    params.elem.html(html);
                }
            })
        },
        // 设置按钮可点击
        usable: function(target) {
            target.removeAttr('disabled').removeClass('layui-btn-disabled');
        },
        // 设置按钮不可点击
        disable: function(target) {
            target.attr('disabled', 'disabled').addClass('layui-btn-disabled');
        },
        event:function () {
            var _this=this
                // ,c  =  $.data(_this, "initPage")
                ,form=_this.find('#searchs form').eq(0)
                ,table=_this.children('#tables').eq(0)
                ,menus=_this.children('#menus').eq(0)

            _this.on('click','[lay-submit]',function () {
                table.datagrid('reload',{request:{page:0,where:form.myform('getValue')}});
                return false;
            });

            _this.off(eventsName);
            $.each(events, function(i, item) {
                var subDom = '[event=' + item + ']';
                if (item === 'click') subDom += ',[event]';

                _this.on(item + eventsName, subDom, function(e) {
                    var othis = $(this),
                        method = othis.attr('methodname'),
                        callback = function() {
                            setTimeout(function() {
                                methods.usable(othis);
                            }, 0)
                        };

                    methods.disable(othis);

                    try {
                        eval(method + '(callback)');
                    } catch(e) {
                       console.log(e);
                        callback();
                    }
                })
            })

        }
    };

    //在插件中使用对象
    $.fn.initPage  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.initPage');
            return this;
        }
        return method.apply(this, arguments);
    }

    exports('initPage');
});