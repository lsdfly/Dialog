/**
 @Name :  v1.0 弹层组件
 @Author: 

 */
if(!window.console){
  if(window.App&&window.App.log){
    window.console = {
        log:App.log
    }      
  }else{
     window.console = {
       log:function(){}
    };
  } 
}

;
(function(factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        window.Dialog = factory();
    }
})(function() {

    var util = {
        isMobile: function() {
            var device = navigator.platform + '---' + navigator.userAgent;
            var lDev = device.toLowerCase(),
                mReg = lDev.match(/(iphone|ipod|ipad|android|ios|windows phone)/i);
            return mReg;
        },
        loadCss: function(urls) {
            App.loadCss(urls);
            // typeof urls === 'string' && (urls = [urls]); //支持多个组成的数组或单个的字符串

            // var html = []; //,
            // // v = versionFlag ? ('?ver=' + self.version) : '',
            // // cdn = cdnFlag ? self.cdnUrl : '';
            // for (var i = 0, len = urls.length; i < len; i++) {
            //     urls[i] && html.push('<link type="text/css" rel="stylesheet" href="' + urls[i] + '" />');
            // }

            // document.write(html.join(""));
        }
    };

    var $maskDom = null,
         dialogNum = 0;
    var Dialog = function(opt) {

        var self = this;

        if (!(self instanceof Dialog)) {
            return new Dialog(opt);
        }

        var _default = {
            title: '提示', //标题
            classPrefix: '', //添加弹出层class
            zIndex:null,     //弹出层的层级
            // headerHeight: '40px',
            opacity: 0, //透明背景度1-100
            isClose: true, //是否显示右上角关闭按钮
            isBorder: true, //是否显示边框 
            data: {}, //传入数据
            bgScroll: true, //背景滚动
            alwaysCallback:false,//总是回调
            init:null,//初始化调用
            // footerHeight: '40px',
            // theme: 'theme-default', //m-主题
            theme: 'theme-pc', //pc-主题
            content: "", //填充内容
            contentUrl: '', //填充URl 
            width: null, //弹窗宽
            height: null, //弹框高
            top: null, //距离顶部
            left: null, //距离左部
            buttons: [], //按钮数量 传字符串为按钮名称  传对象{type:'',text:''} type为按钮类型 text为名称 type不传有默认
            iframeUrl: '', //iframe URL地址
            cssUrl: '', //css路径
            controllerUrl: '', //注入js地址
            controller: null //注入函数
        };
        self.config = $.extend({}, _default, opt || {});

        self.initView();

    };
    //初始化视图
    Dialog.prototype.initView = function() {
        var self = this;

        self.initMask().initDialog()
            .setHeader()
            .setFooter()
            .bind()
            .setContent()
            .layerSize();
         //当前数量弹出数量
           dialogNum++;
    };
    Dialog.prototype.initMask = function() {

        var self = this;
        if (!$maskDom) {
            $maskDom = $('<div class="ui-dialog-bgModal " ></div>');
            // $maskDom.css();
            $maskDom.css({
                'opacity': self.config.opacity / 100,
                '-moz-opacity': self.config.opacity / 100,
                'khtml-opacity': self.config.opacity / 100,
                'FILTER': 'Alpha(opacity=' + self.config.opacity + ')'
            });

            $("body").append($maskDom);
        } else {
            $maskDom.show();
        }
        if(self.config.zIndex!=null){
            $maskDom.css('z-index',self.config.zIndex-1);
        }

        return self;
    }
    Dialog.prototype.bind = function() {
        var self = this;
        self.$Dom.find(".ui-dialog-footer button")
            .on("click", function() {
                var _index = $(this).index(),
                    data = null;
                //传入当前按钮索引，可以用来判断 按钮要不要验证等
                self.config.data.index = _index;


                //如果注入了js,则去模块取数据
                if (self.module && self.module.data) {
                    data = self.module.data(self.config.data);
                } else {
                    data = self.config.controller && self.config.controller();
                }
                //如果是false，表示校验不通过
                if(!self.config.alwaysCallback&&data==false){
                   return false;
                }
                //如果有回调函数
                if (self.callback) {
                    //如果回调函数返回真则关闭弹框，返回函数返回按钮索引，数据
                    if (self.callback(_index, data)) {
                        self.closeDialog();
                    }
                } else {
                    //没有回调函数。默认关闭弹框
                    self.closeDialog();
                };
            });
        self.$Dom.find(".ui-dialog-close").on('click', function() {
            self.closeDialog();
        });

        return self;
    }
    Dialog.prototype.closeDialog = function() {
            var self = this;

            if (!self.config.bgScroll) {
                //恢复页面滚动
                $("body").css({
                    'overflow-y': 'auto',
                    'position': 'static'
                }).scrollTop(self.top);

            }
            dialogNum--;
            self.$wrapDom.remove();
            if(dialogNum==0){
                $maskDom.hide();
            }

            return self;
        }
        //设置框
    Dialog.prototype.initDialog = function() {
            //<div class="ui-dialog-centerWrap"><i></i></div>
            var self = this,
                _platform = util.isMobile() ? "m-dialog" : "pc-dialog",
                _body = ['<div  class="ui-dialog ' + _platform + ' ' + self.config.classPrefix + '">',
                    '<div class="ui-dialog-title ' + self.config.theme + '"></div>',
                    '<div class="ui-dialog-body mulit_line"></div>',
                    '<div class="ui-dialog-footer"></div>',
                    '</div>'
                ].join('');
            self.$wrapDom = $('<div class="ui-dialog-centerWrap"><i></i>' + _body + '</div>');
            if(self.config.zIndex!=null){
                self.$wrapDom.css('z-index',self.config.zIndex);
            }

            //设置不能混动背景后页
            if (!self.config.bgScroll) {
                self.top = $("body").scrollTop();
                $("body").css({
                    'overflow-y': 'hidden',
                    'position': 'fixed',
                    'top': self.top * -1
                });

            }


            $('body').append(self.$wrapDom);
            self.$Dom = self.$wrapDom.find('.ui-dialog');

            return self;
        }
        //设置头部
    Dialog.prototype.setHeader = function() {
            var self = this;
            // var _header=""
            var _tag = "";
            if (self.config.isClose) {
                _tag = '<span class="ui-dialog-close">×</span>';
            }
            self.$Dom.find('.ui-dialog-title').html(self.config.title + _tag);
            return self;
        }
        //设置头部
    Dialog.prototype.setFooter = function() {

            var self = this,
                buttons = [];
            if (!self.config.buttons[0]) {
                self.$Dom.addClass('no-footer');
                return self;
            }

            for (var i = 0, item; item = self.config.buttons[i++];) {
                if (typeof item == "string") {
                    // buttons.push('<button class="dialog-btn ' + self.config.theme + ' ">' + item + '</button>');
                    buttons.push('<button class="dialog-btn default ">' + item + '</button>');
                } else {
                    if (!item.type) {
                        item.type = 'default';
                    }
                    buttons.push('<button class="dialog-btn ' + item.type + ' ">' + item.text + '</button>');
                }

            }
            var tag = "" + buttons.join('') + "";
            self.$Dom.find('.ui-dialog-footer').html(tag);
            return self;
        }
        //设置内容
    Dialog.prototype.setContent = function() {
            //	var _content="";
            var self = this;
            if (self.config.cssUrl.length > 0) {
                util.loadCss(self.config.cssUrl);
            }
            //是否有内容提供
            if (self.config.content && self.config.content.length > 0) {
                _setContent(self.config.content);
                _injectJS();
            } else if (self.config.contentUrl != "") {
                $.get(self.config.contentUrl)
                    .done(function(res) { //加载
                        _setContent(res);
                        _injectJS();
                    })
            } else if (self.config.iframeUrl != "") {
                _setContent('<object width="100%" type="text/html" standby="正在加载中"  frameborder="no" border="0" class="dialog-iframe"  data="' + self.config.iframeUrl + '"></object>');
            } else {
                console.error("参数缺失");
            }
            //设置框里具体内容
            function _setContent(_content) {
                self.$Dom.find('.ui-dialog-body').html('<div class="ui-dialog-body-content">' + _content + '<i></i></div>');
            }
            //注入js来控制content的行为
            function _injectJS() {
                if (self.config.controllerUrl.length > 0) {
                    //如果是加载外部js控制Dialog框，则用require导入相应的模块，并挂在self.module里面
                    require([self.config.controllerUrl], function(_module) {
                        self.module = _module;
                        if (self.module&&self.module.init) {
                            self.module.init(self.config.data);
                        }

                    });

                } else {
                    self.config.init && self.config.init(self.config.data);
                }
            }

            return self;
        }
        //设置弹窗大小
    Dialog.prototype.layerSize = function() {
        var self = this,
            _width = document.documentElement.clientWidth,
            _height = document.documentElement.clientHeight,
            _setHeight = self.config.height,
            _extHeight = self.config.extHeight ? self.config.extHeight : 0;

        if (_setHeight == 'auto') { //设置自适应高度
            _setHeight = self.$Dom.find('.ui-dialog-body-content').outerHeight(true) +
                (self.$Dom.find('.ui-dialog-body').outerHeight(true) - self.$Dom.find('.ui-dialog-body').height()) +
                self.$Dom.find('.ui-dialog-title').outerHeight(true) +
                self.$Dom.find('.ui-dialog-footer').outerHeight(true) + 30 + _extHeight + 'px';
        }
        //设置的弹出框高度大于屏幕的高度，则高度强制设置为屏幕高度
        if(_setHeight && _setHeight.replace('px','')>_height){
            _setHeight = _height + _extHeight + 'px';
        }
        // //先设置高度和宽度，有可能传入的是百分比
        self.$Dom.css({
            width: self.config.width,
            height: _setHeight
        });
        //如果配置了没有边框 或者弹出框的宽度大于或等于窗口宽度的 不显示边框
        if (!self.config.isBorder || self.$Dom.width() >= _width || self.config.width == "100%") {

            self.$Dom.addClass('no-border no-border-radius');
        }


        return self;
    }

    return Dialog;

});