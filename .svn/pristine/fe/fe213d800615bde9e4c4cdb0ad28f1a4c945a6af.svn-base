layui.define(['jquery','datagrid','util','tmpl','myform','laydate','doT'], function (exports) {
    window.$  =  layui.jquery;

    var util=layui.util
        ,tmpl=layui.tmpl;

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
            }else{
                if(c.table){
                    methods.initTables.call(_this);
                }
            }
            if(c.menus){
                methods.initMenus.call(_this);
            }
            methods.event.call(_this);
        },
        //初始化搜索表单
        initSearchs:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,searchs=_this.find('.layui_searchs').eq(0);

            if(searchs.length===0){
                searchs=$('<div class="layui_searchs"></div>');
                _this.prepend(searchs);
            }

            methods.setTemplate({
                elem:searchs,
                type:'search',
                data:c.searchs
            });

            var obj={};
            $.each(c.searchs,function (i,v) {
                if ('date' ===  v.type) {
                    layui.laydate.render({
                        elem: $(' [name=' + v.name + ']', searchs)[0]
                    })
                }else if(v.type==='select'){
                    var options=util.getOptions(v.options);
                    if(options.value){
                        obj[v.name]=options.value;
                    }
                    $('select[name='+v.name+']',searchs).select();
                }
            });

            if(c.table){
                methods.initTables.call(_this,obj);
            }
        },
        //初始化按钮事件
        initMenus:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,menus=_this.find('.layui_menus').eq(0);

            if(menus.length===0){
                var searchs=_this.find('.layui_searchs');
                menus=$('<div class="lay_menus"></div>');
                searchs.length>0?searchs.after(menus):  _this.prepend(menus);
            }

            if(Object.prototype.toString.call(c.menus)  === '[object Array]'){
                methods.setTemplate({
                    elem:menus,
                    type:'menu',
                    data:c.menus
                })
            }else{
                var currMenu=top.window.currMenu ;
                $.ajax({
                    url:c.menus,
                    data:{ menuId: currMenu },
                    successed:function (res) {
                        if(res.ok){
                            methods.setTemplate({
                                elem:menus,
                                type:'menu',
                                data:res[util.webConfig.resName]
                            })
                        }
                    }
                });
            }
        },
        //初始化表格
        initTables:function (obj) {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,form=_this.find('.layui_searchs').eq(0)
                ,tables=_this.find('.layui_tables').eq(0);

            if(tables.length===0){
                tables=$('<div class="layui_tables"></div>');
                _this.append(tables);
            }

            var options=$.extend({},{
                page: true,
                checkOnClick:true,
            },c.table);

            if(form){
                var search=form.myform('getValue');
                if(obj){
                    search=$.extend({},search,obj);
                }
                options=$.extend(true,{where:search},options);
            }
            tables.datagrid(options);

            _this.data('tables',tables);
        },
        setTemplate:function (params) {

            var html=$.doT(tmpl[params.type],params.data);

            if(params.append){
                params.elem.append(html);
            }else{
                params.elem.html(html);
            }
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
                ,form=_this.find('.layui_searchs').eq(0)
                ,table=_this.children('.layui_tables').eq(0)

            _this.on('click','[lay-submit]',function () {
                table.datagrid('reload',{request:{page:1},where:form.myform('getValue')});
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

        },
        table:function () {
            var _this=this
                ,c  =  $.data(_this, "initPage")
                ,tables=_this.find('.layui_tables').eq(0);

            return tables.datagrid.apply(tables,arguments);
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