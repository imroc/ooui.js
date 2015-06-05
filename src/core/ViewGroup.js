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
