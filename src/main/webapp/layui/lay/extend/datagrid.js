layui.define(['jquery','laydate','util','page','myform','tooltip','dialog','doT'], function (exports) {
    var laydate = layui.laydate,
        util=layui.util;
    window.$  =  layui.jquery;

    var MOD_NAME  =  'table', ELEM  =  'layui-table', THIS  =  'layui-this', SHOW  =  'layui-show', HIDE  =  'layui-hide',
        DISABLED  =  'layui-disabled', NONE  =  'layui-none'
        , ELEM_FORM  =  'layui-form ', ELEM_BORDER  =  'layui-border-box ', TABLE_BOX  =  'layui-table-box'
        , ELEM_VIEW  =  'layui-table-view', ELEM_HEADER  =  'layui-table-header', ELEM_BODY  =  'layui-table-body ',
        ELEM_MAIN  =  'layui-table-main', ELEM_FIXED  =  'layui-table-fixed', ELEM_FIXL  =  'layui-table-fixed-l',
        ELEM_FIXR  =  'layui-table-fixed-r', ELEM_TOOL  =  '.layui-table-tool', ELEM_PAGE  =  'layui-table-page',
        ELEM_SORT  =  'layui-table-sort', ELEM_EDIT  =  'layui-table-edit', ELEM_HOVER  =  'layui-table-hover',ELEM_BOX = 'layui-box',ELEM_PAGE_BTN = 'layui-laypage-btn',ELEM_PAGE_INPUT = 'layui-input',
        CHECK_BOX = 'layui-form-checkbox', CHECKED_BOX = 'layui-form-checked',ELEM_CELL  =  '.layui-table-cell',ELEM_CLICK  =  'layui-table-click';

    var tableIndex = 1,
        indexName = 'LAY_TABLE_INDEX',
        lay_table_default  =  {
            columns: [],
            data: [],
            url: undefined,
            method: 'GET',
            singleSelect: false,//是否单选
            selectIndex: [],//选中序号
            cellMinWidth: 80,//最小单元格宽度
            rownumbers:true,//是否显示序号
            clickRows:undefined,//单击行事件
            clickHead:undefined,//单击头部事件
            clickOnCheck:true,//点击复选框的时候选中行
            checkOnClick:false,//点击行的时候选中复选框
            rowHover:true,
            where: undefined,
            request:{
                page:1,
                pageSize: 10,
                pageName: 'page',
                sizeName: 'rows',
            },
            response:{
                resName: 'vo',
                dataName: 'rows',
                totalName:'total',
                total:undefined,
            }
        };
    var methods  =  {
        init: function (options) {
            return this.each(function (i, item) {
                var _this = this;
                var c  =  $.data(_this, "datagrid");
                var opt = {};
                if (c) {
                    opt = $.extend({},c, options);
                    opt.selectIndex = [];
                    $.data(_this, "datagrid", opt);
                    methods.initBody.call(_this);
                    return ;
                }else{
                    var _option = $(_this).data('options');
                    if(typeof _option==="string"){
                        opt =util.getOptions(_option);
                    }
                    opt = $.extend({}, lay_table_default,opt, options);
                    opt.index  =  tableIndex++;
                    opt.view = '#layui_table_'+opt.index;
                }
                opt.that = this;
                $.data(_this, "datagrid", opt);
                methods.initDom.call(_this);
            })
        },
        initDom: function () {
            var that = this,
                _this = $(that),
                c = $.data(that, "datagrid"),
                table_id = 'layui_table_'+c.index,
                _dom  =  _this.prop("tagName").toLowerCase();

            var tableWrap  =  [
                '<div class = "' + ELEM_FORM +' '+ ELEM_BORDER +' '+  ELEM_VIEW + '" id = "' + table_id + '">',
                    '<div class = "' + TABLE_BOX + '">',
                        '<div class = "' + ELEM_HEADER + '">',
                             '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><thead></thead></table>',
                        '</div>',
                        '<div class = "' + ELEM_BODY +' '+  ELEM_MAIN + '">',
                            '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><tbody></tbody></table>',
                            '<div class = "layui-none"></div>',
                        '</div>',
                    '</div>',
                '</div>'].join('');

            if (_dom === 'div') {
                _this.html(tableWrap)
            } else if (_dom === 'table') {
                _this.after(tableWrap).hide();
            }

            var table = $('#'+table_id);
            c.header = table.find('.'+ELEM_HEADER).eq(0);
            c.main = table.find('.'+ELEM_MAIN).eq(0);

            $.data(that, "datagrid",c);

            if(c.columns.length===0){
                methods.initColumns.call(that);
            }
            methods.initHead.call(that);
            methods.eachCols.call(that);
            methods.getData.call(that,true);
            methods.initEvent.call(that);
        },
        initHead: function () {
            var c  =  $.data(this, "datagrid"),
                BOX = $(c.view).find('.'+TABLE_BOX),
                columns = c.columns;
            var table  =  [],
                ltable = [],
                rtable = [];

            for (var i  =  0, len  =  columns.length; i < len; i++) {
                var cols  =  columns[i],
                    lfixed = '',
                    rfixed = '',
                    _tr = '';
                for (var j  =  0; j < cols.length; j++) {
                    var _cols  =  cols[j];
                        if(!_cols) continue;
                     var field  =  _cols.field === undefined ? j : _cols.field,
                        _th = '<th data-field = "' + field + '" '+(function () {
                            var co = '';
                            if(_cols.colspan){
                                co+= " colspan = \""+_cols.colspan+"\" ";
                            }
                            if(_cols.rowspan){
                                co+= " rowspan = \""+_cols.rowspan+"\" ";
                            }
                            return co;
                        })()+'><div class = "layui-table-cell laytable-cell-' + j + '-' +field+ (function () {
                            if(_cols.type){
                                return " laytable-cell-"+_cols.type;
                            }else{
                                return "";
                            }
                        })()+ '" ' +(function () {
                            return  _cols.align === undefined ? "" : " align = '" + _cols.align + "' ";
                        })() + '>' + (function () {
                            var title = '';
                            if(_cols.type==="checkbox"){
                                title = '<div class = "layui-unselect layui-form-checkbox" lay-skin = "primary"><i class = "layui-icon">&#xe605;</i></div>';
                            }else if(_cols.title){
                                title =  '<span>'+_cols.title+'</span>';
                                if(_cols.sort){
                                    c.hasSort = true;
                                    title+= '<span class = "'+ELEM_SORT+' layui-inline"><i class = "layui-edge layui-table-sort-asc"></i><i class = "layui-edge layui-table-sort-desc"></i></span>';
                                }
                            }
                            return title;
                        })() + '</div></th>';

                    if(_cols.compare){
                        var getCompareData=function(cols){
                            var compare=cols.compare;
                            $.ajax({
                                url:compare.url||'',
                                data:compare.where,
                                successed:function (res) {
                                    var result  =  res[util.webConfig.resName||c.response.resName];

                                    localStorage.setItem(c.view+'_'+cols.field,JSON.stringify(result));
                                }
                            });
                        }(_cols);
                    }
                    if(_cols.fixed){
                        if(_cols.fixed=="left"){
                            lfixed+= _th;
                        }else{
                            rfixed+= _th;
                        }
                    }
                    _tr+= _th;
                }

                table.push('<tr>'+_tr+'</tr>');

                if(lfixed.length>0){
                    ltable.push('<tr>'+lfixed+'</tr>');
                }
                if(rfixed.length>0){
                    rtable.push('<tr>'+rfixed+'</tr>');
                }
            }

            c.header.find('thead').html(table.join(''));
            //左固定列
            if(ltable.length>0){
                var  l_fixed = '<div class = "'+ELEM_FIXED+' '+ELEM_FIXL+'">' +
                    '<div class = "'+ELEM_HEADER+'">' +
                    '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><thead>' +
                         ltable.join('') +
                    '</thead></table>'+
                    '</div>' +
                    '<div class = "'+ELEM_BODY+'">' +
                    '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><tbody></tbody></table>'+
                    '</div>'+
                    '</div>';
                BOX.append(l_fixed);
            }
            //右固定列
            if(rtable.length>0){
                var  r_fixed = '<div class = "'+ELEM_FIXED+' '+ELEM_FIXR+'">' +
                    '<div class = "'+ELEM_HEADER+'">' +
                    '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><thead>' +
                         rtable.join('') +
                    '</thead></table>'+
                    '<div class = "layui-table-mend"></div>'+
                    '</div>' +
                    '<div class = "'+ELEM_BODY+'">' +
                    '<table class = "' + ELEM + '" cellspacing = "0" cellpadding = "0" border = "0"><tbody></tbody></table>'+
                    '</div>'+
                    '</div>';
                BOX.append(r_fixed);
            }
            if(c.hasSort){
                $.data(this, "datagrid",c)
            }
            table = ltable = rtable = null;
        },
        initBody: function (isFirst,isloadData) {
            var _this = this;
            var c = $.data(_this, "datagrid"),
                ltable = [],
                rtable = [],
                table  =  [],
                cData=[].concat(c.data);
            var data  =isloadData? cData:cData.length>0? cData.splice((c.request.page-1)*c.request.pageSize,c.request.pageSize):[];
            c.main.find('.layui-none').remove();
            for (var i  =  0, len  =  data.length; i < len; i++) {
                var lfixed = [],
                    rfixed = [];
                table.push('<tr data-index = "' + i + '">');
                for(var jj = 0;jj<c.cols.length;jj++){
                    var item = c.cols[jj],
                         field  =  item.field;
                    if(item.type){
                        field = item.index;
                    }
                    var _td = '<td data-field = "' + field + '" ' + (function () {
                        var attr = "";
                        if(item.align){
                            attr+=  " align = '" + item.align + "' ";
                        }
                        if(item.style){
                            attr+=  ' style = "'+item.style+'" ';
                        }
                        return attr;
                    })()+ '><div class = "layui-table-cell laytable-cell-' + item.index + '-' + field+(function () {
                        if(item.type){
                            return " laytable-cell-"+item.type;
                        }
                        return "";
                    })() + '"><span>' + (function () {
                        var text = "";
                        if(item.type==="numbers"){
                            return i+1;
                        }
                        if(item.type==="checkbox"){
                            return '<div class = "layui-unselect layui-form-checkbox" lay-skin = "primary"><i class = "layui-icon">&#xe605;</i></div>';
                        }
                        text = data[i][field];
                        //格式化
                        if(item.formatter) {
                            text  =  item.formatter(text, data[i]);
                        }
                        //匹配值
                        if(item.compare){
                            var compareData=layui.data(c.view+'_'+field);
                            if(compareData){
                                var name=item.compare.textField ||'name',
                                    value=item.compare.valueField ||'value';
                                for(var s=0;s<compareData.length;s++){
                                     if(text==compareData[s][value]){
                                         text=compareData[s][name];
                                         break;
                                     }
                                }
                            }
                        }

                        //模板
                        if(item.template){
                            text= $.doT($(item.template).html(),data[i]);
                        }
                        text=(text===undefined || text===null)?"":text;
                        return text;
                    })() + '</span></div></td>';

                    if(item.fixed){
                        if(item.fixed=="left"){
                            lfixed.push(_td);
                        }else{
                            rfixed.push(_td);
                        }
                    }
                    table.push(_td);
                }
                table.push('</tr>');

                if(lfixed.length>0){
                    ltable.push('<tr data-index = "' + i + '">'+lfixed.join('')+'</tr>');
                }
                if(rfixed.length>0){
                    rtable.push('<tr data-index = "' + i + '">'+rfixed.join('')+'</tr>');
                }
            }

            c.main.find('tbody').html(table.join(''));
            if(data.length===0){
                c.main.append('<div class = "layui-none">无数据</div>');
            }

            if(ltable.length>0){
                $(c.view).find('.'+ELEM_FIXL+' .'+ELEM_BODY+' tbody').html(ltable.join(''));
            }
            if(rtable.length>0){
                $(c.view).find('.'+ELEM_FIXR+' .'+ELEM_BODY+' tbody').html(rtable.join(''));
            }
            if(isFirst){
                methods.initStyle.call(_this);
            }
            methods.scrollPatch.call(_this);
        },
        initPage:function(){
            var _this=this,
                c  =  $.data(_this, "datagrid");

            var _page=$('<div class = "'+ELEM_PAGE+'"></div>');
            var opt=$.extend({},c.page,{
                index:c.index,
                page:c.request.page,
                pageSize:c.request.pageSize*1,
                totalCount:c.response.total,
                onChange:function (opt) {
                    c.request=$.extend({},c.request,opt);

                    $.data(_this, "datagrid",c);

                    methods.getData.call(_this);
                }
            });
            _page.page(opt);

            $(c.view).find('.'+ELEM_PAGE).remove();
            $(c.view).append(_page);
        },
        initStyle: function () {
            var _this = this.length===undefined?this:this[0];
            var c = $.data(_this, "datagrid"),
                cols  =  c.columns,
                colsCount  =  0,
                colspanCount = 0,
                id  =  c.index,
                isAllSet  =  false,
                unSetCount  =  0,
                setWidth  =  0,
                BOX = $(c.view).find('.'+TABLE_BOX),
                style  =  [];


            //设定表格高度
            if (c.height||/^full(-\d+)*$/.test(c.height)) {
                var header_height = c.header.height(),tHeight = c.height;
                if(/^full(-\d+)*$/.test(c.height)){
                    var d = c.height==='full'?0:c.height.split('-')[1];
                    tHeight = $(window).height()-d-20;
                }
                var table_h = Math.floor(tHeight-1 - header_height);
                table_h = c.page===undefined?table_h:(table_h-41);
                style.push('#layui_table_' + id + ' .' + ELEM_MAIN + '{height:' + table_h + 'px}');
            }
            //遍历已设定宽度
            $.each(cols, function (i, v) {
                $.each(v, function (j, item) {
                    if(item){
                        if (item.width  !==  undefined||item.type) {
                            if(item.type==="numbers"||item.type==="checkbox"){
                                item.width = 40;
                                setWidth +=  item.width+0.5 ;
                            }else{
                                setWidth +=  parseFloat(item.width);
                            }
                            var field = item.field===undefined?j:item.field;
                            style.push('#layui_table_' + id + ' .laytable-cell-' + j + '-' +field + '{width:' + item.width + 'px}')
                        } else if(!item.colspan){
                            unSetCount++;
                            isAllSet  =  true;
                        }else{
                            colspanCount++;
                        }
                        colsCount++;
                    }
                })
            });

            colsCount-= colspanCount;
            if (isAllSet) {
                var  totalWidth  =  c.width || ($(_this).parent().width()-2);
                var leftWidth  =  totalWidth - setWidth - colsCount-1;
                var _width  =  Math.ceil(leftWidth / unSetCount);
                _width  =  _width < c.cellMinWidth ? c.cellMinWidth : _width;
                $.each(cols, function (i, v) {
                    $.each(v, function (j, item) {
                        if(item){
                            if (item.width === undefined&&item.colspan === undefined) {
                                item._width  =  _width;
                                var field = item.field===undefined?j:item.field;
                                style.push('#layui_table_' + id + ' .laytable-cell-' + j + '-' + field + '{width:' + _width + 'px}')
                            }
                        }
                    })
                });
            }else{
               style.push('#layui_table_' + id + '{width:' + (setWidth+colsCount+3) + 'px}');
            }

            var styleElem=$('#style-' + id);
            if(styleElem.length>0){
                styleElem.html(style.join(''));
            }else{
                styleElem=document.createElement('style');
                styleElem.setAttribute('id','style-' + id);
                styleElem.type = "text/css";
                if (styleElem.styleSheet) { //IE
                    styleElem.styleSheet.cssText =style.join('');
                } else { //w3c
                    styleElem.innerHTML =style.join('');
                }
                BOX.append(styleElem);
            }
            c.columns = cols;
            c.autoColNums = unSetCount;
            $.data(this, "datagrid",c)
        },
        initColumns:function(){
            var _this = $(this),
                thead = _this.find('thead'),
                c  =  $.data(this, "datagrid"),
                cols = [],
                tr = null;
            if(thead===undefined||thead.length===0){
                tr = _this.find('th').parent('tr');
            }else{
                tr = thead.find('tr');
            }
            $.each(tr,function (i,v) {
                var cc = [],th = $(v).find('th');
                $.each(th,function (j,k) {
                    var tt = $(k);
                    var opt =util.getOptions(tt.data('options'));
                    if(!!opt.type){
                        opt = $.extend(opt,{width:40});
                    }else{
                        opt = $.extend(opt,{title:tt.html()});
                    }
                    if(tt.attr('align')){
                        opt = $.extend(opt,{align:tt.attr('align')});
                    }
                    if(tt.attr('rowspan')){
                        opt = $.extend(opt,{rowspan:tt.attr('rowspan')});
                    }
                    if(tt.attr('colspan')){
                        opt = $.extend(opt,{colspan:tt.attr('colspan')});
                    }
                    cc.push(opt);
                });
                cols.push(cc);
            });
            c.columns = cols;
            $.data(_this, "datagrid",c);
        },
        eachCols:function() {
            var c = $.data(this, "datagrid"),
                 cols  =  $.extend(true, [], c.columns)
                , arrs  =  [], index  =  0,field = [];
            //重新整理表头结构
           $.each(cols, function (i1, item1) {
                $.each(item1, function (i2, item2) {
                    //如果是组合列，则捕获对应的子列
                    if (item2.colspan != undefined) {
                        var childIndex  =  0;
                        index++
                        item2.CHILD_COLS  =  [];
                        $.each(cols[i1 + 1], function (i22, item22) {
                            if (item22.PARENT_COL || childIndex == item2.colspan) return;
                            item22.PARENT_COL  =  index;
                            item2.CHILD_COLS.push(item22);
                            childIndex  =  childIndex + (item22.colspan != undefined ? item22.colspan : 1);
                        });
                    }
                    item2.index = i2;
                    if(item2.PARENT_COL) return; //如果是子列，则不进行追加，因为已经存储在父列中
                    arrs.push(item2)
                });
            });
           var getField = function (_arr) {
               if(_arr.colspan===undefined) field.push(_arr);
               if(_arr.CHILD_COLS&&_arr.CHILD_COLS.length>0){
                   $.each(_arr.CHILD_COLS,function (i,v) {
                       getField(v);
                   })
               }
           }
           $.each(arrs,function (i,v) {
               getField(v);
           })

            c.cols = field;
            $.data(this, "datagrid",c)
        },
        getData:function(isFirst){
            var _this = this,
                c  =  $.data(_this, "datagrid"),
                that = $(this),
                request = c.request,
                _dom  =  that.prop("tagName").toLowerCase();

            $(c.view).find('th .'+CHECK_BOX).removeClass(CHECKED_BOX);
            c.selectIndex = [];

            if(c.url===undefined){
                //从table初始化
                if(c.data.length===0&&_dom==='table'){
                    var tr = that.find('tr'),
                        cols = c.columns,
                        data = [];
                    $.each(tr,function (i,v) {
                        var td = $(v).find('td'),tdata = {};
                        if(td&&td.length>0){
                            for(var ii = 0,len = cols.length;ii<len;ii++){
                                var field = cols[ii].field;
                                tdata[field] = td[ii].innerHTML;
                            }
                            data.push(tdata);
                        }
                    });
                    if(c.rownumbers){
                        cols.unshift({type:'numbers'});
                    }
                    if(c.hasSort){
                        $.each(data,function (i,k) {
                            k[indexName] = i;
                        })
                    }
                    c.data = data;
                    c.response.total = data.length;
                    $.data(_this, "datagrid",c);
                }else{
                    c.response.total = c.data.length;
                }
                if(c.hasSort){
                    $.each(c.data,function (i,k) {
                        k[indexName] = i;
                    })
                    $.data(_this, "datagrid",c);
                }
                methods.initBody.call(_this,isFirst);
                if(c.page != undefined){
                    methods.initPage.call(_this);
                }
                return;
            }else{
                var main_body= that.find('.'+ELEM_MAIN).eq(0);
                main_body.loading();
                var param  =  "?" + request['pageName'] + "=" + request['page'] + "&" + request['sizeName'] + "=" + request['pageSize'];
                $.ajax({
                    url: c.url + param,
                    type: c.method,
                    data:c.where,
                    dataType: 'json',
                    hideLoading:true,
                    successed: function (_data) {
                        main_body.loading('hide');
                        var result  =  _data[util.webConfig.resName||c.response.resName],
                            data=Object.prototype.toString.call(result)  === '[object Array]'?result:result[util.webConfig.dataName || c.response.dataName];

                        c.response.total = result[util.webConfig.totalName||c.response.totalName]||data.length;
                        if(c.hasSort){
                            $.each(data,function (i,k) {
                                k[indexName] = i;
                            })
                        }
                        c.data  =  data;
                        $.data(_this, "datagrid",c);

                        if(typeof c.sort==="object"){
                            methods.sort.call(_this,c.sort.field,c.sort.type);
                        }else{
                            methods.initBody.call(_this,isFirst,true);
                        }
                        if(c.page !== undefined){
                            methods.initPage.call(_this);
                        }
                        return;
                    }
                });
            }
        },
        sort:function(field,type){
            var _this = this,
                 c  =  $.data(_this, "datagrid");

            c.sort = {
                field:field,
                type:type
            }
            if(type===undefined){
                c.data = layui.sort(c.data,field);
            }else if(type == 'asc'){
                c.data = layui.sort(c.data,field,true);
            }else{
                c.data = layui.sort(c.data,indexName);
                c.sort = undefined;
            }
            $.data(_this, "datagrid",c);
            methods.initBody.call(_this);
        },
        initEvent: function () {
            var _this  =  this,
                c  =  $.data(_this, "datagrid"),
                cols = c.cols,
                table =  $(c.view),
                header  =  table.find('.'+ELEM_HEADER),
                main  =  c.main,
                tbody = table.find('.'+ELEM_BODY);

            //同步表格头部滚动
            main.on('scroll', function () {
                var othis  =  $(this)
                    , scrollLeft  =  othis.scrollLeft()
                    ,scrollTop  =  othis.scrollTop();

                header.scrollLeft(scrollLeft);
                table.find('.'+ELEM_FIXED+' .'+ELEM_BODY).scrollTop(scrollTop);
            });
            //点击头部
            header.on('click','th',function () {
                var $this = $(this),
                    field = $this.data('field'),
                    span = $this.find('.'+ELEM_SORT);
                //排序
                if(span.length>0){
                    var type = span.attr('lay-sort');
                    //清除其他标题排序
                    $(c.view).find('th .'+ELEM_SORT).removeAttr('lay-sort');

                    if(type===undefined){
                        span.attr('lay-sort','asc');
                    }else if(type == 'asc'){
                        span.attr('lay-sort','desc');
                    }else{
                        span.removeAttr('lay-sort');
                    }
                    methods.sort.call(_this,field,type);
                }
                // c.clickHead&&c.clickHead(field);
            });
            //切换全选
            header.on('click','th .'+CHECK_BOX,function () {
                var _this = $(this),selected = [];
                if(_this.hasClass(CHECKED_BOX)){
                    table.find('.'+CHECKED_BOX)
                        .removeClass(CHECKED_BOX);
                    table.find('.'+ELEM_CLICK)
                        .removeClass(ELEM_CLICK);
                }else{
                    _this.addClass(CHECKED_BOX);
                    table.find('.'+ELEM_BODY+' tr').each(function (i,v) {
                        var that = $(v);
                        that.addClass(ELEM_CLICK)
                            .find('.'+CHECK_BOX)
                            .addClass(CHECKED_BOX);
                    });
                    main.find('tr').each(function (j,k) {
                        selected.push($(this).data('index'));
                    });
                }
                c.selectIndex = selected;
                $.data(_this, "datagrid",c);
            });
            //点击行
            tbody.on('click', 'tr', function (e) {
                e.stopPropagation();

                var that  =  $(this),
                    cc  =  $.data(_this, "datagrid"),
                    index  =  that.data('index'),
                    tr = tbody.find('tr:eq('+index+')');

                if(cc.checkOnClick){
                    that.find('.'+CHECK_BOX).click();
                }else{
                    if (that.hasClass(ELEM_CLICK)) {
                        tr.removeClass(ELEM_CLICK);
                    } else {
                        tr.addClass(ELEM_CLICK);
                        if (cc.singleSelect) {
                            var _tr = tr.siblings('tr.' + ELEM_CLICK);
                            $.each(_tr,function (i,v) {
                                $(v).removeClass(ELEM_CLICK).find('.'+CHECK_BOX).removeClass(CHECKED_BOX);
                            });
                        }
                    }
                    cc.clickRows&&cc.clickRows(index,cc.data[index]);
                }
            }).on('mouseenter', 'tr', function () {
                var that  =  $(this),
                    cc  =  $.data(_this, "datagrid"),
                    index  =  that.data('index');
                if(cc.rowHover){
                    tbody.find('tr:eq('+ index +')').addClass(ELEM_HOVER);
                }
            }).on('mouseleave', 'tr', function(){
                var that  =  $(this),
                    cc  =  $.data(_this, "datagrid")
                    ,index  =  that.data('index');
                if(cc.rowHover){
                    tbody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER);
                }
            }).on('click', 'tr .'+CHECK_BOX, function (e) {
                e.stopPropagation();
                var that = $(this),
                   cc  =  $.data(_this, "datagrid"),
                   parentTr = that.parents('tr'),
                   index = parentTr.data('index'),
                   tr = tbody.find('tr:eq('+index+')'),
                   tr_box = tr.find('.'+CHECK_BOX);

               if(that.hasClass(CHECKED_BOX)){
                   tr_box.removeClass(CHECKED_BOX);
                   if(cc.clickOnCheck){
                       tr.removeClass(ELEM_CLICK);
                   }
                    methods.countSelected.call(_this,index,true);
               }else{
                   if (cc.singleSelect) {
                       if(cc.clickOnCheck){
                           tbody.find('.'+ELEM_CLICK).removeClass(ELEM_CLICK)
                       }
                       tbody.find('.'+CHECKED_BOX).removeClass(CHECKED_BOX);
                   }
                   tr_box.addClass(CHECKED_BOX);
                   if(cc.clickOnCheck){
                       tr.addClass(ELEM_CLICK);
                       cc.clickRows&&cc.clickRows(index,cc.data[index]);
                   }
                   methods.countSelected.call(_this,index);
               }
            });
            //点击单元格
            tbody.on('click','td',function (e) {
                var that = this,
                    $this  =  $(that),
                    editorTd =  $.data(_this, "editorTd"),
                    index  =  $this.index(),
                    tid = $this.parents('tr').data('index'),
                    field = $this.data('field'),
                    editor = cols[index]['editor'],
                    isSameTd = editorTd?tid === editorTd.tid && field === editorTd.field:false;

                if(!isSameTd){
                    methods.handleEditorChange.call(_this);
                    //单元格编辑
                    if(editor){
                        var editType = editor.type?editor.type:editor,
                            text = $this.find(ELEM_CELL+' span').html();

                        $.data(_this,'editorTd',{
                            elem:$this,
                            tid:tid,
                            tdid:index,
                            field:field,
                            type:editType
                        });

                        if(editType === 'text'){
                            var input = $('<input class = "layui-input '+ELEM_EDIT+'"/>');
                            $this.append(input);
                            input.val(text).focus();
                        }else if(editType === 'select'){
                            var  select = $('<select name="'+field+'"></select>');
                            $this.append(select);
                            var params=$.extend({},{show:true,value:c['data'][tid][field]},editor);
                            select.select(params);
                        }else if(editType === 'checkbox'){

                        }else if(editType === 'date'){
                            var  input = $('<input class = "layui-input '+ELEM_EDIT+'" readonly  id = "table_edit_date"/>');
                            $this.append(input);

                            laydate.render({
                                elem: '#table_edit_date',
                                value:text ,
                                btns: ['now', 'confirm']
                            });
                            input.focus();
                        }else{
                            throw Error('暂不支持的编辑类型！');
                        }

                        return false;
                    }
                }else{
                    return false;
                }

            });

            $(document).on('click',':not('+c.view+')',function(){
                methods.handleEditorChange.call(_this);
                return;
            })

            $(window).on('resize',function () {
                clearTimeout(_this.timmer);

                tbody.css('overflow','hidden');

                methods.initStyle.call(_this);

                _this.timmer=setTimeout(function () {
                    tbody.css('overflow','auto');
                    methods.scrollPatch.call(_this,true);
                },300);
            })

        },
        //处理单元格更改
        handleEditorChange:function(){
            var _this = this,
                editorTd =  $.data(_this, "editorTd"),
                c  =  $.data(_this, "datagrid"),
                cols = c.cols;

                if(editorTd){
                    var old = editorTd.elem.find(ELEM_CELL),
                        tid=editorTd.tid,
                        tdid=editorTd.tdid,
                        field=editorTd.field;
                    if(c['data'][tid]===undefined)return ;

                   var _new =editorTd.type==='select'? editorTd.elem.find('select'):editorTd.elem.find('.'+ELEM_EDIT),
                    _text=editorTd.type==='select'?editorTd.elem.find('.layui-form-select input').val():_new.val(),
                    _old_value= c['data'][tid][field],
                    _value = _new.val();

                if(_value!=_old_value){
                    if(cols[tdid]['formatter']){
                        _text = cols[tdid]['formatter'](_text);
                    }
                    old.find('span').html(_text);
                    if(old.hasClass('tooltip')){
                        old.data('options','{content:\''+_text+'\',position:\'top\'}');
                    }
                    c['data'][editorTd.tid][field] = _value;
                    c.editor && c.editor.call(editorTd.elem,_text,c['data'][tid],field);

                    $.data(_this, "datagrid",c);
                }
                var siblings=old.siblings();
                    siblings.addClass(HIDE);
                setTimeout(function () {
                    siblings.remove();
                },250)
                $('.layui-laydate').remove();
                $.removeData(_this,'editorTd');
            }
        },
        //处理行选中事件
        countSelected:function(index,type){
            var _this = this,
                cc  =  $.data(_this, "datagrid"),
                header  =  $(cc.view).find('.'+ELEM_HEADER),
                selected = cc.selectIndex;
            if(type){
                for (var i  =  0, len  =  selected.length; i < len; i++) {
                    if (selected[i] === index) {
                        selected.splice(i, 1);
                        break;
                    }
                }
            }else{
                if (cc.singleSelect) {
                    selected = [index];
                }else{
                    selected.push(index);
                }
            }
            if(selected.length==cc.data.length){
                header.find('.'+CHECK_BOX).addClass(CHECKED_BOX)
            }else{
                header.find('.'+CHECK_BOX).removeClass(CHECKED_BOX)
            }
            cc.selectIndex = selected;
            $.data(_this, "datagrid",cc);
        },
        //获取设定样式
        getCssRule: function(field, callback){
            var that  =  this
                ,c  =  $.data(that, "datagrid")
                ,style  =  $('#layui_table_'+c.index).find('style')[0]
                ,sheet  =  style.sheet || style.styleSheet || {}
                ,rules  =  sheet.cssRules || sheet.rules;
            $.each(c.columns,function (j,v) {
                $.each(v,function (ii,vv) {
                    if(vv.field===field){
                        $.each(rules, function(i, item){
                            if(item.selectorText === ('#layui_table_'+c.index+' .laytable-cell-'+ ii +'-'+ field)){
                                return callback(item), true;
                            }
                        });
                    }
                });
            })
        },
        //滚动条补丁
        scrollPatch:function(resize){
            var _this = this.length===undefined?this:this[0],
                c  =  $.data(_this, "datagrid"),
                table =  $(c.view),
                header  =  table.find('.' + ELEM_HEADER),
                main  =  table.find('.' + ELEM_MAIN)
                ,scollWidth  =  main.width() - main.prop('clientWidth') //纵向滚动条宽度
                ,scollHeight  =  main.height() - main.prop('clientHeight') //横向滚动条高度
                ,getScrollWidth  =  methods.getScrollWidth(main[0]) //获取主容器滚动条宽度，如果有的话
                ,outWidth  =  main.find('table').width()-main.width(); //表格内容器的超出宽度

            //如果存在自动列宽，则要保证绝对填充满，并且不能出现横向滚动条
            if(c.autoColNums && outWidth >0 && (resize || !c.scrollPatchWStatus)){
                var th  =  header.eq(0).find('thead tr:last-child th:last-child'),

                    cutWidth =  getScrollWidth>0?(getScrollWidth-outWidth):(getScrollWidth+outWidth),
                    _field = th.data('field');
                methods.getCssRule.call(_this,_field, function(item){
                    var width  =  item.style.width || th.outerWidth();
                    item.style.width  =  Math.floor(parseFloat(width) - cutWidth) + 'px';
                    //二次校验，如果仍然出现横向滚动条
                    if(main.height() - main.prop('clientHeight') > 0){
                        item.style.width  =  parseFloat(item.style.width) - 1 + 'px';
                    }
                    c.scrollPatchWStatus  =  true;
                });
            }
            if(scollWidth && scollHeight){
                if(!header.find('.layui-table-patch')[0]){
                    var patchElem  =  $('<th class = "layui-table-patch"><div class = "layui-table-cell"></div></th>'); //补丁元素
                    patchElem.find('div').css({
                        width: scollWidth
                    });
                    header.eq(0).find('thead tr').append(patchElem)
                }
            } else {
                header.eq(0).find('.layui-table-patch').remove();
            }

            //固定列区域高度
            // var mainHeight  =  main.height()
            //     ,fixHeight  =  mainHeight - scollHeight;
            // table.find('.'+ELEM_FIXED+' .'+ELEM_BODY).css('height', main.find('table').height() > fixHeight ? fixHeight : 'auto');

            //表格宽度小于容器宽度时，隐藏固定列
            table.find('.'+ELEM_FIXR)[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE);

            //操作栏
            table.find('.'+ELEM_FIXR).css('right', scollWidth - 1);

            $.data(_this, "datagrid",c);

            table.find(ELEM_CELL).each(function (index,item) {
                var that=$(this)
                    ,span=that.children('span');
                if(that.width()<span.outerWidth()){
                    that.addClass('tooltip').attr('data-options','{content:\''+span.eq(0).text()+'\',position:\'top\'}');
                }else{
                    that.removeClass('tooltip');
                }
            });
            table.find('.tooltip').eq(0).tooltip()
        },
        //获取滚动条宽度
        getScrollWidth:function(elem){
            var width  =  0;
            if(elem){
                width  =  elem.offsetWidth - elem.clientWidth;
            } else {
                elem  =  document.createElement('div');
                elem.style.width  =  '100px';
                elem.style.height  =  '100px';
                elem.style.overflowY  =  'scroll';

                document.body.appendChild(elem);
                width  =  elem.offsetWidth - elem.clientWidth;
                document.body.removeChild(elem);
            }
            return width;
        },
        //获取选中行数据
        getSelected: function () {
            var c =  $.data(this[0], "datagrid"),selected;
            if(c != undefined){
                selected = c.selectIndex;
            }else{
                throw Error(this[0]+"不是datagrid");
                return ;
            }
            var data = [];
            if(selected.length>0){
                selected = selected.sort();
                for(var i = 0,len = c.data;i<len;i++){
                    if(selected.indexOf(i)>-1){
                        data.push(c.data[i]);
                    }
                }
                $.each(c.data,function (i,d) {
                    if(selected.indexOf(i)>-1){
                        data.push(c.data[i]);
                    }
                })
            }
            return c.singleSelect?data[0]:data;
        },
        //获取表格参数
        getSetting:function (item) {
            var c = $.data(this[0], "datagrid");
            return  typeof item==='string'?c[item]:c;
        },
        //重新加载
        reload:function (opt) {
            opt = opt||{};
            var _this = this[0],
                c = $.data(_this, "datagrid");
            c = $.extend(true,c,opt);
            $.data(_this, "datagrid",c);
            methods.getData.call(_this);
        },
        delRow:function(index){
            var _this = this[0],
                c = $.data(_this, "datagrid"),
                table =  $(c.view),
                tbody = table.find('.'+ELEM_BODY);

            c.data.splice(index, 1);

            $.data(_this, "datagrid",c);

            tbody.each(function (i,item) {
                $(item).find('tr').eq(index).remove();
            });
        },
        addRow: function (rowData) {
            var _this = this[0],
                c = $.data(_this, "datagrid");

            rowData = rowData || {};

            c.data.push(rowData);

            $.data(_this, "datagrid",c);

            methods.initBody.call(_this,true,true);
        }
    };
    //在插件中使用对象
    $.fn.datagrid  =  function (options) {
        var method  =  arguments[0];
        if (methods[method]) {
            method  =  methods[method];
            arguments  =  Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method  =  methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.datagrid');
            return this;
        }
        return method.apply(this, arguments);
    }

    $(document).find('.'+ELEM).each(function (i,v) {
        $(v).datagrid()
    });
    exports('datagrid');
});