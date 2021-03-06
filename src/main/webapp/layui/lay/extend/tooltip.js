layui.define(['jquery','util'], function (exports) {
    window.$  =  layui.jquery;

    var util=layui.util;

    var ELEM='.tooltip',ELEM_TOOLTIP='layui-tooltip';
    var _default={
        content:'',
        position:''
    }
    var _index=0;

    var methods={
        init:function (options) {
            return this.each(function (i, item) {
                // var _this = this;
                // var opt={};
                // var _option = $(_this).data('options');
                // if(typeof _option==="string"){
                //     opt = util.getOptions(_option.replace(/[\r\n]/g,""));
                // }
                // _this.config=$.extend({},_default,opt);

                methods.event.call(this);
            })
        },
        event:function () {
            var _this = this
                ,spaceName='.tooltip'
                ,body=$('body');

            body.off(spaceName);
            body.on('mouseenter'+spaceName,ELEM,function () {
                var _this = $(this);
                var opt={};
                var _option = _this.data('options')
                    ,position={
                        width:_this.outerWidth(),
                        height:_this.outerHeight(),
                       left:_this.offset().left,
                       top:_this.offset().top
                    }

                if(typeof _option==="string"){
                    opt = util.getOptions(_option.replace(/[\r\n]/g,""));
                }else{
                    opt=_option;
                }
                opt=$.extend({},_default,opt);

                if(_this.data('tooltip_index')!==undefined){
                    var _tooltip=$('#layui-tooltip-'+_this.data('tooltip_index'));

                    var toolWidth=_tooltip.outerWidth(),toolHeight=_tooltip.outerHeight();

                    var obj=methods.initPosition(opt,toolWidth,toolHeight,position);

                    if(_tooltip.html()!==opt.content){
                        _tooltip.html(opt.content);
                    }
                    _tooltip.css({left:obj.left+'px',top:obj.top+'px'}).show();
                }else{
                    _this.data('tooltip_index',_index++);
                    var _tooltip=$('<div id="layui-tooltip-'+_this.data('tooltip_index')+'" class="'+ELEM_TOOLTIP+'">'+opt.content+'</div>');
                    body.append(_tooltip);

                    var toolWidth=_tooltip.outerWidth(),toolHeight=_tooltip.outerHeight();
                    
                    var obj=methods.initPosition(opt,toolWidth,toolHeight,position);

                    _tooltip.css({left:obj.left+'px',top:obj.top+'px'}).addClass(opt.position||'bottom');
                }
            });
            body.on('mouseleave'+spaceName,ELEM,function () {
                var _this = $(this),
                    index=_this.data('tooltip_index'),
                    tips=$('#layui-tooltip-'+index);

                clearTimeout(tips.data('timmer'));

                var _timmer=setTimeout(function () {
                    tips.hide();
                },500);

                tips.data('timmer',_timmer);
            });
            body.on('mouseenter'+spaceName,'.'+ELEM_TOOLTIP,function () {
                var tips=$(this);
                clearTimeout(tips.data('timmer'));
            });
            body.on('mouseleave'+spaceName,'.'+ELEM_TOOLTIP,function () {
                var tips=$(this);

                var _timmer=setTimeout(function () {
                    tips.hide();
                },500);

                tips.data('timmer',_timmer);
            });
        },
        initPosition:function (opt,tWidth,tHeight,pos) {
            var bodyWidth=$(window).width(),bodyHeight=$(window).height();

            var getPosition=function(postion){
                var setLeft=0,setTop=0;
                switch (postion){
                    case 'top':
                        setLeft=pos.left+(pos.width-tWidth)/2;
                        setTop=pos.top-tHeight-5;
                        break;
                    case 'left':
                        setLeft=pos.left-tWidth-5;
                        setTop=pos.top+(pos.height-tHeight)/2;
                        break;
                    case 'right':
                        setLeft=pos.left+pos.width+5;
                        setTop=pos.top+(pos.height-tHeight)/2;
                        break;
                    case 'bottom':
                    default:setLeft=pos.left+(pos.width-tWidth)/2;setTop=pos.top+pos.height+5;
                }
                return {
                    left:setLeft,
                    top:setTop
                }
            };

            var obj=getPosition(opt.position);

            var _postion='';
            if(obj.top-tHeight>bodyHeight){
                _postion='top';
            }
            if(obj.top<0){
                _postion='bottom';
            }
            if(obj.left<0){
                _postion='right';
            }
            if(obj.left+tWidth>bodyWidth){
                _postion='left';
            }
            if(_postion!=='' && _postion!==opt.position){
                opt.position=_postion;
                obj=getPosition(opt.position);
            }
            return obj;
        }
    };

    //在插件中使用对象
    $.fn.tooltip  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
            return this;
        }
        return method.apply(this, arguments);
    }

    $(document).find(ELEM).each(function (i,v) {
        $(v).tooltip()
    });

    exports('tooltip');
});