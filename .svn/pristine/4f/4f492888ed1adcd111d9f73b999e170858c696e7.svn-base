layui.define(['jquery', 'dialog'], function (exports) {
    var isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";

    var $ = layui.jquery,
        layer;

        try {
            layer = top.layer || layui.layer
        } catch (e) {
            layer = layui.layer
        }
    var gallery=function (options) {
        var _default={
            listen:'preview',
            wrapClass:'.preview_wrap',
            activeClass:'active_gallery',
            popup:{
                type: 0,
                title: '',
                scrollbar: false,
                shadeClose: true,
                shade: 0.8,
                content: '<div class="gallery"></div>',
                btn:[],
                success:null,
                resizing:null ,
                cancel: null
            }
        }
        this.config=$.extend(true,_default,options);
        this.initEvent();
    }
    gallery.prototype={
        initEvent:function () {
            var _this=this,
                o=_this.config;
            $(document).off('click.'+o.listen).on("click."+o.listen+"", 'img['+o.listen+']', function () {
                if(!$(this).hasClass(o.activeClass)){
                    _this.initPopup(this);
                }
            });
            _this.initStyle();
        },
        initPopup:function (obj) {
            var _this=this,
                o=_this.config;

            var $img = $(obj),
                imgUrl = $img[0].src;
            if (!imgUrl) return false;

            //HTML5提供了一个新属性naturalWidth/naturalHeight可以直接获取图片的原始宽高
            var img = $img[0],
                imgHeight = img.naturalHeight,
                imgWidth = img.naturalWidth,
                ratio = imgWidth / imgHeight,
                wH = 415,
                wW = 615,
                winHeight,
                winWidth,
                maxHeight = $(window).height()*0.8,
                maxWidth = $(window).width()*0.8;


            winWidth = Math.max(wW, imgWidth);
            winHeight = Math.max(wH, imgHeight);

            if (winWidth > maxWidth) {
                winWidth = maxWidth;
                winHeight = Math.max(wH, Math.ceil(winWidth / ratio));
                if (imgWidth > winWidth) {
                    imgWidth = winWidth;
                    imgHeight = Math.ceil(imgWidth / ratio);
                }
            }

            if (winHeight > maxHeight) {
                winHeight = maxHeight;
                winWidth = Math.max(wW, Math.ceil(winHeight * ratio));
                if (imgHeight > winHeight) {
                    imgHeight = winHeight;
                    imgWidth = Math.ceil(imgHeight * ratio);
                }
            }

            var $gallerys =$(obj).parents(o.wrapClass),
                activeIndex = 0,
                imgs = [];

            $gallerys=$gallerys.length>0? $gallerys:$(obj).parent('');

            var Images=$gallerys.find("img["+o.listen+"]");

            Images.each(function (i, elem) {
                var url = this.src,
                    img = $(this)[0],
                    nH = img.naturalHeight,
                    nW = img.naturalWidth,
                    ratio = nW / nH,
                    w = nW,
                    h = nH;
                if (url === imgUrl) {
                    activeIndex = i;
                    w = imgWidth;
                    h = imgHeight;
                }
                else {
                    if (nW > winWidth) {
                        w = winWidth;
                        nH = h = Math.ceil(w / ratio);
                        if (h > winHeight) {
                            nH = h = winHeight;
                            w = Math.ceil(h * ratio);
                        }
                    }
                    if (nH > winHeight) {
                        h = winHeight;
                        w = Math.ceil(h * ratio);
                        if (w > winWidth) {
                            w = winWidth;
                            h = Math.ceil(w / ratio);
                        }
                    }
                }

                h=Math.ceil(h);
                if(ratio!==1){
                    h=o.popup.title.length>0?(h-43):h;
                }
                $(this).addClass(o.activeClass);
                imgs.push({
                    url: url,
                    imgHeight: h,
                    imgWidth: w
                });
            });

            var cc;
            var _options=$.extend({},o.popup,{
                area: [winWidth + 'px', winHeight + 'px'],
                success: function (layero, index) {
                    // var body = layer.getChildFrame('body', index);
                    //
                    // var iframeWin = window[layero.find('iframe')[0]['name']];

                    var content=layero.find('.layui-layer-content').eq(0);

                    var cheight=layero.outerHeight()-layero.find('.layui-layer-title').outerHeight()-layero.find('.layui-layer-btn').outerHeight();

                    content.css({padding:'0',height:cheight+'px'});

                    cc=new Class({
                        elem: layero.find('.gallery'),
                        imgs: imgs,
                        activeIndex: activeIndex
                    });
                },
                resizing: function(layero){
                    cc.toggleImage();
                },
                end: function(index, layero){
                    Images.each(function (i, elem) {
                        $(this).removeClass(o.activeClass);
                    });
                    cc=null;
                }
            });
            $.dialog(_options);
            // layer.open();

        },
        initStyle:function () {
            if($('#gallery_css').length>0) return;
            var style=document.createElement('style');
            style.id='gallery_css';
            style.innerHTML=
                '.gallery {' +
                '    background-color: #e2e2e2;' +
                '    position: relative;width:100%;height:100%;overflow:hidden;' +
                '}' +
                '.tool {' +
                '    position: absolute;' +
                '    bottom: 0;' +
                '    width: 100%;' +
                '    text-align: center;' +
                '    z-index: 1000;' +
                '}' +
                '.toolct {' +
                '    display: inline-block;' +
                '    height: 35px;' +
                '    line-height: 35px;' +
                '    background-color: rgba(0,0,0,0.5);' +
                '    padding: 0 15px;' +
                '    -webkit-border-radius: 10px 10px 0 0;' +
                '    -moz-border-radius: 10px 10px 0 0;' +
                '    border-radius: 10px 10px 0 0;' +
                '    cursor: default;' +
                '}' +
                '.toolct > span + span {' +
                '    margin-left: 10px;' +
                '}' +
                '.toolct .fa {' +
                '    line-height: 35px;' +
                '    font-size: 20px;' +
                '    color: #c3c3c3;' +
                '}' +
                '.toolct .fa:hover {' +
                '    color: #fff;' +
                '    cursor: pointer;' +
                '}' +
                '.gallery .image {' +
                '    position: absolute;' +
                '    margin: 0;' +
                '    padding: 0;' +
                '    z-index: 999;' +
                '    display: none;' +
                '}' +
                '.gallery .image.active {' +
                '    display: block;' +
                '}' +
                '.gallery .percentTip {' +
                '    position: absolute;' +
                '    top: 0;' +
                '    bottom: 0;' +
                '    right: 0;' +
                '    left: 0;' +
                '    margin: auto;' +
                '    width: 100px;' +
                '    height: 30px;' +
                '    z-index: 9999;' +
                '    text-align: center;' +
                '    line-height: 30px;' +
                '    font-size: 16px;' +
                '    border-radius: 8px;' +
                '    color: #ffffff;' +
                '    filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr=\'#4F504E\',endColorStr=\'#151313\',gradientType=1);' +
                '    background: linear-gradient(315deg, #4F504E, #151313);' +
                '    background: -moz-linear-gradient(315deg, #4F504E, #151313);' +
                '    background: -o-linear-gradient(left,#4F504E, #151313);' +
                '    background: -webkit-gradient(linear,100% 0%, 100% 0%, from(#4F504E), to(#151313));' +
                '}' +
                '/* 效果 */' +
                '.rotate0{' +
                '    transform: rotate(0deg);' +
                '    -webkit-transform: rotate(0deg);' +
                '}' +
                '.rotate90{' +
                '    transform: rotate(90deg);' +
                '    -webkit-transform: rotate(90deg);' +
                '}' +
                '.rotate180{' +
                '    transform: rotate(180deg);' +
                '    -webkit-transform: rotate(180deg);' +
                '}' +
                '.rotate270{' +
                '    transform: rotate(270deg);' +
                '    -webkit-transform: rotate(270deg);' +
                '}'

            $('head').append(style);
        }
    }


    var  $image,imageWidth,imageHeight,imgRatio,dragX,dragY,cW,cH,isVertical,thumbX,thumbY;

    var Class=function (options) {
        var defaults = {
            //图片缩放倍率
            ratio: 1.2,
            popup:'',
            //HTML模版
            template: {
                //操作工具
                OPERTATION: '<div class="tool">' +
                '<div class="toolct">' +
                '<span class="oper_prev" title="上一张">' +
                '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="oper_next" title="下一张">' +
                '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="oper_smaller" title="缩小图片">' +
                '<i class="fa fa-search-minus" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="oper_bigger" title="放大图片">' +
                '<i class="fa fa-search-plus" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="oper_rotate-left" title="向左旋转">' +
                '<i class="fa fa-undo" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="oper_rotate-right" title="向右旋转">' +
                '<i class="fa fa-repeat" aria-hidden="true"></i>' +
                '</span>' +
                '</div>' +
                '</div>',
                //大图
                IMAGE: '<img class="image" ondragstart="return false;"/>'
            }
        };
        this.config=$.extend({},defaults,options);
        this.init();
        return this;
    };

    Class.prototype={
        init:function () {
            var o=this.config,
                $gallery=o.elem;
            $(o.imgs).each(function(i, img){
                $(o.template.IMAGE)
                    .appendTo($gallery)
                    .attr("src", img.url)
                    .attr("index", i)
                    .css({
                        width : img.imgWidth,
                        height : img.imgHeight,
                        left : (cW - img.imgWidth)/2,
                        top: (cH - img.imgHeight)/2
                    })
            });
            $image = $(".image[index='"+o.activeIndex+"']", $gallery).addClass("active");
            $gallery.append(o.template.OPERTATION).append(o.template.THUMBNAILS);
            this.toggleImage();
            this.event();
        },
        toggleImage:function(){
            var o=this.config,
                $gallery=o.elem;

            imageWidth = o.imgs[o.activeIndex].imgWidth;
            imageHeight = o.imgs[o.activeIndex].imgHeight;
            imgRatio = imageWidth/ imageHeight;
            cW = $gallery.width();
            cH = $gallery.height();

            $(".image", $gallery).removeClass("active");
            $image = $(".image[index='"+o.activeIndex+"']", $gallery).addClass("active")
                .css({
                    width : imageWidth,
                    height : imageHeight
                }).
                removeClass("rotate0 rotate90 rotate180 rotate270");
            isVertical = false;
            this.setImagePosition();
        },
        setImagePosition:function(){
            var o=this.config,
                $gallery=o.elem;

            var w = $image.width(),
                h = $image.height(),
                cW = $gallery.width();
            cH = $gallery.height();

            var left = (cW - w)/2,
                top = (cH - h)/2;

            $image.css("left", left +"px").css("top", top+"px");
        },
        event:function () {
            var _this=this,
                o=_this.config,
                $gallery=o.elem,

                $tool = $gallery.find(".tool"),
                $bigger = $tool.find(".oper_bigger"),
                $smaller =  $tool.find(".oper_smaller"),
                $rotateLeft = $tool.find(".oper_rotate-left"),
                $downloadRight = $tool.find(".oper_rotate-right"),
                $prev = $tool.find(".oper_prev"),
                $next = $tool.find(".oper_next");

            //上一张
            $prev.on('click',function(){
                if (o.imgs.length === 1) return false;
                if(o.activeIndex > 0) o.activeIndex--;

                _this.toggleImage();
            });
            //下一张
            $next.on('click',function(){
                if (o.imgs.length === 1) return false;
                if(o.activeIndex < o.imgs.length -1) o.activeIndex++;

                _this.toggleImage();
            });
            //键盘左右键
            document.onkeydown = function(e){
                e = e || window.event;
                if (e.keyCode) {
                    if(e.keyCode === 37 ){ //left
                        if(o.activeIndex > 0) o.activeIndex--;

                        _this.toggleImage();
                    }
                    if(e.keyCode === 39 ){ //right
                        if(o.activeIndex < o.imgs.length -1) o.activeIndex++;

                        _this.toggleImage();
                    }
                }
            };
            //放大图片
            $bigger.on("click", function () {
                _this.biggerImage.call(_this);
            });
            //缩小图片
            $smaller.on("click", function () {
                _this.smallerImage.call(_this);
            });
            //旋转
            $downloadRight.on("click", function(){

                var rotateClass = $image.attr("class").match(/(rotate)(\d*)/);

                if(rotateClass){
                    var nextDeg = (rotateClass[2] * 1 + 90) % 360;
                    $image.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
                    _this.resizeImage(nextDeg);
                    isVertical = nextDeg === 90 || nextDeg === 270;
                } else{
                    $image.addClass("rotate90");
                    _this.resizeImage("90");
                    isVertical = true;
                }
            });
            //旋转
            $rotateLeft.on("click", function(){
                var rotateClass = $image.attr("class").match(/(rotate)(\d*)/);
                if(rotateClass){
                    var nextDeg = (rotateClass[2] * 1 - 90) % 360;
                    if (nextDeg < 0) nextDeg = 270
                    $image.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
                    _this.resizeImage(nextDeg);
                    isVertical = nextDeg === 90 || nextDeg === 270;
                } else{
                    $image.addClass("rotate270");
                    _this.resizeImage("270");
                    isVertical = true;
                }
            });
            if(document.attachEvent){
                $gallery[0].attachEvent("on"+MOUSEWHEEL_EVENT, function(e){
                    _this.mouseWheelScroll(e);
                });
            } else if(document.addEventListener){
                $gallery[0].addEventListener(MOUSEWHEEL_EVENT, function(e){
                    _this.mouseWheelScroll(e);
                }, false);
            }

            $gallery.on('mousedown', '.image.active', function(e) {
                thumbX = e.pageX || e.clientX;
                thumbY = e.pageY || e.clientY;
                dragX = $image.css("left");
                dragY = $image.css("top");

                e.stopPropagation();
            }).on("mousemove",function(e){
                if(thumbX > 0){
                    var nextDragX = e.pageX || e.clientX;
                    var nextDragY = e.pageY || e.clientY;
                    var left = parseFloat(dragX) +  (nextDragX - thumbX);
                    var top = parseFloat(dragY) + (nextDragY - thumbY);

                    var width=$image.width(),
                        height=$image.height(),
                        maxWidth=$gallery.width(),
                        maxHeight=$gallery.height();

                    // if($image.hasClass('rotate90')||$image.hasClass('rotate270')){
                    //     width=$image.height();
                    //     height=$image.width();
                    // }

                    var  minTop=maxHeight-height,
                        minLeft=maxWidth-width;

                    minLeft=minLeft<0?0:minLeft;
                    minTop=minTop<0?0:minTop;

                    left=left>minLeft ? minLeft:(maxWidth-left-minLeft)>width? (maxWidth-width-minLeft):left;
                    top=top>minTop? minTop:(maxHeight-top-minTop)>height? (maxHeight-height-minTop):top;

                    $image.css({
                        left : left,
                        top : top
                    });
                }
            }).on("mouseup",function(e){
                thumbX = -1;
            });
        },
        biggerImage:function () {
            var o=this.config,
                $gallery=o.elem;

            var w = $image.width(),
                h = $image.height(),
                nextW = w * o.ratio,
                nextH = h * o.ratio;
            if(nextW - w < 1) nextW = Math.ceil(nextW);
            var percent =  (nextW / imageWidth * 100).toFixed(0) ;
            if(percent > 90 && percent < 110){
                percent = 100;
                nextW = imageWidth;
                nextH = imageHeight;
            } else if (percent > 1600) {
                percent = 1600;
                nextW = imageWidth * 16;
                nextH = imageHeight * 16;
            }
            $image.width(nextW).height(nextH);
            this.setImagePosition();
            this.showPercentTip(percent);
        },
        smallerImage:function () {
            var o=this.config,
                $gallery=o.elem;

            var maxWidth=$gallery.width(),
                maxHeight=$gallery.height();

            var w = $image.width(),
                h = $image.height(),
                nextW,
                nextH;

            if(!($image.hasClass('rotate90')||$image.hasClass('rotate270'))&& (maxWidth===w || h===maxHeight)) return false;

            var percent =  (w / o.ratio / imageWidth * 100).toFixed(0) ;
            if(percent < 5) {
                percent = 5;
                nextW = imageWidth / 20;
                nextH = imageHeight / 20;
            }
            else if(percent > 90 && percent < 110){
                percent = 100;
                nextW = imageWidth;
                nextH = imageHeight;
            } else{
                nextW = w / o.ratio;
                nextH = h / o.ratio;
            }

            $image.width(nextW).height(nextH);
            this.setImagePosition();
            this.showPercentTip(percent);
        },
        showPercentTip:function (percent) {
            var o=this.config,
                $gallery=o.elem;

            $gallery.find(".percentTip").remove();
            $("<div class='percentTip'><span>"+percent+"%</span></div>").appendTo($gallery).fadeOut(1500);
        },
        resizeImage:function(rotateDeg){
            var o=this.config,
                $gallery=o.elem;

            var mH = $gallery.height(),
                mW = $gallery.width();
            if(rotateDeg ==="90" || rotateDeg === "270"){
                mW = [mH, mH = mW][0];
            }

            var width, height;
            width = Math.min(imageWidth, mW);
            height = Math.min(imageHeight, mH);

            if(width / height > imgRatio){
                width = height * imgRatio;
            } else{
                height = width / imgRatio;
            }

            $image.css({
                width:width,
                height:height
            });
            this.setImagePosition();
        },
        mouseWheelScroll:function (e) {
            var _delta = parseInt(e.wheelDelta || -e.detail);
            if (_delta > 0) {
                this.biggerImage();  //向上滚动
            } else {
                this.smallerImage(); //向下滚动
            }
        }
    }

    exports('gallery',function (options) {
        return new gallery(options);
    })
})
