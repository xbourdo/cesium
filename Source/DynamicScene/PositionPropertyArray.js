/*global define*/
define(['../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/DeveloperError',
        '../Core/Enumeration',
        '../Core/Event',
        '../Core/EventHelper',
        '../Core/ReferenceFrame',
        './Property'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Enumeration,
        Event,
        EventHelper,
        ReferenceFrame,
        Property) {
    "use strict";

    /**
     * A {@link PositionProperty} whose value is an array whose items are the computed value
     * of other PositionProperty instances.
     *
     * @alias PositionProperty
     * @constructor
     *
     * @param {Array} [value] An array of Property instances.
     */
    var PositionPropertyArray = function(value, referenceFrame) {
        this._value = undefined;
        this._length = 0;
        this._definitionChanged = new Event();
        this._eventHelper = new EventHelper();
        this._referenceFrame = defaultValue(referenceFrame, ReferenceFrame.FIXED);
        this.setValue(value);
    };

    defineProperties(PositionPropertyArray.prototype, {
        /**
         * Gets a value indicating if this property is constant.  This property
         * is considered constant if all property items in the array are constant.
         * @memberof PositionPropertyArray.prototype
         * @type {Boolean}
         */
        isConstant : {
            get : function() {
                var length = this._length;
                var value = this._value;
                for (var i = 0; i < length; i++) {
                    var property = value[i];
                    if (defined(property) && !property.isConstant) {
                        return false;
                    }
                }
                return true;
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is changed whenever setValue is called with data different
         * than the current value or one of the properties in the array also changes.
         * @memberof PositionPropertyArray.prototype
         * @type {Event}
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets the reference frame in which the position is defined.
         * @memberof PositionPropertyArray.prototype
         * @Type {ReferenceFrame}
         * @default ReferenceFrame.FIXED;
         */
        referenceFrame : {
            get : function() {
                return this._referenceFrame;
            }
        }
    });

    /**
     * Gets the value of the property.
     * @memberof PositionPropertyArray
     *
     * @param {JulianDate} [time] The time for which to retrieve the value.  This parameter is unused since the value does not change with respect to time.
     * @param {Array} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Array} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PositionPropertyArray.prototype.getValue = function(time, result) {
        return this.getValueInReferenceFrame(time, ReferenceFrame.FIXED, result);
    };

    /**
     * Gets the value of the property at the provided time and in the provided reference frame.
     * @memberof PositionPropertyArray
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {ReferenceFrame} referenceFrame The desired referenceFrame of the result.
     * @param {Cartesian3} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Cartesian3} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PositionPropertyArray.prototype.getValueInReferenceFrame = function(time, referenceFrame, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(time)) {
            throw new DeveloperError('time is required.');
        }
        if (!defined(referenceFrame)) {
            throw new DeveloperError('referenceFrame is required.');
        }
        //>>includeEnd('debug');

        if (!defined(this._value)) {
            return undefined;
        }

        var length = this._length;
        if (!defined(result)) {
            result = new Array(length);
        }
        for (var i = 0; i < length; i++) {
            var property = this._value[i];
            if (defined(property)) {
                result[i] = property.getValueInReferenceFrame(time, referenceFrame, result[i]);
            } else {
                result[i] = undefined;
            }
        }
        result.length = length;
        return result;
    };

    /**
     * Sets the value of the property.
     * If the value is an object, the object must provide clone and equals functions.
     * @memberof PositionPropertyArray
     *
     * @param {Array} value An array of Property instances.
     */
    PositionPropertyArray.prototype.setValue = function(value) {
        var eventHelper = this._eventHelper;
        eventHelper.removeAll();

        if (defined(value)) {
            this._value = value.slice();
            var length = value.length;
            this._length = length;

            for (var i = 0; i < length; i++) {
                var property = value[i];
                if (defined(property)) {
                    eventHelper.add(property.definitionChanged, PositionPropertyArray.prototype._raiseDefinitionChanged, this);
                }
            }
        } else {
            this._value = undefined;
            this._length = 0;
        }
        this._definitionChanged.raiseEvent(this);
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     * @memberof PositionPropertyArray
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PositionPropertyArray.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PositionPropertyArray && //
                this._referenceFrame === other._referenceFrame &&
                (this._length === other._length && Property.arrayEquals(this._value, other._value)));
    };

    PositionPropertyArray.prototype._raiseDefinitionChanged = function() {
        this._definitionChanged.raiseEvent(this);
    };

    return PositionPropertyArray;
});
