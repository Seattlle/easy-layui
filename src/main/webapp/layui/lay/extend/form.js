layui.define(['jquery','util','dialog','md5','doT'], function (exports) {
    window.$  =  layui.jquery;
    var util=layui.util,
        layer=layui.layer;

    var MOD_NAME = 'form', ELEM = '.layui-form',TIP='layui-select-tips', THIS = 'layui-this', SHOW = 'layui-show',DANGER='layui-form-danger', HIDE = 'layui-hide', DISABLED = 'layui-disabled', CLASS = 'layui-form-select';

    var dom = $(document), win = $(window),body=$('body');

    var verify={
        required: [
            /[\S]+/
            ,'必填项不能为空'
        ]
        ,phone: [
        /^1\d{10}$/
        ,'请输入正确的手机号'
    ]
        ,email: [
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        ,'邮箱格式不正确'
    ]
        ,url: [
        /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
        ,'链接格式不正确'
    ]
        ,number: function(value){
        if(!value || isNaN(value)) return '只能填写数字'
    }
        ,date: [
        /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
        ,'日期格式不正确'
    ]
        ,identity: [
        /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
        ,'请输入正确的身份证号'
    ]
    };

    var topIndex=0;

    var methods={
        render:function (type,_params) {
            var _this=this;
            if(_this.length===0 && _this.nodeName!=='SELECT'){
                throw new Error('对象不存在！');
                return false;
            }
            var nodeName=_this.length>0? _this[0].nodeName.toLowerCase():_this.nodeName.toLowerCase()
                ,items={
                    //下拉框
                    select:function (_params) {
                        var TIPS = '请选择', TITLE = 'layui-select-title'
                            ,NONE = 'layui-select-none', initValue = '', thatInput
                            ,events = function(reElem, disabled, isSearch){
                                var select = $(this)
                                    ,title = reElem.find('.' + TITLE)
                                    ,input =title.find('.layui-select-label');

                                if(disabled) return;

                                //展开下拉
                                var showDown = function(){
                                    var rem=$(this)
                                        ,list=rem.data('list')
                                        ,params=rem.data('params')
                                        ,data=rem.data('data');

                                        if(!list ||list.length===0){
                                            list=$(['<div class="layui-select-list layui-form-select"><dl class="'+ (select.find('optgroup')[0] ? ' layui-select-group' : '') +'">' +
                                            function () {
                                                var dd=[];

                                                if(!params.hideTips){
                                                    dd.push('<dd  class="layui-select-tips">'+ TIPS +'</dd>');
                                                }

                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].group){
                                                        dd.push('<dt>'+ data[i].text +'</dt>');
                                                    }else{
                                                        dd.push('<dd lay-value="'+ data[i].value +'" class="'+ (data[i].selected ?  THIS : '') + (data[i].disabled ? (' '+DISABLED) : '') +'" data-text="'+data[i].text+'">'+ data[i].text+(params.del?'<i  class="layui-icon delItem">&#x1006;</i>':'') +'</dd>');
                                                    }
                                                }
                                                return dd.join('');
                                            }() +
                                            '</dl>'
                                                ,(function() {
                                                    var templet = rem.data('extra');
                                                    if (templet) {
                                                        return '<div class="layui-select-extra">' + $.doT($(templet).html(),{}) + '</div>'
                                                    }
                                                    return '';
                                                })()+'</div>'].join(''));

                                            list.css({width:rem.outerWidth()+'px',left:rem.offset().left+'px',top:rem.offset().top+rem.outerHeight()+5+'px'});
                                            rem.data('list',list);
                                            list.data('parent',rem).data('elem',select);

                                            body.append(list);
                                        }else{
                                            list.css({left:rem.offset().left+'px',top:rem.offset().top+rem.outerHeight()+5+'px'});
                                            list.removeClass(HIDE).find('dd').removeClass(HIDE);
                                        }
                                        rem.addClass('open');
                                },
                                    hideDown = function(flag){
                                    var $this=$(this),
                                        list=$this.data('list') || $this,
                                        elem=list.data('elem'),
                                        multiple=typeof elem.attr('multiple')==="string",
                                        input=multiple?$this.find('textarea'):$this.find('input'),
                                        dl=list.find('dl'),
                                        select=dl.find('.'+THIS);

                                        selectOptions.call(elem,select,input);

                                        flag=flag ? flag:list.data('delItem');

                                        if(!flag){
                                            list.addClass(HIDE);
                                            $this.removeClass('open');
                                        }
                                },
                                    choseList=function(i){
                                        var $this=$(this),
                                            list=$this.data('list'),
                                            dl=list.find('dl'),
                                            dds=list.find('dd'),
                                            index=0,
                                            showDD=[],
                                            num=0;

                                        // 找到当前项
                                        dds.each(function (ii,v) {
                                            var $this=$(this);
                                            if(!$this.hasClass(HIDE) && !$this.hasClass(TIP)){
                                                showDD.push(v);
                                                if($this.hasClass(THIS)){{
                                                    index=num;
                                                }}
                                                num++;
                                            }
                                            $this.removeClass(THIS);
                                        });
                                        index+=i;
                                        index=index<0?(showDD.length-1):index >= showDD.length ? 0:index;

                                        var _this_dd=$(showDD[index]),
                                            dd_height=_this_dd.outerHeight(),
                                            scrollTop  =  dl.scrollTop(),
                                            offsetTop=_this_dd.offsetTop-4;

                                        if(offsetTop>(dl.height()+scrollTop)){
                                            dl.scrollTop(scrollTop+dd_height);
                                        }else if(offsetTop<scrollTop){
                                            dl.scrollTop(scrollTop-dd_height);
                                        }

                                        if(!_this_dd.hasClass(TIP)){
                                            _this_dd.addClass(THIS);
                                        }
                                    },
                                    selectOptions=function(select,input){
                                        var $this=$(this),
                                            multiple=typeof $this.attr('multiple')==="string",
                                            value=[],label=[];

                                        if(multiple){
                                            select.each(function (index,item) {
                                                var _this=$(this);
                                                value.push(_this.attr('lay-value'));
                                                label.push(_this.data('text'));
                                            });
                                            var labelText=label.join(',')||"";
                                            if(input.val()!==labelText){
                                                input.val(labelText);
                                                $this.find('option').each(function (i,v) {
                                                    var that=$(this);
                                                    if(value.indexOf(that.val())>-1){
                                                        that.attr("selected","selected");
                                                    }else{
                                                        that.removeAttr('selected');
                                                    }
                                                });
                                                $this.val(value).trigger('change');
                                            }
                                        }else{
                                            var text=select.data('text')||"";
                                            if(input.val()!==text){
                                                input.val(text);
                                                $this.val(select.attr('lay-value')).trigger('change');
                                            }
                                        }

                                    };

                                //点击箭头获取焦点
                                title.find('.layui-edge').on('click', function(){
                                    input.focus();
                                });

                                //点击标题区域
                                title.on('click', function(){
                                    if(typeof $(this).attr('readonly')==='string'){
                                        return false;
                                    }
                                    var rem=$(this).parent();
                                    if(rem.hasClass('open')){
                                        hideDown.call(rem);
                                    }else{
                                        showDown.call(rem);
                                    }
                                });

                                //检测值是否不属于select项
                                var notOption = function(value){
                                    var $this=$(this),
                                        list=$this.data('list'),
                                        dl=list.find('dl'),
                                        dds=dl.find('dd');

                                    var num = 0;
                                    $.each(dds, function(){
                                        var othis = $(this)
                                            ,text = othis.text()
                                            ,not = text.indexOf(value) === -1;
                                        if(othis.hasClass(TIP)){
                                            not=false;
                                            num++;
                                        }
                                        if(not) num++;
                                        othis[not ? 'addClass' : 'removeClass'](HIDE);
                                    });
                                    var none = num === dds.length;
                                    if(none){
                                        dl.find('.'+NONE)[0] || dl.append('<p class="'+ NONE +'">无匹配项</p>');
                                    }else{
                                        dl.find('.'+NONE).remove();
                                    }
                                };

                                if(isSearch){
                                    input.on('keyup', function (e) {
                                        var that=$(this),
                                            keyCode = e.keyCode,
                                            rem=that.parents('.'+CLASS);
                                        if(keyCode === 9 || keyCode === 13
                                            || keyCode === 37 || keyCode === 38
                                            || keyCode === 39 || keyCode === 40
                                        ){
                                            return false;
                                        }
                                        showDown.call(rem);
                                        notOption.call(rem,that.val());
                                    });
                                }

                                //选择
                                body.off('click.choseDD').on('click.choseDD','.layui-select-list dd',function (e) {
                                    var othis = $(this)
                                        ,list=othis.parents('.layui-select-list')
                                        ,elem=list.data('elem')
                                        ,multiple=typeof elem.attr('multiple')==="string"
                                        ,rem=list.data('parent');

                                    clearTimeout(rem.data('timmer'));

                                    if(othis.hasClass(DISABLED)) return ;

                                    if(othis.hasClass(TIP)){
                                        othis.siblings().removeClass(THIS);
                                        hideDown.call(rem);
                                    }else{
                                        if(multiple){
                                            if(othis.hasClass(THIS)){
                                                othis.removeClass(THIS);
                                            }else{
                                                othis.addClass(THIS);
                                            }
                                            hideDown.call(rem,true);
                                        }else{
                                            if(!othis.hasClass(THIS)){
                                                othis.addClass(THIS).siblings().removeClass(THIS);
                                            }
                                            hideDown.call(rem);
                                        }
                                    }
                                });
                                //删除
                                body.off('click.delItem').on('click.delItem','.layui-select-list dd .delItem',function (e) {
                                    e.stopPropagation();

                                    var othis = $(this)
                                        ,dd=othis.parent()
                                        ,list=othis.parents('.layui-select-list')
                                        ,rem=list.data('parent')
                                        ,params=rem.data('params');

                                    var obj={
                                        elem:list.data('elem')[0],
                                        list:list[0],
                                        text:dd.data('text'),
                                        value:dd.attr('lay-value')
                                    };
                                    params.del && params.del(obj);

                                    list.data('delItem',true);
                                    setTimeout(function () {
                                        list.data('delItem',false);
                                    },300);

                                    return false;
                                });

                                reElem.find('dl>dt').on('click', function(){
                                    return false;
                                });

                                //键盘事件
                                input.on('keyup', function(e){
                                    var rem=$(this).parents('.'+CLASS);
                                    var keyCode = e.keyCode;
                                    if(keyCode=== 40){
                                        choseList.call(rem,1);
                                    }else if(keyCode=== 38){
                                        choseList.call(rem,-1);
                                    }else if(keyCode=== 13){
                                        hideDown.call(rem);
                                    }
                                }).on('blur', function(e){
                                    var rem=$(this).parents('.'+CLASS);
                                    if(rem.data('list')){
                                        var timmer=setTimeout(function () {
                                            hideDown.call(rem);
                                        },200);

                                        rem.data('timmer',timmer);
                                    }
                                });

                                if(_params && _params.show){
                                    input.focus();
                                    showDown.call(reElem);
                                }

                                if(_params && _params.change){
                                    select.on('change',function () {
                                        _params.change.call(select);
                                    })

                                }
                            }
                            ,_select= nodeName==='select'? this.length>0?this:$(this): this.find('select');

                         return _select.each(function (index,item) {
                            var othis=$(this)
                                ,disabled = this.disabled
                                ,params=util.getOptions(othis.data('options'))||{}
                                // ,selected = $(item.options[item.selectedIndex]) //获取当前选中项
                                ,selected = othis.find('[selected]')
                                ,multiple=typeof othis.attr('multiple')==="string" || params.multiple
                                ,readonly=typeof othis.attr('readonly')==="string" || params.readonly
                                ,optionsFirst = item.options[0];

                            if(_params){
                                params=$.extend({},params,_params);
                            }

                            if(multiple){
                                othis.attr('multiple',true);
                            }

                            var value=params && params.value?params.value : othis.data('value')? othis.data('value'):othis.val();
                             othis.val(value);

                            if(typeof othis.attr('lay-ignore') === 'string') return othis.show();

                             othis.hide();

                            var isSearch = typeof othis.attr('lay-search') === 'string'
                                ,placeholder = optionsFirst ? (
                                optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS)
                            ) : TIPS;

                            var initDD=function(options,callback){
                                var _this=this;
                                var _value=params.valueField || 'value',
                                    _title=params.textField || 'name';
                                var arr = [],labelText=[],option=[];

                                if(!params.hideTips){
                                    option.push('<option value="">请选择</option>')
                                }


                                if(params.extra){
                                    _this.data('extra',params.extra)
                                }

                                if(params.data && params.data.length>0){
                                    for(var i=0;i<params.data.length;i++){
                                        var item=params.data[i];
                                        var _selected=value == item[_value];
                                        arr.push({text:item[_title],value:item[_value],selected:_selected,disabled:item.disabled});

                                        option.push('<option value="'+ item[_value] +'" '+ (_selected ?  "selected":"")+ (item.disabled ?  "disabled":"")  +'>'+ item[_title] +'</option>');
                                        if(_selected){
                                            labelText.push(item[_title]);
                                        }
                                    }
                                    var _text=labelText.length>0? multiple?labelText.join(','):labelText[0]:'';

                                    _this.data('data',arr).find('.layui-select-label').val(_text);

                                    option.length>0 && othis.html(option.join(''));
                                    callback && callback();
                                }else if(params.url){
                                    othis.data('loading',true);
                                    $.ajax({
                                        url:params.url,
                                        data:params.where,
                                        successed:function (res) {
                                            othis.data('loading',false);
                                            if(res[util.webConfig.resName]){
                                                var __data=res[util.webConfig.resName].rows || res[util.webConfig.resName];
                                                $.each(__data,function (index,item) {
                                                    var _selected=false;
                                                    if(typeof value!=null){
                                                        if(multiple){
                                                            _selected=value.indexOf(item[_value])>-1;
                                                        }else{
                                                            _selected=value == item[_value];
                                                        }
                                                        if(_selected){
                                                            labelText.push(item[_title]);
                                                        }
                                                    }
                                                    option.push('<option value="'+ item[_value] +'" '+ (_selected ?  "selected":"")+ (item.disabled ?  "disabled":"")  +'>'+ item[_title] +'</option>');
                                                    arr.push({text:item[_title],value:item[_value],selected:_selected,disabled:item.disabled});
                                                });
                                                var _text=labelText.length>0? multiple?labelText.join(','):labelText[0]:'';
                                                _this.data('data',arr).find('.layui-select-label').val(_text);
                                                option.length>0 && othis.html(option.join(''));
                                                othis.data('data',res[util.webConfig.resName]);
                                                callback && callback();
                                            }
                                        }
                                    })
                                }else{
                                    $.each(options, function(index, item){
                                        if(index === 0 && !item.value && item.tagName.toLowerCase() !== 'optgroup'){

                                        } else if(item.tagName.toLowerCase() === 'optgroup'){
                                            arr.push({text:item.label,group:true});
                                        } else {
                                            arr.push({text:item.innerHTML,value:item.value,selected:value === item.value,disabled:item.disabled});
                                            if(value === item.value){
                                                labelText.push(item.innerHTML);
                                            }
                                        }
                                    });

                                    var _text=labelText.length>0? multiple?labelText.join(','):labelText[0]:'';

                                    _this.data('data',arr).find('.layui-select-label').val(_text);

                                    callback && callback();
                                }
                            };

                            //替代元素
                            var reElem = $(['<div class="'+ (isSearch ? '' : 'layui-unselect ') + CLASS + (disabled ? ' layui-select-disabled' : '')+(params.show?' layui-form-selected':'') +'">'
                                ,'<div class="'+ TITLE +'" '+(readonly?'readonly':'')+'>' +
                                    function () {
                                        if(multiple){
                                            return '<textarea  placeholder="请输入内容" readonly class="layui-select-label layui-textarea select-textarea' + (disabled ? (' ' + DISABLED) : '') +'" >'+ (value && selected.html() ? selected.html() : '') +'</textarea>';
                                        }else{
                                            return '<input type="text" placeholder="'+ placeholder +'" '+(readonly?'readonly':'')+' value="'+ (value && selected.html() ? selected.html() : '') +'" '+ (isSearch ? '' : 'readonly') +' class="layui-select-label  layui-input'+ (isSearch ? '' : ' layui-unselect') + (disabled ? (' ' + DISABLED) : '') +'">';
                                        }
                                    }()
                                ,'<i class="layui-edge"></i></div>'
                                ,'</div>'].join(''));

                            var old_rem=othis.data('virtualSelect');
                            if(old_rem){
                                var _list=old_rem.data('list');
                                if(_list) _list.remove();
                                old_rem.remove();
                            }
                            othis.data('virtualSelect',reElem);
                            othis.after(reElem);
                            reElem.data('params',params);
                            initDD.call(reElem,othis.find('*'),function () {
                                params.done && params.done();
                                events.call(othis, reElem, disabled, isSearch);
                             });
                        });
                    }
                    //级联选择
                    ,cascader:function (options) {
                        var CLASS='layui-cascader',renderClass='layui-cascader-render',title='layui-select-title',childClass='cascader-menu-item',hasChildClass='cascader-menu-hasChild',leaf='cascader-leaf',ulClass='cascader-menu',ulWrap='layui-cascader-menu',
                            cascader=this.hasClass(CLASS)?this:this.find('.'+CLASS)
                            ,events=function(params){
                                var elem=$(this)
                                    ,spaceName='.cascader'
                                    ,renderList=function (data,leavel,redraw) {
                                        var $this=$(this),
                                            list=$this.find('.'+ulClass),
                                            _title=$this.data('title'),
                                            _params=_title.data('params'),
                                            _selected=_params.selected||[],
                                            li=getArrayList(data,leavel,_params);

                                        var initInput=function(){
                                            if(!_params.showAllLevels && _selected.length>0){
                                                var keyValue=isArrayFn(_params.keyValue)?_params.keyValue.length>leavel?_params.keyValue[leavel]:_params.keyValue[0]:_params.keyValue;
                                                var name=keyValue.nameField || 'name',value=keyValue.valueField || 'value',childName=keyValue.childName || 'child';

                                                var searchData=function (arr,v) {
                                                    for(var i=0;i<arr.length;i++){
                                                        if(arr[i][value]===v){
                                                            return [i];
                                                        }else if(arr[i][childName]){
                                                            var result=searchData(arr[i][childName],v);
                                                            if(result){
                                                                return [i].concat(result);
                                                            }
                                                        }
                                                    }
                                                    return null;
                                                };
                                                var ss=_selected[0]?searchData(_params.data,_selected[0]):null;
                                                if(ss){
                                                    var _list=$this.find('.'+ulClass).eq(leavel).find('li');
                                                    _list.eq(ss[leavel]).addClass('initInput').click();
                                                }
                                            }
                                        };
                                        if(!list || list.length<=leavel){
                                            list=$('<ul class="'+ulClass+'" data-leavel="'+leavel+'">'+li+'</ul>');
                                            list.data('data',data);
                                            $this.append(list);
                                            list.find('.'+THIS).each(function (index,item) {
                                                    var that=$(item)
                                                        ,scrollTop=that.offset().top
                                                        ,parent=that.parent()
                                                        ,parentHeight=parent.outerHeight()
                                                        ,parentTop=parent.offset().top
                                                        ,diss=scrollTop-parentTop;

                                                    if(diss>parentHeight){
                                                        parent.scrollTop(diss-parentHeight/3);
                                                    }
                                                    that.addClass('simulation_click').click();
                                                });
                                            initInput();
                                        }else{
                                            list.each(function (index,item) {
                                                var _ul=$(item);
                                                if(index===leavel) {
                                                    _ul.data('data', data).html(li);
                                                    _ul.find('.'+THIS).addClass('simulation_click').click();
                                                }else if(index>leavel){
                                                    _ul.remove();
                                                }
                                            });
                                            if(redraw){
                                                initInput();
                                            }
                                        }

                                        resize.call(this);
                                    }
                                    ,getArrayList= function (arr,leavel,params) {
                                        var li=[]
                                            ,_selected=params.selected
                                            ,selected=params.showAllLevels!==false ? _selected?_selected[leavel]:null:_selected && _selected.length>0?_selected[0]:null;

                                        var keyValue=isArrayFn(params.keyValue)?params.keyValue.length>leavel?params.keyValue[leavel]:params.keyValue[0]:params.keyValue;
                                        var name=keyValue.nameField || 'name',value=keyValue.valueField || 'value',childName=keyValue.childName || 'child';

                                        for(var i=0;i<arr.length;i++){
                                            var _value=typeof arr[i]==="string"?arr[i]:arr[i][value]
                                                ,_name=typeof arr[i]==="string"?arr[i]:arr[i][name];

                                            li.push('<li class="'+function () {
                                               var _class=[childClass];

                                               if(arr[i][childName] && arr[i][childName].length>0){
                                                   _class.push(hasChildClass);
                                               }else{
                                                   _class.push(leaf);
                                               }
                                               if(selected && _value===selected){
                                                   _class.push(THIS);
                                               }
                                               return _class.join(' ');
                                            }()+'" data-value="'+_value+'">'+_name+'</li>');
                                        }
                                        if(li.length===0){
                                            li.push('<div class="layui-none">无数据</div>');
                                        }
                                        return li.join('');
                                    }
                                    ,resize=function(){
                                        var that=$(this)
                                            ,_title=that.data('title')
                                            ,pos={
                                                width:_title.outerWidth(),
                                                height:_title.outerHeight(),
                                                left:_title.offset().left,
                                                top:_title.offset().top
                                            }
                                            ,width=that.outerWidth()
                                            ,height=that.outerHeight()
                                            ,winWidth=win.width()
                                            ,right=winWidth-pos.left-pos.width;

                                        if(pos.left+width>winWidth){
                                            if(winWidth-right-width>0){
                                                pos.left=winWidth-right-width;
                                            }
                                        }

                                        that.css({left:pos.left+'px',top:pos.top+pos.height+5+'px'});
                                    };


                                elem.off(spaceName);
                                elem.on('redraw'+spaceName,'.'+title,function (e) {
                                    var othis=$(this)
                                        ,index=othis.data('index')
                                        ,params=othis.data('params');

                                    var _menu= $('#'+ulWrap+index);

                                    if(_menu.length>0 && params.data){
                                        renderList.call(_menu,params.data,0,true);
                                    }else{
                                        othis.click();
                                    }
                                });
                                elem.on('click'+spaceName,'.'+title,function (e) {
                                    e.stopPropagation();
                                    var othis=$(this)
                                        ,index=othis.data('index')
                                        ,params=othis.data('params');

                                    if(params.readonly && !othis.hasClass('init')) return ;

                                    $('.'+ulWrap).each(function (i,item) {
                                       var that=$(this);
                                       if(that.attr('id')!==(ulWrap+index)){
                                           that.addClass(HIDE)
                                       }
                                    });

                                    if(index===undefined){
                                        index=topIndex++;

                                        var selectMenu=$('<div id="'+ulWrap+index+'" class="'+ulWrap+'"></div>');
                                        body.append(selectMenu);
                                        othis.data('index',index);
                                        selectMenu.data('title',othis);
                                        selectMenu.data('params',params);
                                        if(params.data){
                                            renderList.call(selectMenu,params.data,0);
                                        }else if(params.url){
                                            $.ajax({
                                                url:params.url,
                                                successed:function (res) {
                                                    if(res.ok){
                                                        params.data=res[util.webConfig.resName];
                                                        renderList.call(selectMenu,res[util.webConfig.resName],0);
                                                    }
                                                }
                                            });
                                        }
                                    }else{
                                        var _menu= $('#'+ulWrap+index);
                                        if(_menu.hasClass(HIDE)){
                                            _menu.removeClass(HIDE);

                                            resize.call(_menu[0]);
                                        }else{
                                            _menu.addClass(HIDE);
                                        }
                                    }

                                    othis.removeClass('init');
                                });

                                body.off(spaceName);
                                //选择显示子项
                                body.on('click'+spaceName,'.'+hasChildClass,function (e) {
                                    e.stopPropagation();
                                    var othis=$(this),
                                        _value=othis.data('value'),
                                        selectMenu=othis.parents('.'+ulWrap),
                                        _title=selectMenu.data('title'),
                                        _elem=_title.data('elem'),
                                        thisUl=othis.parent(),
                                        leavel=thisUl.data('leavel'),
                                        data=thisUl.data('data'),
                                        name='name',
                                        value='value',
                                        childName='children',
                                        _params=_title.data('params'),
                                        child=[];

                                    if(_params.keyValue){
                                        if(isArrayFn(_params.keyValue)){
                                            var _setKeyValue=_params.keyValue.length>leavel?_params.keyValue[leavel]:_params.keyValue[0]||{};
                                            name=_setKeyValue['nameField'] ? _setKeyValue['nameField']:name;
                                            value=_setKeyValue['valueField'] ? _setKeyValue['valueField']:value;
                                            childName=_setKeyValue['childName'] ? _setKeyValue['childName']:childName;
                                        }else{
                                            name=_params.keyValue['nameField']||name;
                                            value=_params.keyValue['valueField']||value;
                                            childName=_params.keyValue['childName']||childName;
                                        }
                                    }

                                    //选择节点 加载下一项数据
                                    if(_params.url && _params.activeItemChange && _params.keyValue){
                                        var chosed=selectMenu.find('.'+THIS),
                                            actived={};
                                        chosed.each(function (index,item) {
                                            var that=$(this);
                                            if(_params.keyValue[index]){
                                                actived[_params.keyValue[index]]=that.data('value');
                                            }
                                        });
                                        actived[name]=_value;
                                        $.ajax({
                                            url:_params.url,
                                            data:actived,
                                            successed:function (res) {
                                                if(res.ok){
                                                    thisUl.find('.'+THIS).removeClass(THIS);
                                                    othis.addClass(THIS);
                                                    renderList.call(selectMenu,res[util.webConfig.resName],parseInt(leavel)+1);
                                                }else{
                                                    console.log(res.msg);
                                                }
                                            }
                                        });

                                    }else{
                                        thisUl.find('.'+THIS).removeClass(THIS);
                                        othis.addClass(THIS);

                                        var __value=_value+"";
                                        for(var i in data){
                                            if((data[i][value]+"")===__value){
                                                child=data[i][childName];
                                                break;
                                            }
                                        }
                                        if(_params.changeOnSelect){
                                            _title.find('input').val(othis.text());
                                            _elem.val(othis.data('value'));
                                            if(!othis.hasClass('initInput')){
                                                _params.selected=[othis.data('value')];
                                                _title.data('params',_params);
                                            }else{
                                                othis.removeClass('initInput');
                                            }
                                        }
                                        renderList.call(selectMenu,child,parseInt(leavel)+1);
                                    }
                                });
                                //点击叶子节点
                                body.on('click'+spaceName,'.'+leaf,function () {
                                    var othis=$(this),
                                        thisUl=othis.parent(),
                                        selectMenu=othis.parents('.'+ulWrap);
                                    if(selectMenu.length===0) return false;
                                    var _title=selectMenu.data('title'),
                                        _params=selectMenu.data('params'),
                                        _elem=_title.data('elem'),
                                        value=[],
                                        text=[];
                                    if(!othis.hasClass(hasChildClass) || _params.changeOnSelect){
                                        thisUl.find('.'+THIS).removeClass(THIS);
                                        othis.addClass(THIS);

                                        if(_params.showAllLevels===undefined ||_params.showAllLevels){
                                            selectMenu.find('.'+THIS).each(function (index,item) {
                                                value.push($(item).data('value'));
                                                text.push($(item).text());
                                            });
                                        }else{
                                            value.push(othis.data('value'));
                                            text.push(othis.text());
                                        }

                                        var _split=_params.split===undefined? '-':_params.split;

                                        var resultValue=value.join(_split),
                                            showValue=text.join(_split);

                                        _params.selected=value;
                                        _title.data('params',_params);

                                        _title.find('input').val(showValue);
                                        _elem.val(resultValue);

                                        if(!othis.hasClass(hasChildClass)){
                                            if(!othis.hasClass('simulation_click')){
                                                selectMenu.addClass(HIDE);
                                            }else{
                                                othis.removeClass('simulation_click');
                                            }
                                            _params.onChange && _params.onChange(showValue);
                                        }
                                    }
                                    return false;
                                });

                                var hide=function(e){
                                    if(!$(e.target).parent().hasClass(ulWrap)){
                                        $('.'+ulWrap).addClass(HIDE);
                                    }
                                };
                                //关闭下拉
                                $(document).off('.off_click').on('click.off_click', hide);

                                if(!params.showAllLevels && params.selected){
                                    elem.find('.'+title).addClass('init').trigger('click');
                                    $(document).trigger('click.off_click');
                                }
                            };
                        
                        cascader.each(function (index,item) {
                            var _this=$(this)
                                ,hasRender = _this.next('.' + renderClass)
                                ,params=util.getOptions(_this.data('options'))||{}
                                ,readonly=typeof _this.attr('readonly')==="string" || params.readonly;

                            params=$.extend({},options,params);

                            var selected=params.selected? params.selected.join(params.split===undefined? '-':params.split):'';

                            var elem=$(['<div class="'+renderClass+'">',
                                '   <div class="layui-form-select">',
                                '       <div class="'+title+'"><input type="text" placeholder="请选择" readonly  class="layui-input"><i class="layui-edge"></i></div>',
                                '   </div>',
                                '</div>'].join(''));

                            _this.val(selected);
                            elem.find('.'+title).data('params',params).data('elem',_this);

                            hasRender[0] && hasRender.remove();
                            _this.addClass(HIDE).after(elem);
                            events.call(elem,params);
                        });

                    }
                    //复选框/开关
                    ,checkbox: function(){
                        var CLASS = {
                            checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox']
                            ,_switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
                        }
                        ,checks =nodeName==='input' && this.type==='checkbox'? this: this.find('input[type=checkbox]')

                        ,events = function(reElem, RE_CLASS){
                            var check = $(this);

                            //勾选
                            reElem.on('click', function(){
                                var filter = check.attr('lay-filter') //获取过滤器
                                    ,text = (check.attr('lay-text')||'').split('|');

                                if(check[0].disabled) return;

                                check.prop('checked') ? (
                                    check.prop('checked',false),reElem.removeClass(RE_CLASS[1]).find('em').text(text[1])
                                ) : (
                                    check.prop('checked',true),reElem.addClass(RE_CLASS[1]).find('em').text(text[0])
                                );

                                check.trigger('change');
                            });
                        };

                        return checks.each(function(index, check){
                            var othis = $(this), skin = othis.attr('lay-skin')
                                ,text = (othis.attr('lay-text')||'').split('|'), disabled = this.disabled;
                            if(skin === 'switch') skin = '_'+skin;
                            var RE_CLASS = CLASS[skin] || CLASS.checkbox;

                            if(typeof othis.attr('lay-ignore') === 'string') return othis.show();

                            //替代元素
                            var hasRender = othis.next('.' + RE_CLASS[0]);
                            var reElem = $(['<div class="layui-unselect '+ RE_CLASS[0] + (
                                check.checked ? (' '+RE_CLASS[1]) : '') + (disabled ? ' layui-checkbox-disbaled '+DISABLED : '') +'" lay-skin="'+ (skin||'') +'">'
                                ,{
                                    _switch: '<em>'+ ((check.checked ? text[0] : text[1])||'') +'</em><i></i>'
                                }[skin] || ((check.title.replace(/\s/g, '') ? ('<span>'+ check.title +'</span>') : '') +'<i class="layui-icon">'+ (skin ? '&#xe605;' : '&#xe618;') +'</i>')
                                ,'</div>'].join(''));

                            hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                            othis.after(reElem);
                            events.call(this, reElem, RE_CLASS);
                        });
                    }
                    //单选框
                    ,radio: function(){
                        var CLASS = 'layui-form-radio', ICON = ['&#xe643;', '&#xe63f;']
                            ,radios =nodeName==='input' && this.type==='radio'? this: this.find('input[type=radio]')

                            ,events = function(reElem){
                                var radio = $(this), ANIM = 'layui-anim-scaleSpring';

                                reElem.on('click', function(){
                                    var name = radio[0].name, forms = radio.parents(ELEM);
                                    var filter = radio.attr('lay-filter'); //获取过滤器
                                    var sameRadio = forms.find('input[name='+ name.replace(/(\.|#|\[|\])/g, '\\$1') +']'); //找到相同name的兄弟

                                    if(radio[0].disabled) return;

                                    $.each(sameRadio, function(){
                                        var next = $(this).next('.'+CLASS);
                                        this.checked = false;
                                        next.removeClass(CLASS+'ed');
                                        next.find('.layui-icon').removeClass(ANIM).html(ICON[1]);
                                    });

                                    radio[0].checked = true;
                                    reElem.addClass(CLASS+'ed');
                                    reElem.find('.layui-icon').addClass(ANIM).html(ICON[0]);

                                    radio.trigger('change');

                                });
                            };

                        radios.each(function(index, radio){
                            var othis = $(this), hasRender = othis.next('.' + CLASS), disabled = this.disabled;

                            if(typeof othis.attr('lay-ignore') === 'string') return othis.show();

                            //替代元素
                            var reElem = $(['<div class="layui-unselect '+ CLASS + (radio.checked ? (' '+CLASS+'ed') : '') + (disabled ? ' layui-radio-disbaled '+DISABLED : '') +'">'
                                ,'<i class="layui-anim layui-icon">'+ ICON[radio.checked ? 0 : 1] +'</i>'
                                ,'<span>'+ (radio.title||'未命名') +'</span>'
                                ,'</div>'].join(''));

                            hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                            othis.after(reElem);
                            events.call(this, reElem);
                        });
                    }
                    ,radioGroup:function (_params) {
                        var CLASS = 'layui-radio-group',itemClass='.layui-radio-item'
                        ,radiosGroup =this.hasClass(CLASS)? this: this.find('.'+CLASS)
                        ,events=function(){
                            var $this=$(this);

                            $this.on('click',itemClass,function () {
                                var _this=$(this);

                                if(_this.hasClass(THIS)) return false;

                                $this.find(itemClass+'.'+THIS).each(function (index,item) {
                                    var that=$(this);
                                    that.removeClass(THIS);
                                    that.find('input[type=radio]').prop('checked',false);
                                });
                                _this.addClass(THIS).find('input[type=radio]').prop('checked',true).trigger('change');

                            })
                        };
                        radiosGroup.each(function(index, radio){
                            events.call(this);
                        });
                    }
                    ,inputGroup:function (_params) {
                        var INPUT_GROUP='layui-input-group',SELECT_SINGLE='layui-select-single',SELECT_TION='.layui-select-selection',SELECTED_VALUE='.layui-select-selected-value',DROPDOWN_LIST='.layui-select-dropdown-list',SELECT_ITEM='.layui-select-item'
                            ,SELECTED='layui-select-item-selected',OPEN='layui-select-select-open',INPUT_NUMBER='layui-input-number';

                        var _group =this.hasClass(INPUT_GROUP)?this :this.find('.'+INPUT_GROUP);


                        var events=function(innder){
                            var _this = $(this).find('.'+SELECT_SINGLE);


                            _this.each(function (index,item) {
                                var othis=$(this)
                                    ,_input=othis.find('input[type=hidden]')
                                    ,_value=othis.find(SELECTED_VALUE)
                                    ,_list=othis.find(DROPDOWN_LIST)
                                    ,_item=_list.find('li');
                                othis.on('click',SELECT_ITEM,function () {
                                    var _this=$(this);
                                    if(_this.hasClass(SELECTED)) return false;
                                    _list.find('.'+SELECTED).removeClass(SELECTED);
                                    _this.addClass(SELECTED);
                                    _value.html(_this.text());
                                    _input.val(_this.data('value'));

                                    othis.removeClass(OPEN);
                                }).on('click',SELECT_TION,function (e) {
                                    e.stopPropagation();
                                    othis.toggleClass(OPEN);
                                });

                                if(_list.find('.'+SELECTED).length===0){
                                    _item && _item.eq(0).click();
                                }
                            });
                            var hide=function(){
                                _this.removeClass(OPEN);
                            };

                            $(document).off('click', hide).on('click', hide);

                        };

                        _group.each(function(index, item){
                            var othis = $(this);
                            var options=$.extend({},_params,util.getOptions(othis.data('options')));



                            var getAppend=function(obj){
                                var prepend;
                                if(obj.type==="select"){
                                    prepend='<div class="layui-select-single">' +
                                        '<div class="layui-select-selection">' +
                                        '<input type="hidden" name="'+obj.name+'" value="">' +
                                        '<div>' +
                                        '<span class="layui-select-selected-value"></span>' +
                                        '<i class="layui-icon">&#xe625;</i>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="layui-select-dropdown ">' +
                                        '<ul class="layui-select-dropdown-list">' +function () {
                                            var _li=[];
                                            if(obj.data && obj.data.length>0){
                                                var text=obj.textField || 'name',
                                                    value=obj.valueField ||'value';

                                                $.each(obj.data,function (i,v) {
                                                    var _name,_value;
                                                    if(typeof v ==="object"){
                                                        _name=v[text];
                                                        _value=v[value];
                                                    }else{
                                                        _name=_value=v;
                                                    }
                                                    _li.push('<li class="layui-select-item" data-value="'+_value+'">'+_name+'</li>');
                                                })
                                            }
                                            if(_li.length===0){
                                                _li.push('<li>无数据</li>');
                                            }
                                            return _li.join('');
                                        }()+'</ul>' +
                                        '</div></div>';


                                }else if(obj.type==="icon"){
                                    prepend='<button type="button" class="layui-btn"><i class="layui-icon">'+obj.text+'</i></button>';
                                }else{
                                    prepend='<span>'+obj.text+'</span>';
                                }

                                return prepend;
                            };
                            var getUrlData=function (inner,obj) {
                                var text=obj.textField || 'name',
                                    value=obj.valueField ||'value';
                                if(obj.url){
                                    $.getJSON(obj.url,function (res) {
                                        if(res.ok){
                                            var _li=[];
                                            $.each(res.vo,function (i,v) {
                                                _li.push('<li class="layui-select-item" data-value="'+v[value]+'">'+v[text]+'</li>');
                                            });
                                            inner.find(DROPDOWN_LIST).html(_li.join(''));

                                            inner.find(SELECT_ITEM).eq(0).click();
                                        }
                                    });
                                }
                            };

                            if(options.left || options.right){
                                var _input=options.input ||{};
                                var left=options.left? '<div class="layui-input-prepend">'+getAppend(options.left)+'</div>':''
                                    ,input='<input type="'+(_input.type||"text")+'" name="'+(_input.name||"")+'" value="'+(_input.value||"")+'"  placeholder="'+(_input.placeholder||"请输入文字")+'" autocomplete="off"  class="layui-input">'
                                    ,right=options.right? '<div class="layui-input-append">'+getAppend(options.right)+'</div>':'';

                                othis.html(left+ input +right);

                                if(options.left && options.left.url){
                                    getUrlData(othis.find('.layui-input-prepend'),options.left);
                                }
                                if(options.right && options.right.url){
                                    getUrlData(othis.find('.layui-input-append'),options.right);
                                }
                            }

                            events.call(this);
                        });


                        var _numberGroup=this.hasClass(INPUT_NUMBER)?this:this.find('.'+INPUT_NUMBER);

                          var accAdd = function(arg1, arg2) {
                                var r1, r2, m;
                                try {
                                    r1 = arg1.toString().split(".")[1].length;
                                } catch (e) {
                                    r1 = 0;
                                }
                                try {
                                    r2 = arg2.toString().split(".")[1].length;
                                } catch (e) {
                                    r2 = 0;
                                }
                                m = Math.pow(10, Math.max(r1, r2));
                                return (arg1 * m + arg2 * m) / m;
                            };

                        _numberGroup.each(function (index,item) {
                            var $this=$(this)
                                ,input=$this.find('input')
                                ,step=$this.attr('step')*1 ||1
                                ,min=$this.attr('min')*1 ||0
                                ,max=$this.attr('max')*1;

                            $this.off('click','.add').on('click','.add',function () {
                                var _value=accAdd(input.val(),step);
                                if(!isNaN(max) && _value>max) _value=max;
                                input.val(_value);
                            });
                            $this.off('click','.cut').on('click','.cut',function () {
                                var _value=accAdd(input.val(),-step);
                                if(_value<min) _value=min;
                                input.val(_value);
                            });
                        });

                    }
                };
            if(!type){
                type=nodeName;
            }
            items[type] ? items[type].call(_this,_params) :$.each(items,function (i,v) {
                v.call(_this,_params);
            });

            return _this;
        },
        selectSetValue:function(val){
            var  nodeName=this.length>0?this[0].nodeName.toLowerCase():this.nodeName.toLowerCase()
                ,_select= nodeName==='select'? this: this.find('select');

            return _select.each(function (index,item) {
                var othis=$(item)
                    ,multiple=othis.attr('multiple')
                    ,render = othis.next('.'+CLASS)
                    ,list=render.data('list');

                if(!multiple && isInArray(val) && val.length>1){
                    val.splice(0,val.length-1);
                }

                var setData=function () {
                    if(othis.data('loading')){
                        setTimeout(function () {
                            setData();
                        },600);
                        return false;
                    }
                    var data=render.data('data'),showText=[];
                    for(var i=0;i<data.length;i++){
                        data[i].selected=false;
                    }
                    for(var i=0;i<data.length;i++){
                        if(isInArray(val,data[i].value)){
                            data[i].selected=true;
                            showText.push(data[i].text);
                            if(!multiple){
                                break;
                            }
                        }
                    }

                    if(list){
                        var dd=list.find('dd');
                        dd.each(function (i,v) {
                            var that=$(this);
                            if(isInArray(val,that.attr('lay-value'))){
                                that.addClass(THIS);
                            }else{
                                that.removeClass(THIS);
                            }
                        })
                    }
                    render.data('data',data).find('.layui-select-label').val(showText.join(','));
                    othis.val(val).trigger('change');
                };
                setData();
            })
        },
        selectReload:function(){
            var  nodeName=this.length>0?this[0].nodeName.toLowerCase():this.nodeName.toLowerCase()
                ,_select= nodeName==='select'? this: this.find('select');

            return _select.each(function (index,item) {
                var othis = $(item)
                    , render = othis.next('.' + CLASS)
                    , list = render.data('list')
                    , params=render.data('params');

                list && list.remove();
                render && render.remove();


                methods.render.call(othis,'select',params);
            });
        },
        cascaderSetValue:function(val){
            var CLASS='layui-cascader',renderClass='layui-cascader-render',titleClass='layui-select-title';
            var cascader=this.hasClass(CLASS)?this:this.find('.'+CLASS);
            return cascader.each(function () {
                var _this=$(this),
                    elem=_this.next('.' + renderClass),
                    title=elem.find('.'+titleClass),
                    params=title.data('params'),
                    input=title.find('input'),
                    selected=val.join(params.split===undefined? '-':params.split);

                params.selected=val;
                title.data('params',params);
                _this.val(selected);
                title.trigger('redraw');
                // input.val(selected);
            })
        },
        cascaderDestory:function(){
            var CLASS='layui-cascader',renderClass='layui-cascader-render',titleClass='layui-select-title';
            var cascader=this.hasClass(CLASS)?this:this.find('.'+CLASS);
            return cascader.each(function () {
                var _this=$(this),
                    elem=_this.next('.' + renderClass),
                    title=elem.find('.'+titleClass).eq(0),
                    cascaderMenu=$('#layui-cascader-menu'+title.data('index'));

                cascaderMenu.remove();
            })
        },
        getValue:function (params) {
            var _this=$(this),
                _arr={};

            if(methods.verify.call(this)){
                _this.find('input').each(function (index,item) {
                    var $this=$(item);
                    if($this.attr('name')){
                        var _val=$this.val();

                        if($this.attr('type')==="checkbox"){
                            var checked=$this.prop('checked');
                            if(checked){
                                if(_arr[$this.attr('name')]){
                                    _arr[$this.attr('name')]=_arr[$this.attr('name')].concat(_val);
                                }else{
                                    _arr[$this.attr('name')]=[_val];
                                }
                            }
                        }else if($this.attr('type')==="radio" && !$this.prop('checked')){

                        }else{
                            if(typeof $this.attr('md5')==="string"){
                                _val=Md5.hex_md5(_val);
                            }
                            _arr[$this.attr('name')]=_val;
                        }
                    }
                });
                _this.find('select').each(function (index,item) {
                    var $this=$(item);

                    if($this.attr('name')){
                        _arr[$this.attr('name')]=$this.val();
                    }
                });
                _this.find('textarea').each(function (index,item) {
                    var $this=$(item);

                    if($this.attr('name')){
                        _arr[$this.attr('name')]=$this.val();
                    }
                });
                return _arr;
            }else{
                return false;
            }
        },
        submit:function(params){
            var _this=$(this),
                _value=methods.getValue.call(this),
                _action=_this.attr('action')||'',
                _params=util.getOptions(_this.data('options'))||{};

            if(_action.length>0){
                _params.url=_action;
            }
            _params=$.extend(true,{'data':_value},_params,params);

            if(_value){
                $.ajax({
                    url:_params.url,
                    data:_params.data||{},
                    successed:function (res) {
                        _params.done && _params.done(res);
                    },
                    notOk:function(res){
                        _params.done && _params.done(res);
                    }
                });
            }
        },
        verify:function () {
            var _this=$(this)
                ,name=_this.find('[name]')
                ,flag=true;

            name.each(function (index,item) {
                var $this=$(item)
                    ,_attr=$this.attr('lay-verify')
                    ,_verify=_attr?_attr.split('|'):[];

                if($this.attr('required')&& _verify.indexOf('required')<0){
                    _verify.unshift('required');
                }

                for(var i=0;i<_verify.length;i++){
                    var _arrItem=verify[_verify[i]];
                    if(_arrItem){
                        if("function"===typeof _arrItem){
                            var msg=_arrItem(item.value);
                            if(msg){
                                $.msg(msg);
                                $this.addClass(DANGER).focus();
                                flag=false;
                                break;
                            }
                        }else{
                            if("function"===typeof _arrItem[0]){
                                if(!_arrItem[0](item.value)){
                                    $.msg(_arrItem[1]);
                                    $this.addClass(DANGER).focus();
                                    flag=false;
                                    break;
                                }
                            }else{
                                if(!_arrItem[0].test(item.value)){
                                    $.msg(_arrItem[1]);
                                    $this.addClass(DANGER).focus();
                                    flag=false;
                                    break;
                                }
                            }
                        }
                    }else{
                        console.log(_verify[i]+' 验证方法不存在！');
                        flag=false;
                        break;
                    }
                }
                if(!flag) return false;
            });
            return flag;
        },
        setVerify:function (params) {
            verify=$.extend({},verify,params);
        },

    };

    //判断是否是数组
    function isArrayFn(arr){
        if (typeof Array.isArray === "function") {
            return Array.isArray(arr);
        }else{
            return Object.prototype.toString.call(arr) === "[object Array]";
        }
    }
    //判断是否再数组中
    function isInArray(arr,value){
        if(!isArrayFn(arr)){
            arr=[arr];
        }
        for(var i=0;i<arr.length;i++){
            if(value==arr[i]){
                return true;
            }
        }
        return false;
    }

    //在插件中使用对象
    $.myform=$.fn.myform  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.render;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.form');
            return this;
        }
        return method.apply(this, arguments);
    };


    $.fn.select  =  function (options) {
        var options=options||{};
        var method  =  arguments[0];
        switch (method){
            case 'setValue':method='selectSetValue';break;
            case 'reload':method='selectReload';break;
        }
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method  =  methods.render;
            return method.call(this,'select',options);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.select');
            return this;
        }
        return method.apply(this,arguments);
    };

    $.fn.cascader  =  function (options) {
        var method  =  arguments[0];

        switch (method){
            case 'setValue':method='cascaderSetValue';break;
            case 'destory':method='cascaderDestory';break;
            default:break;
        }

        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method  =  methods.render;
            return method.call(this,'cascader',options);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.cascader');
            return this;
        }
        return method.apply(this,arguments);
    };

    $.fn.inputGroup  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method  =  methods.render;
            return method.call(this,'inputGroup',options);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.inputGroup');
            return this;
        }
        return method.apply(this,arguments);
    };

    dom.myform();

    exports('myform');
});