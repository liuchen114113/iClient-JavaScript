/**
 * @class ol.supermap.MapvCanvasLayer
 * @classdesc Mapv渲染器。
 * @private
 * @param {Object} options - 参数。<br>
 * @param {string} options.paneName - 窗口名。<br>
 * @param {string} options.context - 内容。<br>
 * @param {number} options.zIndex - 层级。<br>
 * @param {number} options.width - 画布宽。<br>
 * @param {number} options.height - 画布高。<br>
 * @param {string} options.mixBlendMode - 最小混合模式。
 */
export class MapvCanvasLayer {

    constructor(options) {
        this.options = options || {};
        this.enableMassClear = this.options.enableMassClear;
        this._map = options.map;
        this.paneName = this.options.paneName || 'mapPane';
        this.context = this.options.context || '2d';
        this.zIndex = this.options.zIndex || 2;
        this.mixBlendMode = this.options.mixBlendMode || null;
        this.width = options.width;
        this.height = options.height;
        this.initialize();
    }

    initialize() {
        var me = this;
        var canvas = me.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + me.zIndex + ";user-select:none;";
        canvas.style.mixBlendMode = me.mixBlendMode;
        canvas.className = "mapvClass";
        var global$2 = typeof window === 'undefined' ? {} : window;
        var devicePixelRatio = me.devicePixelRatio = global$2.devicePixelRatio;
        canvas.width = parseInt(me.width) * devicePixelRatio;
        canvas.height = parseInt(me.height) * devicePixelRatio;
        if (me.context == '2d') {
            canvas.getContext(me.context).scale(devicePixelRatio, devicePixelRatio);
        }
        canvas.style.width = me.width + "px";
        canvas.style.height = me.height + "px";
    }

    /**
     * @function ol.supermap.MapvCanvasLayer.prototype.draw
     * @description 生成地图
     */
    draw() {
        this.options.update && this.options.update.call(this);
    }

    /**
     * @function ol.supermap.MapvCanvasLayer.prototype.resize
     * @param {number} mapWidth - 地图宽度
     * @param {number} mapHeight - 地图高度
     * @description 调整地图大小
     */
    resize(mapWidth, mapHeight) {
        var global$2 = typeof window === 'undefined' ? {} : window;
        var devicePixelRatio = this.devicePixelRatio = global$2.devicePixelRatio;
        this.canvas.width = mapWidth  * devicePixelRatio;
        this.canvas.height = mapHeight  * devicePixelRatio;
        if (this.context == '2d') {
            this.canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
        }
        this.canvas.style.width = mapWidth + "px";
        this.canvas.style.height = mapHeight + "px";
    }

    /**
     * @function ol.supermap.MapvCanvasLayer.prototype.getContainer
     * @description 获取容器
     * @returns {Element} 包含Mapv图层的dom对象
     */
    getContainer() {
        return this.canvas;
    }

    /**
     * @function ol.supermap.MapvCanvasLayer.prototype.setZIndex
     * @param {number} zIndex - 层级参数
     * @description 设置图层层级
     */
    setZIndex(zIndex) {
        this.canvas.style.zIndex = zIndex;
    }

    /**
     * @function ol.supermap.MapvCanvasLayer.prototype.getZIndex
     * @description 获取图层层级
     */
    getZIndex() {
        return this.zIndex;
    }
}