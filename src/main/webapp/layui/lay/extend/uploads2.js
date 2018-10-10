layui.define(['jquery','upload','dialog','gallery'], function (exports) {
    var  laytpl = layui.laytpl;

    let UP = '_up';
	var TMPL_UPLOADS =[
        '<div class="_up _empty" id="{{d.index}}">',
        '    {{# if (d.title) { }}',
        '        <p>{{d.title}}</p>',
        '    {{# } }}',
        '    <div class="_up-pic"></div>',
        '    <div class="_up-tool">',
        '        <div class="_up-tool-head"></div>',
        '        <div class="_up-tool-body">',
        '            <i class="fa fa-chevron-circle-left" aria-hidden="true" action="prev" title="前一张"></i>',
        '            <i class="fa fa-chevron-circle-right" aria-hidden="true" action="next" title="后一张"></i>',
        '            <i class="fa fa-trash-o" aria-hidden="true" action="del" title="删除当前图片"></i>',
        '            <i class="fa fa-plus-circle" aria-hidden="true" action="upload" title="上传图片"></i>',
        '        </div>',
        '        <div class="_up-tool-foot">',
        '            <i class="layui-icon">&#xe654;</i>',
        '            <input class="_upload-add" type="file" multiple="{{d.multiple}}" accept="{{d.accept}}">',
        '        </div>',
        '    </div>',
        '</div>'].join('');

    var _default = {
        name:'file',
        method: 'post',
        multiple:false,
        auto:true,
        number:6,
        type:1,
        accept:'image/jpeg,image/png',
        Files:{},
        images:[]
    }

    let methods = {
        init:function (options) {
            return this.each(function (i, item) {
                var $this = $(this), data = $this.attr('data-options');
                if(data){
                    try{
                        data = new Function('return '+ data)();
                        options = $.extend({},_default, options, data);
                    } catch(e){
                        throw Error('参数错误！');
                    }
                }
                options = $.extend({},_default, options,{index:+new Date()});

                if(!options.elem){
                    options.elem=$this;
                }
                if(!options.multiple){
                    options.number=1;
                }
                if(options.bindAction){
                    options.auto=false;
                }

                $this.data('options',options);

                methods.initDom.call(this);
              
            })
        },
        initDom:function () {
            let that = $(this),
                _this = this,
                options= that.data('options');

            let render = function() {
                var oDiv = laytpl(TMPL_UPLOADS).render(options),
                    hasRender = that.next('._up')

                if (hasRender[0]) hasRender.remove()
                that.append(oDiv)
            };

            render();

		    function getBase64Image(img) {
			    let canvas = document.createElement("canvas");
			    canvas.width = img.width;
			    canvas.height = img.height;

			    let ctx = canvas.getContext("2d");
			    ctx.drawImage(img, 0, 0, img.width, img.height);
			    let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
			    let dataURL = canvas.toDataURL("image/"+ext);
			    return dataURL;
			}

            if(options.images){
            	let oImg = options.images,
            	       Len = oImg.length;
                for(let i=0;i<Len;i++){
                   let image = new Image();
                   image.crossOrigin = '';
	               image.src = oImg[i].src;
	               let name = oImg[i].name,
	                   index = i==0?'active':'';
	               image.onload = function(){
					   let base64 = getBase64Image(image);
					   let oHtml = '<img src="' + base64 + '" data-key="'+ name +'" class="'+ index +'" ' +(options.preview?'preview':'')+ '/>';
					   $('._up-pic').append(oHtml);
					   options.Files[name] = base64;
				   }

                }
                $('._up').removeClass('_empty');
            }
         
            if(options.preview){
                that.addClass('preview_wrap');
                layui.gallery({
                    popup:{
                        title:'图片预览',
                        shade:0.6
                    }
                });
            };
            that.data('options',options);
            setTimeout(function(){
            	methods.setToolHead.call(_this);
            },200)
            
            methods.initEvent.call(this);
        },
        initEvent:function () {
            let _this=this,
                $this=$(this),
                c= $this.data('options'),
                elem = $('#' + c.index),
                upPic = elem.find('._up-pic'),
	            upTool = elem.find('._up-tool'),
	            toolHead = elem.find('._up-tool-head'),
	            toolBody = elem.find('._up-tool-body'),
	            uploadAdd = elem.find('._upload-add');

            $this.on('change','._upload-add',function (e) {
                var files = this.files || e.target.files;
                if (files.length < 1) return false;
               
                if(window.FileReader){
                    $.each(files, function(index, file){ 
                    	
                        if(c.Files[file.name]){
                            return ;
                        }
                        c.Files[file.name]=file;

                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(){
                        	let pic = '<img class="active" src="' + this.result + '" data-key="'+ file.name +'"' +(c.preview?'preview':'')+ '/>';
                            $('._up-pic').find('.active').removeClass('active');
                            $('._up-pic').append(pic);
                            c.Files[file.name] = this.result;
                        }
                      
                    });

                    $('._up').removeClass('_empty')
                    $this.data('options',c);
                    $(this).value=c.Files;
                    console.log($this.data('options'));
                    console.log($(this).value);
                }

                if(c.preview){
                    layui.gallery({
                        popup:{
                            title:'图片预览',
                            shade:0.6
                        }
                    });
                }
                
                if(c.auto){
                    methods.upload.call(_this);
                }
                
                methods.setToolHead.call(_this);
            });
           
            
	        // 监听操作点击
	        toolBody.on('click', '[action]', function(e) {
	            var action = $(this).attr('action');
	            switch(action) {
	                case 'prev': prev(); break;
	                case 'next': next(); break;
	                case 'del': del(); break;
	                case 'upload': upload(); break;
	            }
	        })

	        // 上一张
	        function prev() {
	            var index = upPic.children('.active').index(),
	                len = upPic.children().length;

	            if (len <= 1) return false;

	            if (index >0) {
	                upPic.children().eq(index - 1).addClass('active')
	                    .siblings('.active').removeClass('active');
	            } else {
	                upPic.children().eq(len - 1).addClass('active')
	                    .siblings('.active').removeClass('active');
	            }
	            methods.setToolHead.call(_this);
	        }

	        // 下一张
	        function next() {
	            var index = upPic.children('.active').index(),
	                len = upPic.children().length;

	            if (len <= 1) return false;

	            if (index < len - 1) {
	                upPic.children().eq(index + 1).addClass('active')
	                    .siblings('.active').removeClass('active');
	            } else {
	                upPic.children().eq(0).addClass('active')
	                    .siblings('.active').removeClass('active');
	            }
	            methods.setToolHead.call(_this);
	        }

	        // 删除当前图片
	        function del() {
	        	var index = upPic.children('.active').index(),
	                imgs = upPic.children(),
                    data =  $this.data('options');
	                currImg = imgs.eq(index);

	            var index=$.confirm('确定删除这张照片吗？',function () {
	            	let key = currImg.data('key');
	            	data.Files[key]=null;
                    $this.data('options',data);

                    if (imgs.length == 1) {
                        $('._up').addClass('_empty')
	                } else if (currImg.next()[0]) {
	                    currImg.next().addClass('active')
	                } else {
	                    currImg.prev().addClass('active')
	                }
                    currImg.remove();
                    methods.setToolHead.call(_this);
                    uploadAdd.value = data.Files;console.log(data.Files);
                    data.onDel && data.onDel(data);
                    $.close(index);
                });
	        }

		    // 上传图片
	        function upload() { 
	        	let c =  $this.data('options');
	        	let Len =  $('._up-pic').children().length;
	        	if(Len >= c.number){
                    this.value='';
                    $.msg('最多只能选择'+c.number+'张照片');
                    return false;
                }
	            uploadAdd.trigger('click');
	        }

            if(c.bindAction){
                $('body').on('click',c.bindAction,function () {
                    methods.upload.call(_this);
                });
            }
        },
        // 页码设置
        setToolHead: function() {
	        let c = $(this).data('options'),
	        elem = $('#' + c.index);
            setTimeout(function(){
               let upPic = elem.find('._up-pic'),
               total = elem.find('._up-pic').children().length,
               index = upPic.children('.active').index()+1,
               html = index + ' / ' + total;
               elem.find('._up-tool-head').html(html);
	        },500);
        },
        upload:function () {
            var $this=$(this),
                c= $this.data('options');
             console.log(c);
            var successful = 0, aborted = 0;

            $.each(c.Files, function(index, file){
                if(!file) return;

                var formData = new FormData();
                formData.append(c.name, file);

                //追加额外的参数
                $.each(c.data, function(key, value){
                    formData.append(key, value);
                });

                //提交文件
                $.ajax({
                    url: c.url
                    ,type: c.method
                    ,data: formData
                    ,contentType: false
                    ,processData: false
                    ,dataType: 'json'
                    ,success: function(res){
                        successful++;
                        c.done && c.done(index, res);
                    }
                    ,error: function(){
                        aborted++;
                        $.msg('请求上传接口出现异常');
                        c.error && c.error(index);
                    }
                });
            });
        }
    }
   
	//在插件中使用对象
    $.fn.uploads  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.uploads');
            return this;
        }
        return method.apply(this, arguments);
    }
    exports('uploads2');
})