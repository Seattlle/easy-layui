layui.define(['jquery','upload'], function (exports) {
    window.$  =  layui.jquery;

    var upload=layui.upload;


    var methods={
        init:function (options) {
            return this.each(function (i, item) {
                var $this = $(this), data = $this.attr('data-options');
                if(data){
                    try{
                        data = new Function('return '+ data)();
                        options = $.extend({}, options, data);
                    } catch(e){
                        throw Error('参数错误！');
                    }
                }
                if(!options.elem){
                    options.elem=$this;
                }
                $this.data('upload',upload.render(options));
            })
        },
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
    }
    exports('uploads');
});