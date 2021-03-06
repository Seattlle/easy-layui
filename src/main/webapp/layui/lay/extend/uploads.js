layui.define(['jquery','upload','dialog','gallery'], function (exports) {
    window.$  =  layui.jquery;

    var upload=layui.upload;
    var WRAP='_upload-wrap',PIC='_upload-picture',INPUT='_upload-input',ADD='_upload--input-add';

    var _default={
        name:'file',
        method: 'post',
        multiple:false,
        auto:true,
        number:6,
        type:1,
        accept:'image/jpeg,image/png',
        images:[]
    };


    var methods={
        init:function (params) {
            return this.each(function (i, item) {
                var $this = $(this), data = $this.attr('data-options'),options={};
                if(data){
                    try{
                        data = new Function('return '+ data)();
                        options = $.extend({},_default, params, data);
                    } catch(e){
                        throw Error('参数错误！');
                    }
                }else{
                    options = $.extend({},_default, params);
                }

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

                if(options.type===1){
                    $this.data('upload',upload.render(options));
                }else if(options.type===2){
                    methods.initDom.call(this);
                }
            })
        },
        initDom:function () {
            var $this=$(this)
                ,c= $this.data('options');

            var _upload=$('<div class="'+WRAP+'">' +
                function () {
                    var img=[];
                    $.each(c.images,function (index,item) {
                        img.push('<div class="_upload" data-key="'+(item.name||'')+'"><div class="_upload-picture">' +
                            '    <div class="img">' +
                            '        <img src="'+item.src+'" '+(c.preview?'preview':'')+'>' +
                            '    </div>' +
                            '    <span class="tips">' +
                            '        <i class="layui-icon upload_del">&#xe640;</i>' +
                            '    </span>' +
                            '</div></div>');
                    });

                    return img.join('');
                }()+
                '<div class="_upload '+INPUT+(c.number>c.images.length?" ":" layui-hide")+'"><input class="'+ADD+'"  type="file" '+(c.multiple?'multiple':'')+' accept="'+c.accept+'"></div>'+
                '</div>');

            $this.append(_upload);
            if(c.preview){
                $this.addClass('preview_wrap');

                layui.gallery({
                    popup:{
                        title:'图片预览',
                        shade:0.6
                    }
                });
            }
            methods.initEvent.call(this);
        },
        initEvent:function () {
            var _this=this,
                $this=$(_this)
                ,c= $this.data('options')
                ,input_file=$this.find('.'+INPUT).eq(0)
                ,_className='layui_upload_parents'
                ,eventName='.uploads';

            $this.addClass(_className);
            $this.off(eventName);

            $this.on('change'+eventName,'.'+ADD,function (e) {
                var files = this.files || e.target.files || [];
                if (files.length < 1) return false;

                var that=$(this).parents('.'+_className).eq(0)
                    ,cc= that.data('options')
                    ,imgCount=that.find('._upload img').length;

                if(files.length>cc.number || (imgCount+files.length)>cc.number){
                    this.value='';
                    $.msg('最多只能选择'+cc.number+'张照片');
                    return false;
                }
                if(window.FileReader){
                    $.each(files, function(index, file){
                        if(!cc.Files){
                            cc.Files={};
                        }
                        if(cc.Files[file.name]){
                            return ;
                        }
                        cc.Files[file.name]=file;

                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(){
                            var pic='<div class="_upload" data-key="'+file.name+'"><div class="_upload-picture">' +
                                '    <div class="img">' +
                                '        <img src="'+this.result+'" '+(cc.preview?'preview':'')+'>' +
                                '    </div>' +
                                '    <span class="tips">' +
                                '        <i class="layui-icon upload_del">&#xe640;</i>' +
                                '    </span>' +
                                '</div></div>';
                            input_file.before(pic);
                        };
                        if((imgCount+index+1)===cc.number){
                            input_file.addClass('layui-hide');
                            return false;
                        }
                    });
                    that.data('options',cc);
                }
                if(cc.auto){
                    methods.upload.call(_this);
                }
                this.value='';
            });

            $this.on('click'+eventName,'.upload_del',function () {
                var that=$(this).parents('.'+_className).eq(0)
                    ,cc= that.data('options')
                    ,pic=$(this).parents('._upload')
                    ,name=pic.data('key');
                
                var index=$.confirm('确定删除这张照片吗？',function () {
                    pic.remove();

                    var imgCount=that.find('._upload img').length;

                    if(imgCount<c.number){
                        input_file.removeClass('layui-hide');
                    }

                    if(cc.Files && cc.Files[name]){
                        cc.Files[name]=null;
                    }
                    cc.onDel && c.onDel(pic);

                    $this.data('options',cc);

                    $.close(index);
                });
                
            });

            if(c.bindAction){
                $('body').off(eventName).on('click'+eventName,c.bindAction,function () {
                    methods.upload.call(_this);
                });
            }
        },
        upload:function () {
            var $this=$(this),
                c= $this.data('options');

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
                    ,successed: function(res){
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
    };

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
    };
    exports('uploads');
});