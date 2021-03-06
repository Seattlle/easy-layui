layui.define(['jquery','util'], function(exports){
    "use strict";
    var $  = layui.jquery,
        util = layui.util;

    //图标
    var icon = {
        arrow: ['&#xe623;', '&#xe625;'] //箭头
        ,checkbox: ['&#xe626;', '&#xe627;'] //复选框
        ,radio: ['&#xe62b;', '&#xe62a;'] //单选框
        ,branch: ['&#xe622;', '&#xe624;'] //父节点
        ,leaf: '&#xe621;' //叶节点
    };

    var enterSkin = 'layui-tree-enter';

    var MyTree = function (options) {

    };

    MyTree.prototype.init = function (options) {
        var that = this;
        var config = options[0];

        config=$.extend(true,{idName:'menuId',pidName:'pid',children:'children'},config);


        that.addClass('layui-box layui-tree'); //添加tree样式
        if(config.skin){
            that.addClass('layui-tree-skin-' + config.skin);
        }
        if(config.url){
            $.ajax({
                url: config.url,
                data:config.where ||{},
                doFun: function(res) {
                    $.extend(true, config, {
                        nodes: util.transData( res['vo'], config['idName'], config['pidName'],  config['children'])
                    });

                    MyTree.prototype.config = config;
                    MyTree.prototype.tree(that,MyTree.prototype.config.nodes);
                }
            })
        }else{
            MyTree.prototype.config = config;
            MyTree.prototype.tree(that,MyTree.prototype.config.nodes);
        }


    };

    MyTree.prototype.tree = function (elem,children) {
        var that = this, options = that.config;

        var nodes =  children ||options.nodes ;
        layui.each(nodes, function(index, item){
            var hasChild = item.children && item.children.length > 0;
            var ul = $('<ul class="'+ (item.spread ? "layui-show" : "") +'"></ul>');
            var li = $(['<li '+ (item.spread ? 'data-spread="'+ item.spread +'"' : '') +'>'
                //展开箭头
                ,function(){
                    return hasChild ? '<i class="layui-icon layui-tree-spread">'+ (
                        item.spread ? icon.arrow[1] : icon.arrow[0]
                    ) +'</i>' : '';
                }()

                //复选框/单选框
                ,function(){
                    return options.check ? (
                        '<i class="layui-icon layui-tree-check '+ (item.checked?'checked':'') +'" data-menuId="'+ item[options.idName] +'">'+ (
                            options.check === 'checkbox' ? (item.checked?icon.checkbox[1]:icon.checkbox[0]) : (
                                options.check === 'radio' ? (item.checked?icon.radio[1]:icon.radio[0]) : ''
                            )
                        ) +'</i>'
                    ) : '';
                }()

                //节点
                ,function(){
                    return '<a href="'+ (item.href || 'javascript:;') +'" '+ (
                            options.target && item.href ? 'target=\"'+ options.target +'\"' : ''
                        ) +'>'
                        + ('<i class="layui-icon layui-tree-'+ (hasChild ? "branch" : "leaf") +'">'+ (
                            hasChild ? (
                                item.spread ? icon.branch[1] : icon.branch[0]
                            ) : icon.leaf
                        ) +'</i>') //节点图标
                        + ('<cite>'+ (item.name||'未命名') +'</cite></a>');
                }()
                ,function() {
                    if (options.button && Object.prototype.toString.call(item.buttons) === "[object Array]") {
                        var html = '<ul style="display:block">';
                        layui.each(item.buttons, function(k, v) {
                            html +=
                                [
                                    '<li class="layui-tree-inline">',
                                    '<i class="layui-icon layui-tree-check layui-tree-button '+ (v.checked ?'checked' : '') +'" data-buttonid="'+ v.buttonId +'">' + icon.checkbox[v.checked ? 1 : 0] + '</i>',
                                    '<cite>' + v.name + '</cite>',
                                    '</li>'
                                ].join('')
                        });
                        html + '</ul>';
                        return html
                    }
                }()
                ,'</li>'

            ].join(''));

            //如果有子节点，则递归继续生成树
            if(hasChild){
                li.append(ul);
                MyTree.prototype.tree(ul, item.children);
            }

            elem.append(li);

            //触发点击节点回调
            typeof options.click === 'function' && MyTree.prototype.click(li, item);

            //伸展节点
            MyTree.prototype.spread(li, item);

            //拖拽节点
            options.drag && MyTree.prototype.drag(li, item);
        });
        MyTree.prototype.on(elem);
    };

    //通用事件
    MyTree.prototype.on = function(elem){
        var that = this, options = that.config;
        var dragStr = 'layui-tree-drag';


        //屏蔽选中文字
        elem.on('selectstart','i',function(e){
            return false
        });

        elem.off('click.myTree').on('click.myTree','.layui-tree-check', function(e){
            var _this=$(this);
            var flag = _this.hasClass('checked');
            if(flag){
                _this.removeClass('checked').html(icon.checkbox[0]);
                _this.siblings('ul').find('.layui-tree-check').removeClass('checked').html(icon.checkbox[0]);
                var flag2 = _this.parents('li').siblings('li').children('.layui-tree-check').hasClass('checked');
                if(!flag2){
                    _this.parent().parent().siblings('.layui-tree-check').removeClass('checked');
                }
            }else{
                _this.addClass('checked').html(icon.checkbox[1]);
                _this.siblings('ul').find('.layui-tree-check').addClass('checked').html(icon.checkbox[1]);
                _this.parentsUntil('.layui-tree','li').children('.layui-tree-check').addClass('checked').html(icon.checkbox[1]);
            }
            return false;
        });
        //拖拽
        if(options.drag){
            $(document).on('mousemove', function(e){
                var move = that.move;
                if(move.from){
                    var to = move.to, treeMove = $('<div class="layui-box '+ dragStr +'"></div>');
                    e.preventDefault();
                    $('.' + dragStr)[0] || $('body').append(treeMove);
                    var dragElem = $('.' + dragStr)[0] ? $('.' + dragStr) : treeMove;
                    (dragElem).addClass('layui-show').html(move.from.elem.children('a').html());
                    dragElem.css({
                        left: e.pageX + 10
                        ,top: e.pageY + 10
                    })
                }
            }).on('mouseup', function(){
                var move = that.move;
                if(move.from){
                    move.from.elem.children('a').removeClass(enterSkin);
                    move.to && move.to.elem.children('a').removeClass(enterSkin);
                    that.move = {};
                    $('.' + dragStr).remove();
                }
            });
        }
    };

    //点击节点回调
    MyTree.prototype.click = function(elem, item){
        var that = this, options = that.config;
        elem.children('a').on('click', function(e){
            layui.stope(e);    //阻止事件冒泡
            options.click(item)
        });
    };

    //伸展节点
    MyTree.prototype.spread = function(elem, item){
        var that = this, options = that.config;
        var arrow = elem.children('.layui-tree-spread');
        var ul = elem.children('ul'), a = elem.children('a');

        //执行伸展
        var open = function(){
            if(elem.data('spread')){          //当前为伸展状态
                elem.data('spread', null);
                ul.removeClass('layui-show');
                arrow.html(icon.arrow[0]);
                a.find('.layui-icon').html(icon.branch[0]);
            } else {                          //当前为收缩状态
                elem.data('spread', true);
                ul.addClass('layui-show');
                arrow.html(icon.arrow[1]);
                a.find('.layui-icon').html(icon.branch[1]);
            }
        };

        //如果没有子节点，则不执行
        if(!ul[0]) return;

        arrow.on('click', open);
        a.on('dblclick', open);
    };

    //拖拽节点
    MyTree.prototype.move = {};
    MyTree.prototype.drag = function(elem, item){
        var that = this, options = that.config;
        var a = elem.children('a');
        var mouseenter = function(){
            var othis = $(this), move = that.move;
            if(move.from){
                move.to = {
                    item: item
                    ,elem: elem
                };
                othis.addClass(enterSkin);
            }
        };
        a.on('mousedown', function(){
            var move = MyTree.prototype.move;
            move.from = {
                item: item,
                elem: elem
            };
        });
        a.on('mouseenter', mouseenter).on('mousemove', mouseenter).on('mouseleave', function(){
            var othis = $(this), move = that.move;
            if(move.from){
                delete move.to;
                othis.removeClass(enterSkin);
            }
        });
    };

    MyTree.prototype.checkStatus = function() {
        var elem = $(this),
            menuIds = [],
            buttonIds = [];

        elem.find('i.layui-tree-check.checked').each(function(i, item) {
            if($(item).data('menuid')){
                menuIds.push($(item).data('menuid'))
            }else if($(item).data('buttonid')){
                buttonIds.push($(item).data('buttonid'))
            }
        });

        return {
            menuIds: menuIds.join(';'),
            buttonIds: buttonIds.join(';')
        }
    };

    $.fn.myTree = function (options) {
        var contype  =  options;
        if(typeof(contype) == 'object'){
            var myTree = new MyTree(options);
            return myTree.init.call(this,arguments);
        }else if(contype == 'checkStatus'){
            var myTree = new MyTree(options);
            return myTree.checkStatus.call(this);
        }else if(!contype){
            $.error('参数不能为空');
            return this;
        }
    };

    //暴露接口
    exports('myTree');
});