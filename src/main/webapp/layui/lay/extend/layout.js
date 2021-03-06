layui.define(['jquery','nav','tooltip','tabs'], function (exports) {
    window.$  =  layui.jquery;

    var doc=$('body');

    var ELEM_LAYOUT='.layui-layout',
        ELEM_HEADER='.layui-header',
        ELEM_SIDE='.layui-side',
        ELEM_RIGHT='.layui-side-right',
        ELEM_BODY='.layui-body',
        ELEM_FOOTER='.layui-footer',
        ELEM_COLLAPSE='.layui-collapse-menu',
        ELEM_HOVER_OPEN='layui-hover-open';

    var $layout=doc.find(ELEM_LAYOUT).eq(0),
        $header=$layout.children(ELEM_HEADER).eq(0),
        $sideLeft=$layout.children(ELEM_SIDE).eq(0),
        $sideRight=$layout.children(ELEM_RIGHT).eq(0),
        $body=$layout.children(ELEM_BODY).eq(0),
        $footer=$layout.children(ELEM_FOOTER).eq(0);

    var menuIndex=0;

    var Class=function(){
        this.init();
    };
    Class.prototype={
        init:function () {
            var bodyLeft=0,
                bodyRight=0,
                bodyTop=0,
                bodyBottom=0,
                padding=0;
            if($header.length>0){
                bodyTop=$header.height();
            }
            if($footer.length>0){
                bodyBottom=$footer.height();
                $footer.css({left:bodyLeft+'px',right:bodyRight+'px'});
            }
            if($sideLeft.length>0){
                bodyLeft=$sideLeft.width();
                $sideLeft.css({bottom:bodyBottom+'px'});
            }
            if($sideRight.length>0){
                bodyRight=$sideRight.width();
                $sideRight.css({bottom:bodyBottom+'px'});
            }
            if($body.find(ELEM_FOOTER).length>0){
                padding=$body.find(ELEM_FOOTER).outerHeight();
            }
            $body.css({left:bodyLeft+'px',right:bodyRight+'px',top:bodyTop+'px',bottom:bodyBottom+'px','padding-bottom':padding+'px'});

            this.event();
        },
        event:function () {
            var body= $('body');

            $layout.on('click',ELEM_COLLAPSE,function () {
                $layout.toggleClass('collapse');
                toggleLeft();

            });
            $layout.on('mouseenter','.hasChildMenu',function () {
                var _this=$(this);
                var pos={
                    width:_this.outerWidth(),
                    height:_this.outerHeight(),
                    left:_this.offset().left,
                    top:_this.offset().top
                }
                    ,index=_this.data('index')
                    ,wHeight=Math.max($(window).height(),body.outerHeight());


                if(index===undefined){
                    index=menuIndex++;
                    var vertical=$('<div class="layui-vertical-menu layui-nav-itemed" id="layui-vertical-menu'+index+'"><dl class="layui-nav-child layui-anim layui-anim-upbit"></dl></div>');

                    vertical.children('dl').append(_this.find('dl').html());
                    vertical.find('a').attr('href','javascript:;');

                    body.append(vertical);

                    if(pos.top+vertical.outerHeight()>wHeight){
                        pos.top=pos.top-vertical.outerHeight()+pos.height;
                    }
                    vertical.css({left:pos.width+pos.left+5+'px',top:pos.top+'px'});


                    _this.data('index',index);

                    vertical.on('click','dd',function () {
                        var _index=$(this).index();
                        _this.find('dd').eq(_index).find('a').click();
                    })

                }else{
                    var vertical= $('#layui-vertical-menu'+index);
                    clearTimeout(vertical.data('timmer'));

                    if(pos.top+vertical.outerHeight()>wHeight){
                        pos.top=pos.top-vertical.outerHeight()+pos.height;
                    }
                    vertical.css({left:pos.width+pos.left+5+'px',top:pos.top+'px'}).show();
                }
            });
            $layout.on('mouseleave','.hasChildMenu',function () {
                var _this=$(this)
                    ,index=_this.data('index')
                    ,vertical=$('#layui-vertical-menu'+index)
                    ,timmer=vertical.data('timmer');
                clearTimeout(timmer);
                timmer=setTimeout(function () {
                    vertical.hide();
                },600);
                vertical.data('timmer',timmer);
            });
            body.on('mouseenter','.layui-vertical-menu',function () {
                var _this=$(this)
                    ,timmer=_this.data('timmer');
                clearTimeout(timmer);
            });
            body.on('mouseleave','.layui-vertical-menu',function () {
                var _this=$(this)
                    ,timmer=_this.data('timmer');
                clearTimeout(timmer);
                timmer=setTimeout(function () {
                    _this.hide();
                },600);
                _this.data('timmer',timmer);
            });

            body.on('mouseenter','.'+ELEM_HOVER_OPEN,function () {
                $layout.removeClass('collapse');
            });
            body.on('mouseleave','.'+ELEM_HOVER_OPEN,function () {
                $layout.addClass('collapse');
            });
        },
        closeLeft:function () {
            $layout.addClass('collapse');
            toggleLeft();
        }
    };
    var toggleLeft=function () {
        if(!$sideLeft.hasClass(ELEM_HOVER_OPEN)){
            if($layout.hasClass('collapse')){
                $sideLeft.find('.layui-nav-item').each(function (index,item) {
                    var $this=$(this);

                    if($this.find('dl').length>0) {
                        $this.addClass('hasChildMenu');
                    }else{
                        $this.addClass('tooltip').data('options',{
                            content:$this.find('cite').text(),
                            position:'right'
                        })
                    }
                });
                $('.tooltip').tooltip();
            }else{
                $sideLeft.find('.tooltip').removeClass('tooltip');
                $sideLeft.find('.hasChildMenu').removeClass('hasChildMenu');
            }
        }
    }

    window.layout=function () {
        return new Class();
    }();

    exports('layout');
});