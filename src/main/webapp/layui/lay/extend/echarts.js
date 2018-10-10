layui.define(['jquery'], function (exports) {

    window.$=layui.jquery;

    layui.loadScript(layui.device().basePath+'echarts.common.min.js','layui-echarts',function () {
        exports('echarts');
    });

});