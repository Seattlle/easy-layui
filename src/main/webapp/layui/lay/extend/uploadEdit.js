/*
* 图片裁剪功能
*
* */
layui.define(['layer'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = layui.layer;

    var img = new Image(), theCanvas, ctx, rCanvas, rctx,irecW,irecH;
    var curX, curY, startX=0, startY=0, flag = false,minX=0,minY=0,maxX=0,maxY=0,sourceX,sourceY;
    //图片绘制在canvas上的位置和大小
    var imgAttr={
        x:0,
        y:0,
        width:0,
        height:0
    }
    var cwin;
    var transform=getTransform();

    var up = function (params) {
        var _this=this;
        _this.config = {
            elem: '',
            recW: 100,
            recH: 100,
            ratio: 1,
            beginCut: false,
            canvasW: 500,
            canvasH: 370,
            rch: 150,
            rcw: 150,
            accept: 'images',
            resize:true,
            save:function (params) {},
            cancel:function (params) {}
        };
        _this.config = $.extend(_this.config, params);

        if(typeof params.ratio=="undefined"){
            _this.config.ratio= _this.config.recW/ _this.config.recH;
        }else{
            if(_this.config.resize)
                _this.config.recH=_this.config.recW/_this.config.ratio;
        }
        //保存初始化选框大小
        irecW=_this.config.recW;
        irecH=_this.config.recH;

        _this.initStyle();
    }
    up.prototype.init = function () {
        var _this = this;

        var inputDiv=$('<input type="file" class="uploadEdit"">');
        $(_this.config.elem).html(inputDiv);

        $(_this.config.elem).on('change','.uploadEdit', function (e) {
            var files = this.files || e.target.files;
            if (files.length < 1) return false;
            if(!/image\/\w*/g.test(files[0].type)) {layer.msg('选择的图片中包含不支持的格式');this.value='';return ;}
            _this.render( files[0]);
        });
    }
    //根据file文件显示编辑窗
    up.prototype.render=function(imgData){
        var _this = this,
            c = _this.config;

        c.recW=irecW;
        c.recH=irecH;
        imgAttr={
            x:0,
            y:0,
            width:0,
            height:0
        }
        if (typeof FileReader !== 'undefined') {
            layer.open({
                title: '编辑图片',
                area: ['710px', '465px'],
                btn: ['保存', '取消'],
                content: ['<div id="editImage">',
                    '<div class="showImage">',
                    '<div class="canWrap" id="canWrap">',
                    '<div class="c-mask masA"></div>',
                    '<div class="c-mask masB"></div>',
                    '<div class="c-mask masC"></div>',
                    '<div class="c-mask masD"></div>',
                    '<div class="c-win" id="cwin">',
                    function () {
                        if(c.resize) return '<div class="angle angle3"></div>'
                    }(),
                    '</div>',
                    '</div>',
                    '<canvas id="showCanvas" width="' + c.canvasW + '" height="' + c.canvasH + '"></canvas>',
                    '</div>',
                    '<div class="showResult">',
                    '<p><span>预览</span></p>',
                    '<div class="r-wrap">',
                    '<canvas id="resultCanvas" width="' + c.rcw + '" height="' + c.rch + '"></canvas>',
                    '</div></div></div>'].join(''),
                success: function (layero, index) {
                    $('#editImageDialogStyle').remove();
                    layero.find('.layui-layer-content').css('padding',0);

                    theCanvas = document.getElementById("showCanvas"), ctx = theCanvas.getContext("2d");
                    rCanvas = document.getElementById("resultCanvas"), rctx = rCanvas.getContext("2d");

                    //获取图片数据  用于展示
                    var reader = new FileReader();
                    reader.readAsDataURL(imgData);

                    reader.onload = function (ev) {
                        img.src = ev.target.result;
                    }

                    img.onload = function (ev) {
                        _this.drawCanvas(img);
                        _this.drawRec((c.canvasW - c.recW) / 2, (c.canvasH - c.recH) / 2);
                        _this.listen();
                    }
                },
                btn1: function (index, layero) {
                    var base64 = _this.compress(img);
                    c.save(base64);
                    layer.close(index)
                },
                btn2: function (index, layero) {
                    c.cancel()
                },
                end: function () {
                    $(_this.config.elem).find('.uploadEdit').val('');
                }
            });
        }else{
            throw Error("浏览器版本太低，请升级！");
        }
    }
    //使用canvas对图片进行压缩
    up.prototype.compress=function(img){
        var c=this.config;

        var visualCan = document.createElement('canvas'),
            vctx = visualCan.getContext('2d');
        var tCanvas = document.createElement('canvas'),
            tctx = tCanvas.getContext('2d');

        var width = img.width;
        var height = img.height;
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        var ratio;
        if ((ratio = width * height / 4000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }
        visualCan.width = width;
        visualCan.height = height;
        // 铺底色
        vctx.fillStyle = "#fff";
        vctx.fillRect(0, 0,width,height);
        vctx.drawImage(img, 0, 0, width, height);

        // 计算裁剪区域
        var cx = (curX - imgAttr.x) / imgAttr.width * width,
            cy = (curY - imgAttr.y) / imgAttr.height * height,
            rh =c.recH / imgAttr.height * height,
            rw =c.recW / imgAttr.width * width;

        var cutData = vctx.getImageData(cx, cy, rw, rh);

        tCanvas.width = rw;
        tCanvas.height = rh;

        tctx.clearRect(0, 0, rw, rh);
        tctx.putImageData(cutData, 0, 0);

        if(!c.resize){
            rh =c.recH;
            rw =c.recW;
        }

        visualCan.width = rw;
        visualCan.height = rh;

        // 铺底色
        vctx.clearRect(0, 0, rw, rh);
        vctx.drawImage(tCanvas, 0, 0,rw, rh);

        //进行最小压缩
        var ndata = visualCan.toDataURL('image/jpeg',0.92);
        tCanvas.width = tCanvas.height = visualCan.width = visualCan.height = 0;
        return ndata;
    }
    //绘制展示大图
    up.prototype.drawCanvas=function(img) {
        var c=this.config;
        var imgRadio=img.width/img.height;
        if (imgRadio>1) {
            imgAttr.height = c.canvasW / imgRadio;
            if(imgAttr.height>c.canvasH){
                imgAttr.height=c.canvasH;
                imgAttr.width=imgRadio*imgAttr.height;
                imgAttr.x=(c.canvasW - imgAttr.width) / 2;
            }else{
                imgAttr.y = (c.canvasH - imgAttr.height) / 2;
                imgAttr.width=c.canvasW;
            }
        }else if(imgRadio<1){
            imgAttr.height = c.canvasH;
            imgAttr.width=imgRadio*c.canvasH;
            imgAttr.x=(c.canvasW - imgAttr.width) / 2;
        } else if(imgRadio==1){
            var w=c.canvasW>c.canvasH?c.canvasH:c.canvasW;
            imgAttr.width=imgAttr.height = w;

            imgAttr.x=(c.canvasW - imgAttr.width) / 2;
            imgAttr.y = (c.canvasH - imgAttr.height) / 2;
        } else {
            imgAttr.height = c.canvasH;
            imgAttr.width=c.canvasW;
        }
        curX = 0, curY = 0;

        //清除画布
        ctx.clearRect(0, 0, c.canvasW, c.canvasH);
        ctx.drawImage(img, imgAttr.x, imgAttr.y, imgAttr.width, imgAttr.height);
    }
    //监听事件
    up.prototype.listen = function () {
        var _this = this,
            c = _this.config;

        var parentDiv=document.getElementById('canWrap');
        maxX=Math.round((getStyle(parentDiv,'width'))-c.recW);
        maxY=Math.round((getStyle(parentDiv,'height'))-c.recH);

        //当鼠标被按下
        cwin.addEventListener("mousedown", function (e) {
            flag = true;
            startX = e.clientX-c.recW;
            startY = e.clientY-c.recH;

            var pos=getPosition(cwin);

            sourceX=pos.x;
            sourceY=pos.y;

            document.onselectstart = function () {
                return false;
            }
        });
        //当鼠标在移动
        parentDiv.addEventListener("mousemove", function (e) {
            if (flag) {
                cwinMove(e);
                return;
            }
            if(angle){
                angleMove(e);
                return;
            }
        });
        //当鼠标抬起
        document.addEventListener("mouseup", function (e) {
            flag = false;
            angle=false;
        });


        var sx=0,sy=0,angle=false;
        $('.angle3').on('mousedown',function (e) {
            e.stopPropagation();
            sx = e.clientX-c.recW,sy = e.clientY-c.recH;
            angle=true;
        });
        //选框移动
        var cwinMove=function (e) {
            var currentX=e.clientX-c.recW;
            var currentY=e.clientY-c.recH;

            var distanceX=currentX-startX;
            var distanceY=currentY-startY;

            var setX=Math.round(sourceX+distanceX);
            var setY=Math.round(sourceY+distanceY);

            setX=setX<minX?minX:setX>maxX?maxX:setX;
            setY=setY<minY?minY:setY>maxY?maxY:setY;

            _this.drawRec(setX, setY);
        }
        //调整选框大小
        var angleMove=function (e) {
            e.stopPropagation();
            var cx=e.clientX-c.recW,cy=e.clientY-c.recH;

            var distanceX=cx-sx;
            var distanceY=cy-sy;

            var _distanceX=c.recW+distanceX;
            if(_distanceX<10) return ;

            c.recW=_distanceX>imgAttr.width?imgAttr.width:_distanceX;
            c.recH=c.recW/c.ratio;

            if(c.recH>imgAttr.height){
                c.recH=imgAttr.height;
                c.recW=c.recH*c.ratio;
            }
            _this.drawRec(curX,curY);
        }
    }
    //计算绘制位置
    up.prototype.drawRec = function (x, y) {
        var _this = this,
            c = _this.config;

        curX=x;
        curY=y;

        if(imgAttr.y>curY){
            curY=imgAttr.y;
        }
        if(imgAttr.y+imgAttr.height<curY+c.recH){
            curY=imgAttr.y+imgAttr.height-c.recH;
        }

        if(curX<imgAttr.x){
            curX=imgAttr.x;
        }
        if(imgAttr.x+imgAttr.width<curX+c.recW){
            curX=imgAttr.x+imgAttr.width-c.recW;
        }

        curX= Math.round(curX);
        curY= Math.round(curY);

        var _showLeft = c.recW + curX, _showTop = c.recH + curY;

        if (_showLeft > 0 && _showTop > 0) {
            _this.drawMask(_showLeft,_showTop);
            _this.drawRight();
        }
    }
    //绘制预览画布
    up.prototype.drawRight = function () {
        var _this = this,
            c = _this.config;

        var cutData = ctx.getImageData(curX, curY, c.recW, c.recH);

        var visualCan = document.createElement('canvas'),
            vctx = visualCan.getContext('2d');
        visualCan.width = c.recW;
        visualCan.height = c.recH;
        vctx.clearRect(0, 0, c.recW, c.recH);
        vctx.putImageData(cutData, 0, 0);

        var starx=0,stary=0,dw=c.rcw,dh=c.rch;
        if(c.ratio>1){
            dh=dw/c.ratio;
            stary=(c.rch-dh)/2;
        }else if(c.ratio<1){
            dw=c.ratio*dh;
            starx=(c.rcw-dw)/2;
        }

        // 铺底色
        rctx.fillStyle = "#fff";
        rctx.fillRect(0, 0, c.rcw, c.rch);
        rctx.drawImage(visualCan, starx, stary,dw, dh);

        visualCan = vctx = null;
    }
    //绘制蒙版及选中区域
    up.prototype.drawMask=function(){
        var _this = this,
            c = _this.config;
        cwin=document.getElementById('cwin');

        var mask=$('#canWrap');

        var h=Math.round(c.recH),w=Math.round(c.recW);
        mask.find('.masA').css({'height':curY+'px'});
        mask.find('.masB').css({'top':curY+'px','width':curX+'px','height':h+'px'});
        mask.find('.masC').css({'top':curY+'px','width':c.canvasW-curX-w+'px','height':h+'px'});
        mask.find('.masD').css({'height':c.canvasH-curY-h+'px'});

        cwin.style.width=w+'px';
        cwin.style.height=h+'px';
        if(transform){
            cwin.style[transform]='translate('+curX+'px,'+curY+'px)';
        }else{
            cwin.style.left=curX+'px';
            cwin.style.top=curY+'px';
        }
    }
    //弹窗样式
    up.prototype.initStyle=function(){
        $("<style>")
            .attr('id',"editImageDialogStyle")
            .html('.layui-layer-dialog .layui-layer-content{padding:0;}')
            .appendTo("head");
        if($("#editImageStyle").length>0) return ;
        $("<style>")
            .attr('id',"editImageStyle")
            .html('#editImage{\n' +
                '    background:#e5e5e5;-webkit-display:flex;display:flex;\n' +
                '}\n' +
                '#editImage .showImage{\n' +
                '    width:499px;display:inline-block;text-align:center;border-right:1px solid #666;position:relative;;\n' +
                '}\n' +
                '#editImage .showImage canvas{display:block;}\n' +
                '#editImage .showResult{width:190px;padding:10px;}\n' +
                '#editImage .r-wrap{text-align:center;margin-top:15px;}\n' +
                '#editImage .canWrap{\n' +
                '    position: absolute;\n' +
                '    top:0;\n' +
                '    left:0;\n' +
                '    width:100%;\n' +
                '    height:100%;\n' +
                '}\n' +
                '#editImage .c-mask{\n' +
                '    position: absolute;\n' +
                '    background:rgba(0,0,0,.4);\n' +
                '    display: inline-block;\n' +
                '}\n' +
                '#editImage .c-mask.masA{\n' +
                '    top:0;left:0;right:0;\n' +
                '}\n' +
                '#editImage .c-mask.masB{\n' +
                '    left:0;\n' +
                '}\n' +
                '#editImage .c-mask.masC{\n' +
                '    right:0;\n' +
                '}\n' +
                '#editImage .c-mask.masD{\n' +
                '    bottom: 0;left:0;right:0;height:100%;\n' +
                '}\n' +
                '#editImage .angle{\n' +
                '    width:5px;\n' +
                '    height:5px;\n' +
                '    display: inline-block;\n' +
                '    border:1px solid #fff;\n' +
                '    position: absolute;\n' +
                '}\n' +
                '#editImage .angle.angle3{\n' +
                '    bottom:-3px;\n' +
                '    right:-3px;\n' +
                '    cursor: se-resize;\n' +
                '}\n' +
                '#resultCanvas{\n' +
                '    display: block;\n' +
                '    margin: 0 auto;\n' +
                '    border: 1px solid #999;\n' +
                '}')
            .appendTo("head");
    }

    exports('uploadEdit', function (params) {
        return new up(params);
    });
});

//获取页面样式中的transform
function getTransform() {
    var transform="",
        style=document.documentElement.style,
        transformArr=['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
        i=0,
        length=transformArr.length;
    for(;i<length;i++){
        if(transformArr[i] in style){
            transform=transformArr[i];
            return transform;
        }
    }
    return transform;
}
function getStyle(elem,property) {
    var value=document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(elem,false)[property]:elem.currentStyle[property];
    return value;
}
function getPosition(elem) {
    var pos={x:0,y:0};

    transform=getTransform();
    if(transform){
        var transformValue=getStyle(elem,transform);
        if(transformValue=='none'){
            elem.style[transform]='translate(0,0)';
        }else{
            // var temp=transformValue.match(/-?\d+/g);
            var temp=transformValue.substring(7,transformValue.length-1).split(',');
            pos={
                x:parseInt(temp[4].trim()),
                y:parseInt(temp[5].trim())
            }
        }
    }else{
        if(getStyle(elem,'position')=='static'){
            elem.style.position='relative';
        }else{
            pos={
                x:parseInt(getStyle(elem,'left')?getStyle(elem,'left'):0),
                y:parseInt(getStyle(elem,'top')?getStyle(elem,'top'):0),
            }
        }
    }
    return pos;
}