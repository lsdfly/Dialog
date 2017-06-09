/*弹出层内容注入js说明
*注入的js模块写法参照amd 规范
*该模块对外服务,必须暴露data方法
*data方法有参数是外部为模块内部提供数据(数据可用来填充大弹出层内容)
*data没有参数模块会收集弹出层信息比返回给外部(用来返回弹出层里面的表单内容)
*/
define([
    'jquery'
], function($) {
    'use strict';
   
    return {
        data: function(res) {
            
            if (!!res) {
                //给弹出层设置值
                $('input').val(res);
               
            } else {
                //收集信息返回
                return $("#text").val();
            }

        }
    };
});