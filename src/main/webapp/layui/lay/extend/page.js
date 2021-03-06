layui.define(['jquery','util'], function (exports) {
    window.$  =  layui.jquery;
    var util=layui.util;

    var  ELEM_PAGE  =  'layui-table-page',ELEM_PAGE_INPUT = 'layui-input',ELEM_PAGE_BTN = 'layui-laypage-btn',ELEM_BOX = 'layui-box',disabled='layui-disabled';

    var defaultPage={
        layout: ['prev', 'page', 'next','skip','count','limit'] //自定义分页布局
        ,groups: 3 //连续页码
        ,first: true //显示首页
        ,last: true //显示尾页
        ,page:0
        ,pageSize:10
        ,totalCount:0
        ,onChange:undefined
    };


    var methods={
        init: function (options) {
            return this.each(function (i, item) {
                var _this = this;
                var c  =  $.data(_this, "page");
                var opt = {};
                if (c) {
                    opt = $.extend({},c, options);
                }else{
                    var _option = $(_this).data('options');
                    if(typeof _option==="string"){
                        opt =util.getOptions(_option);
                    }
                    opt = $.extend({}, defaultPage,opt, options);
                }
                $.data(_this, "page", opt);
                methods.initDom.call(_this);
                methods.event.call(_this);
            })
        },
        initDom:function (){
            var $this=$(this),
                c=$.data(this,'page'),
                totalPage = Math.ceil(c.totalCount/c.pageSize),
                method = {
                    limit:function () {
                        var span = '<span class = "layui-laypage-limits">';
                        span+= '<select lay-ignore>';
                        for(var i = 0;i<9;i++){
                            var size = (i+1)*10;
                            span+= '<option value = "'+size+'" '+(size===c.pageSize?"selected":"")+'>'+size+' 条/页</option>';
                        }
                        span+= '</select></span>';
                        return span;
                    },
                    count:function () {
                        return '<span class = "layui-laypage-count">共 '+c.totalCount+' 条</span>';
                    },
                    prev:function () {
                        var a = '';
                        if(c.page==1){
                            a = '<a href = "javascript:;" class = "layui-laypage-prev '+disabled+'" data-page = "1"><i class = "layui-icon">&#xe603;</i></a>';
                        }else{
                            a = '<a href = "javascript:;" class = "layui-laypage-prev" data-page = "'+(c.page-1)+'"><i class = "layui-icon">&#xe603;</i></a>';
                        }
                        return a;
                    },
                    next:function () {
                        var a = '';
                        //下一页
                        if(c.page>=totalPage){
                            a+= '<a href = "javascript:;" class = "layui-laypage-prev '+disabled+'" data-page = "'+totalPage+'"><i class = "layui-icon">&#xe602;</i></a>';
                        }else{
                            a+= '<a href = "javascript:;" class = "layui-laypage-prev" data-page = "'+(c.page+1)+'"><i class = "layui-icon">&#xe602;</i></a>';
                        }
                        return a;
                    },
                    page:function () {
                        var a = '',showCount = Math.ceil((c.groups-1)/2);
                        //首页
                        if(c.first && c.page>1){
                            a+= '<a href = "javascript:;" class = "layui-laypage-first" data-page = "1" title = "首页">1</a>';
                        }
                        //点点
                        if(c.page-showCount>2){
                            a+= '<span class = "layui-laypage-spr">…</span>';
                        }
                        //前一页
                        // showCount = c.page===totalPage?showCount*2:showCount;
                        if(showCount>0&&(c.page-showCount>1)){
                            for(var i = showCount;i>0;i--){
                                a+= '<a href = "javascript:;" data-page = "'+(c.page-showCount)+'">'+(c.page-showCount)+'</a>';
                            }
                        }
                        //当前
                        a+= '<span class = "layui-laypage-curr"><em class = "layui-laypage-em"></em><em>'+c.page+'</em></span>';
                        //后一页
                        // showCount = c.page===1?showCount*2:showCount;
                        if(showCount>0&&(c.page+showCount<totalPage)){
                            for(var i = 0;i<showCount;i++){
                                a+= '<a href = "javascript:;" data-page = "'+(c.page+i+1)+'">'+(c.page+i+1)+'</a>';
                            }
                        }
                        //点点
                        if(c.page+showCount<totalPage-1){
                            a+= '<span class = "layui-laypage-spr">…</span>';
                        }
                        //尾页
                        if(c.last&& c.page < totalPage){
                            a+= '<a href = "javascript:;" class = "layui-laypage-last" title = "尾页" data-page = "'+totalPage+'">'+totalPage+'</a>';
                        }
                        return a;
                    },
                    skip:function () {
                        var span = '<span class = "layui-laypage-skip">' +
                            '到第' +
                            '<input type = "text" min = "1" value = "'+(totalPage===0?1:c.page===totalPage?totalPage:c.page+1)+'" class = "'+ELEM_PAGE_INPUT+'">' +
                            '页' +
                            '<button type = "button" class = "'+ELEM_PAGE_BTN+'">确定</button></span>';
                        return span;
                    }
                },
                _page = [
                    '<div id = "'+ELEM_PAGE+c.index+'">',
                    '<div class = "'+ELEM_BOX+' layui-laypage layui-laypage-default">',
                    (function () {
                        var html = '';
                        $.each(c.layout,function (i,v) {
                            html+= method[v]&&method[v]();
                        });
                        return html;
                    })(),
                    '</div></div>'
                ].join('');
            if($this.hasClass(ELEM_PAGE)){
                $this.html(_page)
            }else{
                $this.html('<div class="'+ELEM_PAGE+'">'+_page+'</div>')
            }
        },
        event:function () {
            var _this=this,
                $this=$(_this);

            //切换分页
            $this.on('click','a',function () {
                var index = $(this).data('page')*1,
                    c=$.data(_this,'page');

                if($(this).hasClass(disabled)) return false;
                c.page=index;
                $.data(_this,'page',c);
                var opt={
                    page:index,
                    pageSize: c.pageSize
                };
                c.onChange && c.onChange(opt);
            });
            //跳转页面
            $this.on('click',' .'+ELEM_PAGE_BTN,function () {
                var index = $this.find('.'+ELEM_PAGE_INPUT).val()*1,
                    c=$.data(_this,'page'),
                    totalPage = Math.ceil(c.totalCount/c.pageSize);

                index = index<2?1:totalPage>index?index:totalPage;

                c.page=index;
                $.data(_this,'page',c);
                var opt={
                    page:index,
                    pageSize: c.pageSize
                };
                c.onChange && c.onChange(opt);
            });
            //切换显示数目
            $this.on('change','select',function () {
                var _pageSize = $(this).val(),
                    c=$.data(_this,'page');

                c.page=1;
                c.pageSize=_pageSize;
                $.data(_this,'page',c);

                var opt={
                    page:1,
                    pageSize: _pageSize
                };
                c.onChange && c.onChange(opt);
            });
        }
    };

    //在插件中使用对象
    $.fn.page  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.page');
            return this;
        }
        return method.apply(this, arguments);
    }


    exports('page');
});