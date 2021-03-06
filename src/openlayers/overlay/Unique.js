import ol from 'openlayers';
import {ThemeVector, ShapeFactory, CommonUtil} from '@supermap/iclient-common';
import {GeoFeature} from './theme/GeoFeature';

/**
 * @class ol.source.Unique
 * @category  Visualization Theme
 * @classdesc 单值专题图图层源。
 * @param {String} name - 图层名称
 * @param {Object} opt_options - 参数。<br>
 * @param {string} opt_options.id - 专题图层ID。</br>
 * @param {boolean} [opt_options.loadWhileAnimating=true] - 是否实时重绘。</br>
 * @param {ol.Map} opt_options.map - 当前map对象。</br>
 * @param {number} opt_options.opacity - 图层透明度。</br>
 * @param {(string|Object)} opt_options.attributions - 版权信息。</br>
 * @param {string} opt_options.logo - Logo。</br>
 * @param {ol.proj.Projection} opt_options.projection - 投影信息。</br>
 * @param {number} [opt_options.ratio=1.5] - 视图比，1表示画布是地图视口的大小，2表示地图视口的宽度和高度的两倍，依此类推。必须是1或更高。</br>
 * @param {Array} opt_options.resolutions - 分辨率数组。</br>
 * @param {ol.source.State} opt_options.state - 资源状态。<br>
 * @param {string} opt_options.themeField - 指定创建专题图字段。<br>
 * @param {Object} opt_options.style - 专题图样式。<br>
 * @param {Object} opt_options.styleGroups - 各专题类型样式组。<br>
 * @param {boolean} opt_options.isHoverAble - 是否开启hover事件。<br>
 * @param {Object} opt_options.highlightStyle - 开启hover事件后，触发的样式风格。
 * @extends {ol.source.GeoFeature}
 */
export class Unique extends GeoFeature {

    constructor(name, opt_options) {
        super(name, opt_options);
        this.themeField = opt_options.themeField;
        this.style = opt_options.style;
        this.styleGroups = opt_options.styleGroups;
        this.isHoverAble = opt_options.isHoverAble;
        this.highlightStyle = opt_options.highlightStyle;
    }

    /**
     * @function ol.source.Unique.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        this.style = null;
        this.themeField = null;
        this.styleGroups = null;
        GeoFeature.prototype.destroy.apply(this, arguments);
    }

    /**
     * @private
     * @function ol.source.Unique.prototype.createThematicFeature
     * @description 创建专题要素。
     * @param {Object} feature - 要素
     */
    createThematicFeature(feature) {
        var style = this.getStyleByData(feature);
        //创建专题要素时的可选参数
        var options = {};
        options.nodesClipPixel = this.nodesClipPixel;
        options.isHoverAble = this.isHoverAble;
        options.isMultiHover = this.isMultiHover;
        options.isClickAble = this.isClickAble;
        options.highlightStyle = ShapeFactory.transformStyle(this.highlightStyle);
        //将数据转为专题要素（ThemeVector）
        var thematicFeature = new ThemeVector(feature, this, ShapeFactory.transformStyle(style), options);
        //直接添加图形到渲染器
        for (var m = 0; m < thematicFeature.shapes.length; m++) {
            this.renderer.addShape(thematicFeature.shapes[m]);
        }
        return thematicFeature;
    }

    /**
     * @private
     * @function ol.source.Unique.prototype.getStyleByData
     * @description 根据用户数据（feature）设置专题要素的 Style
     * @param {Object} fea - 用户要素数据
     */
    getStyleByData(fea) {
        var style = {};
        var feature = fea;
        style = CommonUtil.copyAttributesWithClip(style, this.style);
        if (this.themeField && this.styleGroups && this.styleGroups.length > 0 && feature.attributes) {
            var tf = this.themeField;
            var Attrs = feature.attributes;
            var Gro = this.styleGroups;
            var isSfInAttrs = false; //指定的 themeField 是否是 feature 的属性字段之一
            var attr = null; //属性值
            for (var property in Attrs) {
                if (tf === property) {
                    isSfInAttrs = true;
                    attr = Attrs[property];
                    break;
                }
            }
            //判断属性值是否属于styleGroups的某一个范围，以便对获取分组 style
            if (isSfInAttrs) {
                for (var i = 0, len = Gro.length; i < len; i++) {
                    if ((attr).toString() === ( Gro[i].value).toString()) {
                        //feature.style = CommonUtil.copyAttributes(feature.style, this.defaultStyle);
                        var sty1 = Gro[i].style;
                        style = CommonUtil.copyAttributesWithClip(style, sty1);
                    }
                }
            }
        }
        if (feature.style && this.isAllowFeatureStyle === true) {
            style = CommonUtil.copyAttributesWithClip(feature.style);
        }
        return style;
    }

    canvasFunctionInternal_(extent, resolution, pixelRatio, size, projection) { // eslint-disable-line no-unused-vars
        return GeoFeature.prototype.canvasFunctionInternal_.apply(this, arguments);
    }
}

ol.source.Unique = Unique;