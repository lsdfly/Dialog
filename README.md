
PC端移动端通用弹出层
===================================
可配置参数  
-----------------------------------
title: '提示', //标题
classPrefix:'',//添加弹出层class
opacity: 0, //透明背景度1-100
isClose: true, //是否显示右上角关闭按钮
isBorder: true, //是否显示边框 
data: null, //传入数据
bgScroll: true, //背景滚动
theme: 'theme-default', //主题
content: "", //弹出层填充内容
contentUrl: '', //填充模版URl
width: null, //弹窗宽
height: null, //弹框高
top: null, //距离顶部
left: null, //距离左部
buttons: [], //按钮数量 传字符串为按钮名称  传对象{type:'',text:''} type为按钮类型 text为名称 type不传有默认
iframeUrl: '', //iframe URL地址
cssUrl: '', //css路径
controllerUrl: '', //注入js地址
controller: null //注入函数
使用方法  
-----------------------------------
### 初始化
>var d1 = dialog({
>                title: '手机满屏',
>                //  buttons: ["确定", "取消"],buttons可传对象或字符串
>                  buttons: [{type:'',text:'确定'}, {type:'cancel',text:'取消'}],
>                contentUrl: "tp.html",
>                cssUrl: 'css.css',
>                opacity: 50,
>                height: '100%',
>                width: '100%',
>                controllerUrl: 'test.js'
>           });
>            //确定回调,index按钮索引,data回调数据(参照目录下的test.js说明,controller返回值也到data里面)
>            d1.callback = function(index,data) {
>                alert(text)
>                return true;
>            }

