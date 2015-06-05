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
function View(parameters){
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

View.prototype = {

    constructor : View,

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

/**
 * 绝对定位的组件
 * @extends View
 * parameters = {
 *  tagName : <string>,
 *  id : <string>,
 *  style : {
 *      ......
 *  }
 *  positionMode : <int>,
 *  position : {
 *      x:<int>,
 *      y:<int>
 * }
 * @param {Object} parameters 参数
 * @param {number} parameters.positionMode  位置模式，坐标默认表示的是左上角的位置，也可设置成其它的。可选
 * @constructor
 */
function AbsoluteView(parameters){

    View.call(this,parameters);

    //绝对定位，脱离文档流
    this._style.position = "absolute";

    ///**
    // * 横坐标
    // * @type {number}
    // * @protected
    // */
    //this._x = 0;
    ///**
    // * 纵坐标
    // * @type {number}
    // * @protected
    // */
    //this._y = 0;

    /**
     * 横坐标在style中的字符串名字表示，可以是"left"或"right"
     * @type {string}
     * @protected
     */
    this._styleNameX = "";
    /**
     * 纵坐标在style中的字符串名字表示，可以是"top"或"bottom"。
     * @type {string}
     * @protected
     */
    this._styleNameY = "";


    //默认是以左上角为坐标,如果有手动设置就改成对应的位置模式
    if(parameters){
        var positionMode = parameters.positionMode,
            position = parameters.position;
        if(positionMode){
            this.setPositionMode(positionMode);
        }else{
            this.setPositionMode(AbsoluteView.POSITION_MODE_LEFT_TOP);
        }
        if(position){
            this.setPosition(position.x,position.y);
        }
    }else{
        this.setPositionMode(AbsoluteView.POSITION_MODE_LEFT_TOP);
    }

}


AbsoluteView.prototype = Object.create(View.prototype);
AbsoluteView.prototype.constructor = AbsoluteView;

/**
 * 设置坐标模式，坐标代表的点可以为矩形四顶点中任意一个
 * @param mode {number} 代表位置模式常量
 */
AbsoluteView.prototype.setPositionMode = function(mode){
    //清除位置信息
    var style = this._style;
    style.left = style.right = style.top = style.bottom = "";
    //设置坐标对应的style名字
    switch (mode){
        case AbsoluteView.POSITION_MODE_LEFT_TOP:
            this._styleNameX = AbsoluteView.X_NAME_LEFT;
            this._styleNameY = AbsoluteView.Y_NAME_TOP;
            break;
        case AbsoluteView.POSITION_MODE_LEFT_BOTTOM:
            this._styleNameX = AbsoluteView.X_NAME_LEFT;
            this._styleNameY = AbsoluteView.Y_NAME_BOTTOM;
            break;
        case AbsoluteView.POSITION_MODE_RIGHT_TOP:
            this._styleNameX = AbsoluteView.X_NAME_RIGHT;
            this._styleNameY = AbsoluteView.Y_NAME_TOP;
            break;
        case AbsoluteView.POSITION_MODE_RIGHT_BOTTOM:
            this._styleNameX = AbsoluteView.X_NAME_RIGHT;
            this._styleNameY = AbsoluteView.Y_NAME_BOTTOM;
            break;
    }
}

/**
 * 设置该组件的位置
 * @param x {number} X坐标
 * @param y {number} Y坐标
 * @method
 */
AbsoluteView.prototype.setPosition = function (x, y) {
    if(x){
        this._style[this._styleNameX] = x+"px";
    }
    if(y){
        this._style[this._styleNameY] = y+"px";
    }
}


/**
 * 得到X坐标
 * @returns {number}
 * @method
 */
AbsoluteView.prototype.getX = function(){
    var xs = this._style[this._styleNameX];
    if(xs==""){
        return 0;
    }
    return parseInt(xs);
}

/**
 * 得到Y坐标
 * @returns {number}
 * @method
 */
AbsoluteView.prototype.getY = function(){
    var ys = this._style[this._styleNameY];
    if(ys==""){
        return 0;
    }
    return parseInt(ys);
}


/**
 * 位置模式：坐标代表左上角
 * @constant
 * @type {number}
 */
AbsoluteView.POSITION_MODE_LEFT_TOP = 1;
/**
 * 位置模式：坐标代表左下角
 * @constant
 * @type {number}
 */
AbsoluteView.POSITION_MODE_LEFT_BOTTOM = 2;
/**
 * 位置模式：坐标代表右上角
 * @constant
 * @type {number}
 */
AbsoluteView.POSITION_MODE_RIGHT_TOP = 3;
/**
 * 位置模式：坐标代表右下角
 * @constant
 * @type {number}
 */
AbsoluteView.POSITION_MODE_RIGHT_BOTTOM = 4;

/**
 * 横坐标在左边对应style字符串名字
 * @constant
 * @type {string}
 */
AbsoluteView.X_NAME_LEFT = "left";
/**
 * 横坐标在右边对应style字符串名字
 * @constant
 * @type {string}
 */
AbsoluteView.X_NAME_RIGHT = "right";
/**
 * 纵坐标在左边对应style字符串名字
 * @constant
 * @type {string}
 */
AbsoluteView.Y_NAME_TOP = "top";
/**
 * 纵坐标在右边对应style字符串名字
 * @constant
 * @type {string}
 */
AbsoluteView.Y_NAME_BOTTOM = "bottom";



/**
 * 组件容器
 * @extends AbsoluteView
 * parameters = {
 *  tagName : <string>,
 *  id : <string>,
 *  style : {
 *      ......
 *  }
 *  positionMode : <int>,
 *  position : {
 *      x:<int>,
 *      y:<int>
 * }
 *
 * @param {Object} parameters 参数
 * @constructor
 */
function ViewGroup(parameters){

    AbsoluteView.call(this,parameters);

    /**
     * 容器的子元素集合
     * @type {Array}
     * @protected
     */
    this._children = new Array();

}

ViewGroup.prototype = Object.create(AbsoluteView.prototype);
ViewGroup.prototype.constructor = ViewGroup;

/**
 * 添加一个子元素
 * @param child 子元素对象
 */
ViewGroup.prototype.addChild = function(child){
    this._children.push(child);
    if(child.setParent){
        child.setParent(this);
    }else{
        throw "ViewGroup added invalidate child !";
    }
}

/**
 * 删除一个子元素
 * @param child 子元素对象
 */
ViewGroup.prototype.removeChild = function(child){
    var childIndex = -1;
    for(var key in this._children){
        if(this._children[key] === child){
            childIndex = key;
            break;
        }
    }
    if(childIndex != -1){
        this._children.splice(childIndex,1);
    }
};

/**
 * 根据父容器更新自身，需要具体容器类去实现
 * @abstract
 */
ViewGroup.prototype.updateSelf = function(){};


/**
 * 更新子元素
 * @method
 */
ViewGroup.prototype.updateChildren = function(){
    for(var key in this._children){
        this._children[key].updateView();
    }
};


/**
 * 更新自身
 * @override
 */
ViewGroup.prototype.updateView = function(){
    this.updateSelf();
    this.updateChildren();
}
