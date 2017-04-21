﻿/**
 * Class: SuperMap.REST.ThiessenAnalystService
 * 泰森多边形分析服务类
 * 该类负责将客户设置的泰森多边形分析参数传递给服务端，并接收服务端返回的分析结果数据。
 * 泰森多边形分析结果通过该类支持的事件的监听函数参数获取
 * 泰森多边形分析的参数支持两种，当参数为 {<SuperMap.DatasetThiessenAnalystParameters>} 类型
 * 时，执行数据集泰森多边形分析，当参数为 {<SuperMap.GeometryThiessenAnalystParameters>} 类型时，
 * 执行几何对象泰森多边形分析。
 *
 * Inherits from:
 *  - <SuperMap.REST.SpatialAnalystBase>
 */
require('./SpatialAnalystBase');
require('./DatasetThiessenAnalystParameters');
require('./GeometryThiessenAnalystParameters');
SuperMap.REST.ThiessenAnalystService = SuperMap.Class(SuperMap.REST.SpatialAnalystBase, {

    /**
     * Property: mode
     * {<String>} 缓冲区分析类型
     */
    mode: null,

    /**
     * Constructor: SuperMap.REST.ThiessenAnalystService
     * 泰森多边形分析服务类构造函数。
     *
     * 例如：
     * (start code)
     * var myThiessenAnalystService = new SuperMap.REST.ThiessenAnalystService(url, {
     *     eventListeners: {
     *           "processCompleted": bufferCompleted, 
     *           "processFailed": bufferFailed
     *           }
     *    });
     * (end)
     *
     * Parameters:
     * url - {String} 服务的访问地址。如 http://localhost:8090/iserver/services/spatialanalyst-changchun/restjsr/spatialanalyst 。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function (url, options) {
        SuperMap.REST.SpatialAnalystBase.prototype.initialize.apply(this, arguments);
        var me = this;
        if (options) {
            SuperMap.Util.extend(me, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源,将引用资源的属性置空。
     */
    destroy: function () {
        SuperMap.REST.SpatialAnalystBase.prototype.destroy.apply(this, arguments);
        this.mode = null;
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.DatasetThiessenAnalystParameters>}/
     * {<GeometryThiessenAnalystParameters>}
     */
    processAsync: function (parameter) {
        var parameterObject = new Object();
        var me = this;

        var end = me.url.substr(me.url.length - 1, 1);
        if (end === '/') {

        } else {
            me.url += "/";
        }

        if (parameter instanceof SuperMap.DatasetThiessenAnalystParameters) {
            me.mode = "datasets";
            me.url += 'datasets/' + parameter.dataset + '/thiessenpolygon';
            SuperMap.DatasetThiessenAnalystParameters.toObject(parameter, parameterObject);
        }
        else if (parameter instanceof SuperMap.GeometryThiessenAnalystParameters) {
            me.mode = "geometry";
            me.url += 'geometry/thiessenpolygon';
            SuperMap.GeometryThiessenAnalystParameters.toObject(parameter, parameterObject);
        }

        var jsonParameters = SuperMap.Util.toJSON(parameterObject);


        if (me.isInTheSameDomain) {
            me.url += '.json?returnContent=true';
        } else {
            me.url += '.jsonp?returnContent=true';
        }

        me.request({
            method: "POST",
            data: jsonParameters,
            scope: me,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    },
    /**
     * Method: toGeoJSONResult
     * 将含有geometry的数据转换为geojson格式。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    toGeoJSONResult: function (result) {
        if (!result) {
            return result;
        }

        var analystResult = SuperMap.REST.SpatialAnalystBase.prototype.toGeoJSONResult.apply(this, arguments);
        if (!analystResult && result.regions) {
            var geoJSONFormat = new SuperMap.Format.GeoJSON();
            analystResult = JSON.parse(geoJSONFormat.write(result.regions));
        }
        return analystResult;
    },

    CLASS_NAME: "SuperMap.REST.ThiessenAnalystService"
});

module.exports = function (url, options) {
    return new SuperMap.REST.ThiessenAnalystService(url, options);
};