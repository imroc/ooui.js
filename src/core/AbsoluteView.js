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



