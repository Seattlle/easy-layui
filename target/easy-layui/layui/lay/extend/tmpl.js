'use static';
layui.define(['laytpl'],function (exports) {
    var tmpl={
            search:'<form class="layui-form _condition" action="" lay-filter="search">' +
                    '<!-- 条件1 -->' +
                    '<div class="layui-form-item">' +
                    '{{# layui.each(d, function(i, item) { }}' +
                    '{{# if (item.type!=\'hidden\'&&item.title.length>0) { }}' +
                    '   {{# if (item.title.length<3) { }}' +
                          '<label class="layui-form-label mini">{{item.title}}</label>' +
                    '   {{# } else{ }}' +
                          '<label class="layui-form-label">{{item.title}}</label>' +
                        '{{# } }}' +
                    '{{# } }}' +
                    '        <div class="layui-input-inline">' +
                    '        {{# if (item.type==\'date\') { }}' +
                    '<input type="text" class="layui-input" autocomplete="off" ' +
                    '               name="{{item.name}}" placeholder="{{item.placeholder||\'\'}}">' +
                    '        {{# } else if (item.type==\'select\') { }}' +
                    '        <select name="{{item.name}}" lay-search' +
                    '{{# if (item.templet) { }} lay-templet="{{ item.templet }}" {{# } }}' +
                    ' data-options="{url:\'../data/select.json\',textField:\'templateName\',valueField:\'id\'}"'+
                    '></select>' +
                    '        {{# } else if (item.type==\'hidden\') { }}' +
                    '<input type="hidden" name="{{item.name}}" value="{{item.value}}">' +
                    '{{# } else { }}' +
                    '<input type="text" class="layui-input" autocomplete="off"' +
                    '   name="{{item.name}}" placeholder="{{item.placeholder||\'\'}}">' +
                    '{{# } }}' +
                    '        </div>' +
                    '        {{# }) }}' +
                    '        <button class="layui-btn" lay-submit lay-filter="search">搜索</button>' +
                    '        <button type="reset" class="layui-btn layui-btn-default">重置</button>' +
                    '</div>' +
                    '</form>',
            dialog:'<div class="pages">' +
                    '    <form class="layui-form" action="" lay-filter="dialog">' +
                    '        {{# layui.each(d, function(i, item) { }}' +
                    '            {{# if (item.type == \'hidden\') { }}' +
                    '                <input type="hidden" name="{{ item.field }}" ' +
                    '                    {{# if (item.value !== undefined) { }} value="{{ item.value }}" {{# } }} />' +
                    '            {{# } else if (item.type == \'text\') { }}' +
                    '                <div class="layui-form-item">' +
                    '                    <label class="layui-form-label">{{item.title}}</label>' +
                    '                    <div class="layui-input-block">' +
                    '                        <input type="text" name="{{item.field}}" ' +
                    '                            {{# if (item.value !== undefined) { }} value="{{ item.value }}" {{# } }}' +
                    '                            {{# if (item.verify) { }} lay-verify="{{item.verify}}" {{# } }}' +
                    '                            {{# if (item.readonly) { }} readonly {{# } }}' +
                    '                            placeholder="请输入{{item.title}}" autocomplete="off" class="layui-input" />' +
                    '                    </div>' +
                    '                </div>' +
                    '            {{# } else if (item.type == \'radio\') { }}' +
                    '                <div class="layui-form-item">' +
                    '                    <label class="layui-form-label">{{item.title}}</label>' +
                    '                    <div class="layui-input-block">' +
                    '                        {{# layui.each(item.values,function(k,v){ }}' +
                    '                            <input type="radio" name="{{item.field}}" value="{{v.value}}" ' +
                    '                            {{# if(item.hvalue && item.hvalue.value==v.value) { }} checked {{# } }}' +
                    '                            title="{{v.title}}">' +
                    '                        {{# }) }}' +
                    '                    </div>' +
                    '              </div>' +
                    '            {{# } else if (item.type == \'checkbox\') { }} ' +
                    '                <div class="layui-form-item">' +
                    '                    <label class="layui-form-label">{{item.title}}</label>' +
                    '                    <div class="layui-input-block">' +
                    '                        {{# layui.each(item.values,function(k,v){ }}' +
                    '                        <input type="checkbox" name="{{v.value}}" title="{{v.title}}"' +
                    '                            {{# layui.each(item.hvalues,function(kk,vv){ }}' +
                    '                                {{# if(v.value==vv.value) { }} checked {{# } }}' +
                    '                            {{# }) }}' +
                    '                        >' +
                    '                        {{# }) }}  ' +
                    '                    </div>' +
                    '              </div>' +
                    '            {{# } else if (item.type == \'select\') { }} ' +
                    '                <div class="layui-form-item">' +
                    '                    <label class="layui-form-label">{{item.title}}</label>' +
                    '                    <div class="layui-input-block">' +
                    '                        <select name="{{item.field}}" lay-search></select>' +
                    '                    </div>' +
                    '              </div>' +
                    '            {{# } else if (item.type == \'textarea\') { }} ' +
                    '                <div class="layui-form-item layui-form-text">' +
                    '                    {{# if(!item.isJustOne){}} <label class="layui-form-label">文本域</label> {{#} }}' +
                    '                    <div class="layui-input-block" {{# if(item.isJustOne){}} style="margin-left: 0" {{#} }} >' +
                    '                        <textarea name="{{ item.field }}" placeholder="请输入内容" class="layui-textarea"' +
                    '                            {{# if(item.isJustOne){}} style="height: {{item.height}}" {{#}}}' +
                    '                        ></textarea>' +
                    '                    </div>' +
                    '              </div>' +
                    '            {{# } else if (item.type == \'search\') { }}' +
                    '            <div class="layui-form-item">' +
                    '            <label class="layui-form-label">{{item.title}}</label>' +
                    '            <div class="layui-input-block _search">' +
                    '                        <input type="text" name="{{item.field}}" placeholder="请输入{{item.title}}" autocomplete="off" class="layui-input"' +
                    '                            {{# if (item.value !== undefined) { }} value="{{ item.value }}" {{# } }}' +
                    '                            {{# if (item.verify) { }} lay-verify="{{item.verify}}" {{# } }}' +
                    '                            {{# if (item.readonly) { }} readonly {{# } }}' +
                    '                        />' +
                    '                        <i class="layui-icon" ' +
                    '                        {{# if (item.jsMethodName) { }} event="click" methodName="{{item.jsMethodName}}" {{# } }} ' +
                    '                        >&#xe615;</i>' +
                    '                    </div>' +
                    '            </div>' +
                    '            {{# } }}' +
                    '        {{# }) }}' +
                    '        <input type="hidden" lay-submit lay-filter="save" >    <!-- 保存 -->' +
                    '    </form>' +
                    '</div>',
            menu:'<!-- 操作按钮 -->' +
                    '<blockquote class="layui-elem-quote">' +
                    '{{# layui.each(d, function(i, item) { }}' +
                    '<button class="layui-btn {{item.class||item.className||\'layui-btn-default\'}}" ' +
                    'event="{{item.event || \'click\'}}" ' +
                    'methodName="{{item.jsMethodName}}"' +
                    '>' +
                    '{{# if (item.buttonIcon) { }}<i class="layui-icon">{{item.buttonIcon}}</i>{{# } }}{{item.name}}</button>' +
                    '    {{# }) }}' +
                    '</blockquote>',
            codeDialog:'<div lay-filter=\'codeDialog\' style="padding: 0 10px;">' +
                    '<div id="rowBottom">' +
                    '    <div class="_h3 layui-row" style="text-align: right;">' +
                    '    <button class="layui-btn layui-btn-xs" style="margin-right: 20px;" event="click" methodname="addRow">新增参数</button>' +
                    '    </div>' +
                    '    <hr class="layui-bg-green">' +
                    '</div>' +
                    '<div id="grid" lay-filter="grid"></div>' +
                    '</div>',
            dialogSt:'<style>' +
            '.dialog-st {' +
            'padding: 10px 10px 0;' +
            '}' +
            '.dialog-st .layui-elem-quote {' +
            'padding: 10px;' +
            '}' +
            '.dialog-st .layui-form-item {' +
            'margin-bottom: 10px;' +
            '}' +
            '.dialog-st .layui-form-label {' +
            'width: auto;' +
            'padding: 4px 9px;' +
            '}' +
            '.dialog-st .layui-input {' +
            'height: 30px;' +
            '}' +
            '</style>' +
            '<div class="dialog-st" lay-filter="dialog-st">' +
            '{{# if (d.searchs) { }}' +
            '    <form class="layui-form" action="" lay-filter="dialog">' +
            '    <div class="layui-form-item">' +
            '        {{# layui.each(d.searchs.conditions, function(i, item) { }}' +
            '<label class="layui-form-label">{{item.title}}</label>' +
            '        <div class="layui-input-inline">' +
            '            <input type="text" name="{{item.name}}" autocomplete="off" placeholder="{{item.placeholder||\'\'}}" class="layui-input">' +
            '        </div>' +
            '    {{# }) }}' +
            '    {{# if (d.searchs.reset) { }}' +
            '    <button type="reset" class="layui-btn layui-btn-sm layui-btn-default">重置</button>' +
            '    {{# } }}' +
            '        <button class="layui-btn layui-btn-sm" lay-submit lay-filter="search-st">搜索</button>' +
            '    </div>' +
            '    </form>' +
            '    {{# } }}' +
            '    ' +
            '{{# if (d.menus) { }}' +
            '    <blockquote class="layui-elem-quote">' +
            '{{# layui.each(d.menus, function(i, item) { }}' +
            '<button class="layui-btn layui-btn-sm {{item.class||\'layui-btn-default\'}}" ' +
            'event="click" methodName="{{item.jsMethodName}}">' +
            '{{# if (item.buttonIcon) { }}' +
            '<i class="layui-icon">{{item.buttonIcon}}</i>{{# } }}{{item.name}}</button>' +
            '    {{# }) }}' +
            '</blockquote>' +
            '    {{# } }}' +
            '    ' +
            '{{# if (d.tables) { }}' +
            '    <div id="st_tables"></div>' +
            '    {{# } }}' +
            '</div>' +
            '<script>' +
            'var st_data = {};' +
            '' +
            '{{# if (d.tables.url) { }} ' +
            'st_data.url = \'{{d.tables.url}}\';' +
            '{{# } }}' +
            '{{# if (d.tables.columns) { }}  ' +
            'st_data.columns = JSON.parse(\'{{ JSON.stringify(d.tables.columns) }}\'); ' +
            '{{# } }}' +
            '{{# if (d.tables.height) { }} ' +
            'st_data.height = \'{{d.tables.height}}\';' +
            '{{# } }}' +
            '' +
            'st_data.init = function() {' +
            'this.setTable();' +
            '};' +
            '' +
            'st_data.setTable = function(data) {' +
            'layui.use(\'tableUtils\', function(tableUtils){' +
            'var tableUtils = layui.tableUtils;' +
            'tableUtils.table({' +
            '                elem: \'#st_tables\',' +
            '                url: layui.utils.config.ajaxPath + st_data.url,' +
            '                cols: st_data.columns,' +
            '                height: st_data.height || 200,' +
            '                where: data || {}' +
            '            })' +
            '});' +
            '};' +
            '' +
            'form.on(\'submit(search-st)\', function(data) {' +
            'st_data.setTable(data.field);' +
            'return false;' +
            '});' +
            '' +
            'st_data.init();' +
            '</script>'
    }

    exports('tmpl', tmpl);
});