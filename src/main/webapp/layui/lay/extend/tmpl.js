'use static';
layui.define([],function (exports) {

    var tmpl= {
        search: '<form class="layui-form _condition" action="">' +
        '<!-- 条件1 -->' +
        '<div class="layui-form-item">' +
        '       {{~it:item:i }}' +
        '{{?  item.type!=\'hidden\' && item.title.length>0 }}' +
        '   {{? item.title.length<3 }}' +
        '<label class="layui-form-label mini">{{=item.title}}</label>' +
        '   {{??}}' +
        '<label class="layui-form-label">{{=item.title}}</label>' +
        '{{?}}' +
        '{{?}}' +
        '        <div class="layui-input-inline _search">' +
        '        {{? item.type==\'date\' }}' +
        '           <input type="text" class="layui-input layui-date" autocomplete="off" name="{{=item.name}}" placeholder="{{=item.placeholder||\'\'}}">' +
        '           <i class="layui-icon">&#xe637;</i>' +
        '        {{?? item.type==\'select\' }}' +
        '        <select name="{{=item.name}}" lay-search {{? item.templet }} lay-templet="{{=item.templet }}" {{? }} data-options="{{=item.options}}"></select>' +
        '        {{?? item.type==\'hidden\'}}' +
        '<input type="hidden" name="{{=item.name}}" value="{{=item.value}}">' +
        '{{??}}' +
        '<input type="text" class="layui-input" autocomplete="off"' +
        '   name="{{=item.name}}" placeholder="{{=item.placeholder||\'\'}}">' +
        '{{? }}' +
        '        </div>' +
        '        {{~ }}' +
        '        <button class="layui-btn" lay-submit lay-filter="search">搜索</button>' +
        '        <button type="reset" class="layui-btn layui-btn-default">重置</button>' +
        '</div>' +
        '</form>',
        dialog: '<div class="pages">' +
        '    <form class="layui-form" action="">' +
        '       {{~it:item:i }}' +
        '           {{? item.type == \'hidden\' }}' +
        '                <input type="hidden" name="{{=item.field }}" value="{{=item.value||\'\' }}" />' +
        '           {{?? item.type == \'text\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                        <input type="text" name="{{=item.field}}" ' +
        '                            {{? item.value !== undefined }} value="{{=item.value }}" {{? }}' +
        '                            {{? item.verify }} lay-verify="{{=item.verify}}" {{? }}' +
        '                            {{? item.readonly }}  readonly {{? }}' +
        '                            placeholder="请输入{{=item.title}}" autocomplete="off" class="layui-input" ' +
        '                            {{? item.id }} id="{{=item.id}}" {{?}}/>' +
        '                    </div>' +
        '                </div>' +
        '           {{?? item.type == \'file\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                         <a href="javascript:;" class="layui-btn layui-upload"  data-options="{name:\'{{=item.field}}\'}">' +
        '                            <i class="layui-icon">&#xe67c;</i>选择文件' +
        '                         </a>' +
        '                    </div>' +
        '                </div>' +
        '           {{?? item.type == \'files\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                       <div class="layui-upload2" id="{{=item.field}}">' +
        '                           <input type="hidden" class="{{=item.field}}" name="{{=item.field}}" value="{{=item.value||\'\'}}"/>' +
        '                   </div>' +
        '                    </div>' +
        '                </div>' +
        '           {{?? item.type == \'password\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                        <input type="password" name="{{=item.field}}" value="{{=item.value||\'\' }}" ' +
        '                            {{? item.verify }} lay-verify="{{=item.verify}}" {{? }}' +
        '                            {{? item.readonly }}  readonly {{? }}' +
        '                            placeholder="请输入{{=item.title}}" autocomplete="off" class="layui-input" ' +
        '                            {{? item.id }} id="{{=item.id}}" {{?}}/>' +
        '                    </div>' +
        '                </div>' +
        '            {{?? item.type == \'date\' }}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block _search">' +
        '                        <input type="text"  id="{{=item.id||\'\'}}" name="{{=item.field||\'\'}}" ' +
        '                            {{? item.value !== undefined }} value="{{=item.value }}" {{? }}' +
        '                            {{? item.verify }} lay-verify="{{=item.verify}}" {{? }}' +
        '                            {{? item.readonly }} readonly {{? }}' +
        '                             autocomplete="off" class="layui-input layui-date" />' +
        '                        <i class="layui-icon">&#xe637;</i>' +
        '                    </div>' +
        '                </div>' +
        '            {{?? item.type == \'radio\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                        {{  for(var v in item.values){}}' +
        '                            <input type="radio" name="{{=item.field||\'\'}}" value="{{=item.values[v].value}}" ' +
        '                            {{? item.hvalue && item.hvalue==item.values[v].value }} checked {{? }}' +
        '                            title="{{=item.values[v].title}}">' +
        '                        {{ } }}' +
        '                    </div>' +
        '              </div>' +
        '            {{?? item.type == \'cascader\'}}' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                            <input type="text" name="{{=item.field||\'\'}}"  class="layui-cascader"' +
        '                            {{? item.readonly }}  readonly {{? }}' +
        '                            {{? item.verify }} lay-verify="{{=item.verify}}" {{? }}' +
        '                            value="{{=item.value||\'\'}}"  data-options="{{=item.options||\'\'}}"> ' +
        '                    </div>' +
        '              </div>' +
        '            {{?? item.type == \'checkbox\'}} ' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                        {{ for(var v in item.values){}}' +
        '                        <input type="checkbox" name="{{=item.values[v].value}}" title="{{=item.values[v].title}}"' +
        '                            {{ for(var kk in item.hvalues){}}' +
        '                                {{? item.values[v].value==item.hvalues[kk].value }} checked {{?}}' +
        '                            {{} }}' +
        '                        >' +
        '                        {{}}}' +
        '                    </div>' +
        '              </div>' +
        '            {{?? item.type == \'select\'}} ' +
        '                <div class="layui-form-item">' +
        '                    <label class="layui-form-label">{{=item.title}}</label>' +
        '                    <div class="layui-input-block">' +
        '                        <select name="{{=item.field||\'\'}}" lay-search data-value="{{=item.value||\'\'}}"' +
        '                            {{? item.readonly }}  readonly {{? }}' +
        '                            {{? item.verify }}  lay-verify="{{=item.verify}}" {{? }}' +
        '                            data-options="{{=item.options||\'\'}}"' +
        '                            {{? item.id }} id="{{=item.id}}" {{?}}/>' +
        '                       </select>' +
        '                    </div>' +
        '              </div>' +
        '            {{?? item.type == \'textarea\'}} ' +
        '                <div class="layui-form-item layui-form-text">' +
        '                    {{? !item.isJustOne}} <label class="layui-form-label">{{=item.title}}</label> {{?}}' +
        '                    <div class="layui-input-block" {{? item.isJustOne }} style="margin-left: 0" {{? }} >' +
        '                        <textarea  id="{{=item.id||\'\'}}" name="{{=item.field||\'\' }}" placeholder="请输入内容" class="layui-textarea"' +
        '                            {{? item.isJustOne }} style="height: {{=item.height}}" {{? }}' +
        '                            {{? item.readonly}}  readonly {{? }}' +
        '                        >{{=item.value||"" }}</textarea>' +
        '                    </div>' +
        '              </div>' +
        '            {{?? item.type == \'search\'}}' +
        '            <div class="layui-form-item">' +
        '            <label class="layui-form-label">{{=item.title}}</label>' +
        '            <div class="layui-input-block _search">' +
        '                        <input type="text" name="{{=item.field}}" placeholder="请输入{{=item.title}}" autocomplete="off" class="layui-input"' +
        '                            {{? item.value !== undefined}} value="{{=item.value }}" {{? }}' +
        '                            {{? item.verify }} lay-verify="{{=item.verify}}" {{? }}' +
        '                            {{? item.readonly }} readonly {{? }}' +
        '                        />' +
        '                        <i class="layui-icon" ' +
        '                        {{? item.event }}  onclick="{{=item.event}}(this)" {{? }} ' +
        '                        >&#xe615;</i>' +
        '                    </div>' +
        '            </div>' +
        '            {{? }}' +
        '        {{~}}' +
        '    </form>' +
        '</div>',
        menu: '<!-- 操作按钮 -->' +
        '<blockquote class="layui-elem-quote">' +
        '       {{~it:item:i }}' +
        '{{? item.jsMethodName }}' +
        '<button class="layui-btn {{=item.class||item.className||\'layui-btn-default\'}}" ' +
        'event="{{=item.event || \'click\'}}" ' +
        'methodName="{{=item.jsMethodName}}"' +
        '>' +
        '{{? item.buttonIcon }}<i class="layui-icon">{{=item.buttonIcon}}</i>{{? }}{{=item.name}}</button>' +
        '{{?}}' +
        '    {{~ }}' +
        '</blockquote>',
        codeDialog: '<div lay-filter=\'codeDialog\' style="padding: 0 10px;">' +
        '<div id="rowBottom">' +
        '    <div class="_h3 layui-row" style="text-align: right;">' +
        '    <button class="layui-btn layui-btn-xs" style="margin-right: 20px;" event="click" methodname="addRow">新增参数</button>' +
        '    </div>' +
        '    <hr class="layui-bg-green">' +
        '</div>' +
        '<div id="grid" lay-filter="grid"></div>' +
        '</div>',
    }

    window.tmpl=tmpl;

    exports('tmpl', tmpl);
});