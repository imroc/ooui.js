var OOUI = {};

/**
 * 所有可视组件的父类
 * parameters = {
 *  tagName : <string>,
 *  id : <string>,
 *  style : {
 *      ......
 *  }
 * }
 * @constructor
 */
OOUI.View = function(parameters){
    /**
     * 代表可视组件的div元素
     * @type {HTMLElement}
     * @public
     */
    this.dom = null;
    var style;
    if(parameters){
        //创建dom
        var tagName = parameters.tagName,
            id = parameters.id;
            style = parameters.style;
        if(parameters.tagName){
            this.dom = document.createElement(tagName);
        }else if(parameters.id){
            this.dom = document.getElementById(id);
        }else{
            this.dom = document.createElement("div");
        }
    }else{
        this.dom = document.createElement("div");
    }


    /**
     * 可视组件的样式，由于经常用，作个快捷引用
     * @type {CSSStyleDeclaration}
     * @protected
     */
    this._style = this.dom.style;

    if(style){
        this.putStyle(style);
    }


    //节点与相应对象双向绑定
    this.dom.obj = this;

    //禁止拖拽
    this.dom.draggable = false;
    this.dom.ondragstart = function(event){
        return false;
    };

     //屏蔽浏览器右键
    this.dom.addEventListener("contextmenu",function(event){
        event.preventDefault();
    },false);




    //TODO 测试代码,开启即可将全部组件加随机颜色的边框以便测试观察
    //this._style.borderWidth = "1px";
    //this._style.borderStyle = "solid";
    //this._style.borderColor = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";

    //禁止选中
    this.putStyle({
        "webkitUserSelect" : "none",
        "mozUserSelect" : "none",
        "msUserSelect" : "none",
        "userSelect" : "none",
        "margin" : "0",
        "padding" : "0"
    });

    /**
     * 父容器
     * @type {Object}
     * @protected
     */
    this._parent = null;
}

OOUI.View.prototype = {

    constructor : OOUI.View,

    /**
     * 通过json数据设置一堆样式
     * @param {Object} style  样式的json对象
     * @method
     */
    putStyle : function(style){
        for(var styleName in style){
            this._style[styleName] = style[styleName];
        }
    },



    /**
     * 返回该可视组件的宽度
     * @returns {number}
     */
    getWidth : function(){
        return this.dom.clientWidth;
    },


    /**
     * 返回该可视组件的高度
     * @returns {number}
     * @method
     */
    getHeight : function(){
        return this.dom.clientHeight;
    },


    /**
     * 设置父容器
     * @param {Object} parent
     * @method
     */
    setParent : function(parent){
        this._parent = parent;
        parent.dom.appendChild(this.dom);
        this.onSetParent();
    },

    /**
     * 自身一旦被添加进父容器即触发该事件
     * @abstract
     * @method
     */
    onSetParent : function(){},

    /**
     * 返回父容器对象
     * @returns {Object}
     * @method
     */
    getParent : function(){
        return this._parent;
    },

    /**
     * 返回父容器的宽度
     * @returns {number}
     * @method
     */
    getParentWidth : function(){
        return this.dom.parentNode.style.clientWidth;
    },

    /**
     * 返回父容器的高度
     * @returns {number}
     * @method
     */
    getParentHeight : function(){
        return this.dom.parentNode.style.clientHeight;
    },

    /**
     * 更新自身显示，需要子类根据自身情况去实现
     * @abstract
     * @method
     */
    updateView : function(){},

    /**
     * 组件自身清除
     * @method
     */
    removeSelf : function(){
        this.dom.parentNode.removeChild(this.dom);
        if(this._parent){
            this._parent.removeChild(this);
        }
    },

    /**
     * 隐藏元素
     * @method
     */
    hide : function(){
        this._style.visibility = "hidden";
    },

    /**
     * 显示元素
     * @method
     */
    show : function(){
        this._style.visibility = "visible";
    },

    /**
     * 查询自身是否可见
     * @returns {boolean}
     * @method
     */
    isVisible : function(){
        var visibility = this._style.visibility;
        if(visibility=="hidden"){
            return false;
        }else{
            return true;
        }
    },

    /**
     * 不可见的变为可见，可见的变为不可见
     * @method
     */
    toggleVisibility : function(){
        if(this.isVisible()){
            this.hide();
        }else{
            this.show();
        }
    },

    /**
     * 将该元素全屏
     * @method
     */
    fullscreen : function(){
        var dom = this.dom;
        if(dom.requestFullscreen) {
            dom.requestFullscreen();
        } else if(dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if(dom.webkitRequestFullscreen) {
            dom.webkitRequestFullscreen();
        } else if(dom.msRequestFullscreen) {
            dom.msRequestFullscreen();
        }
    }

}

