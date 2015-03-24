(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.elsa = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Copyright 2013 BlackBerry Limited
* @author: Isaac Gordezky
* @author: Anzor Bashkhaz
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
 * Ecma5-extend is a javascript library that provides a generic class
 * structure for javascript. In contrast to other solutions, ecma5-extend
 * classes are written in pure javascript and it requires support for ECMA5.
 *
 * @module ecma5-extend
 *
 * @property {boolean} memoryLeakWarning - Enables memory leak warnings for ecma5-extend classes. (Default: true)
 *
 * @property {boolean} memoryLeakProtection - Enables memory leak protection for ecma5-extend classes.
 * Memory leak protection automatically deletes properties on the private and protected objects during destroy. (Default: false)
 *
 * @property {boolean} autoNotifyOnSet - Determines if a class's property setters will automatically publish
 * a propertyChanged event when the value is set. This does not affect the protected interface propertyChanged
 * API, which will be called regardless of this option. This value can be overridden by individual object
 * definitions. (default: true)
 *
 */

/**
 * The common interface shared by every ecma5-extend type.
 *
 * @class Type
 * @memberof ecma5-extend
 */

/**
 * @function create
 * @memberof ecma5-extend.Type#
 * @returns {ecma5-extend.Object} A new ecma5-extend object
 */

/**
 * The common interface shared by every object that is an instance of an ecma5-extend type.
 *
 * Due to the limitations of javascript types, a single ecma5-extend instance has three associated objects:
 *
 *  * {@link ecma5-extend.Object.PublicInterface PublicInterface}
 *      An object that is the public interface of an ecma5-extend instance
 *  * {@link ecma5-extend.Object.ProtectedInterface ProtectedInterface}
 *      An object that is the protected interface of an ecma5-extend instance, shared between all ecma5-extend types in an instance's type hierarchy
 *  * {@link ecma5-extend.Object.PrivateInterface PrivateInterface}
 *      An object that is the private interface of an ecma5-extend instance, specific to each ecma5-extend type in an instance's type hierarchy
 *
 *
 * @class Object
 * @memberof ecma5-extend
 *
 * @property {string} name - The name of the type
 *
 * @property {object} extend - An ecma5-extend, HTMLElement or javascript type
 *
 * @property {Array.<object>} mixin - A list of ecma5-extend mixins
 *
 * @property {Array.<object>} mixinExtended - A list of ecma5-extend extended mixins with init()/destroy() support
 *
 * @property {ecma5-extend.Object.PublicInterface} public - The public interface
 *
 * @property {ecma5-extend.Object.ProtectedInterface} protected - The protected interface
 *
 * @property {ecma5-extend.Object.PrivateInterface} private - The private interface
 *
 * @property {function} init - The constructor function
 *
 * @property {function} destroy - The destructor function
 *
 * @property {boolean} autoNotifyOnSet - Determines if a class's property setters will automatically publish
 * a propertyChanged event when the value is set. This does not affect the protected interface propertyChanged
 * API, which will be called regardless of this option. This value overrides the global value. (default: true)
 *
 */

/**
 * Callback for ecma5-extend events.
 * @callback EventCallback
 * @memberof ecma5-extend.Object
 * @param {ecma5-extend.Object.PublicInterface} object - The object from which the event was emitted
 * @param {*} value - The value associated with the event
 * @param {*} [oldvalue] - The old value associated with the event
 */

/**
 * The public interface of an ecma5-extend object
 *
 * @class PublicInterface
 * @memberof ecma5-extend.Object
 */

/**
 * The protected interface of an ecma5-extend object
 *
 * @class ProtectedInterface
 * @memberof ecma5-extend.Object
 *
 * @property {ecma5-extend.Object.PublicInterface} public The public interface of this object
 *
 */

/**
 * The private interface of an ecma5-extend object.
 *
 * @class PrivateInterface
 * @memberof ecma5-extend.Object
 *
 * @property {ecma5-extend.Object.PublicInterface} public The public interface of this ecma5-extend object
 * @property {ecma5-extend.Object.ProtectedInterface} protected The protected interface of this ecma5-extend object
 */

var NOTIFY_ALL = true;
var STATIC_IGNORE_NAMES = ['name', 'extend', 'extends', 'public', 'private', 'protected', 'init', 'destroy', 'mixin', 'mixins', 'tagName', 'tagname', 'mixinExtended', 'autoNotifyOnSet'];

var objectCount = 1;
var definitionCount = 1;

var exports = {
    memoryLeakWarnings : true,
    memoryLeakProtector : false,
    autoNotifyOnSet : true
};
var typeRegistry = {};

// TODO: add test for this
var badDefineProperty = false;

if ( typeof Object.setPrototypeOf === "undefined") {
    Object.defineProperties(Object, {
        "getPrototypeOf" : {
            value : function getPrototypeOf(object) {
                /* jshint ignore:start */
                return object.__proto__;
                /* jshint ignore:end */
            }
        },
        "setPrototypeOf" : {
            value : function setPrototypeOf(object, proto) {
                /* jshint ignore:start */
                object.__proto__ = proto;
                /* jshint ignore:end */
            }
        }
    });
}

/************************* per-type functions go here ************************/
/**
 * Access the super-class implementation of functions via `super.protected` and `super.public`.
 * Each function calls the super-class implementation of `methodname` within the respective scope.
 *
 * @member {Object} super
 * @memberof ecma5-extend.Object.PrivateInterface#
 *
 * @property {function} public(methodname,...) Calls the super-class pubilc implementation of `methodname`
 * *Throws **`TypeError`** if a public super method `methodname` does not exist*
 * @property {function} protected(methodname,...) Calls the super-class protected implementation of `methodname`
 * *Throws **`TypeError`** if a protected super method `methodname` does not exist*
 */
var defineSuper = function(prototype, scope) {
    return function getSuper(methodName) {
        var _this = this.object;
        var _super = Object.getPrototypeOf(prototype)[methodName];
        if (!_super) {
            throw new TypeError(_this.public.constructor.name + "." + scope + "." + methodName + " does not have a super method");
        }
        return _super.apply(_this.public, Array.prototype.slice.call(arguments, 1));
    };
};

/**
 * Returns the private object from a public instance of that object.
 *
 * @memberof ecma5-extend.Object.PrivateInterface#
 *
 * @param {ecma5-extend.Object.PublicInterface} object - An object of this type
 * @returns {ecma5-extend.Object.PrivateInterface} The private object
 */
var getPrivate = function getPrivate(object) {
    return Object.getPrototypeOf(this).privateRegistry[object.__id];
};

var defineSubscribe = function(privateRegistry) {
    /**
     * Subscribe to an event with a callback (Overridable)
     *
     * @public
     * @memberof ecma5-extend.Object.PublicInterface#
     *
     * @param {string} eventName - The event name
     * @param {ecma5-extend.Object.EventCallback} callback - The callback to bind to the event.
     */
    return function subscribe(eventName, callback, id) {
        var priv = privateRegistry[this.__id];
        if (!priv.__subscribers__) {
            priv.__subscribers__ = {};
        }
        if (!priv.__subscribers__[eventName]) {
            priv.__subscribers__[eventName] = [];
        }
        priv.__subscribers__[eventName].push({
            id : id || null,
            fn : callback
        });
    };
};

var defineUnsubscribe = function(privateRegistry) {
    /**
     * Unsubscribe to an event with a callback (Overridable)
     *
     * @public
     * @memberof ecma5-extend.Object.PublicInterface#
     *
     * @param {string} eventName - The event name
     * @param {ecma5-extend.Object.EventCallback} - The callback to unbind from the event.
     */
    return function unsubscribe(eventName, callback, id) {
        var priv = privateRegistry[this.__id];
        if (!priv.__subscribers__) {
            return;
        }
        var eventGroup = priv.__subscribers__[eventName];
        if (eventGroup) {
            for (var i = 0; i < eventGroup.length; i++) {
                var singleEvent = eventGroup[i];
                if (id && singleEvent.id && singleEvent.id === id) {
                    eventGroup.splice(i, 1);
                    i -= 1;
                } else if (callback && singleEvent.fn && singleEvent.fn === callback) {
                    eventGroup.splice(i, 1);
                    i -= 1;
                }
            }
        }
    };
};

var definePublish = function(privateRegistry) {
    /**
     * Publish implementation called by {@link ecma5-extend.Object.PublicInterface#publish PublicInterface.publish} (Overridable)
     *
     * ##### Behavior #####
     * Before publishing an event, this function will look for a protected-interface method
     * with the same name as the event and call it with newValue and oldValue.
     * If this method returns true, **the event will be cancelled**.
     *
     * @memberof ecma5-extend.Object.ProtectedInterface#
     *
     * @param {string} eventName - The name of the event
     * @param {*} value - The new value associated with the event
     * @param {*} [oldvalue] - The old value associated with the event
     * @returns {boolean} If the event was cancelled
     */

    return function publish(eventName, newValue, oldValue) {
        var priv = privateRegistry[this.public.__id];
        if ( typeof priv.protected[eventName] === "function") {
            var cancel = priv.protected[eventName](newValue, oldValue);
            if (cancel) {
                return true;
            }
        }
        if (priv.__subscribers__ && priv.__subscribers__[eventName]) {
            var listeners = priv.__subscribers__[eventName].slice();
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if ( typeof listener.fn === "function") {
                    listener.fn.call(this.public, newValue, oldValue);
                }
            }
        }
        return false;
    };
};

var definePublicPublishNotify = function(privateRegistry) {
    /**
     * Publish an event on the object. For default behavior see {@link ecma5-extend.Object.ProtectedInterface#publish Object.publish}.
     *
     * @memberof ecma5-extend.Object.PublicInterface#
     *
     * @param {string} eventName - The name of the event
     * @param {*} value - The new value associated with the event
     * @param {*} [oldvalue] - The old value associated with the event
     * @returns {boolean} If the event was cancelled
     */
    return function publish(eventName, newValue, oldValue) {
        var priv = privateRegistry[this.__id];
        return priv.protected.publish(eventName, newValue, oldValue);
    };
};
var definePublicPublish = function(privateRegistry) {
    return function publish(eventName, newValue, oldValue) {
        var priv = privateRegistry[this.__id];
        return priv.protected.publish(eventName, newValue, oldValue);
    };
};

var defineCallMethod = function(privateRegistry, fcn) {
    return function callMethod() {
        //TODO investigate race condition
        if (!privateRegistry[this.__id]) {
            console.error('callMethod - privateRegistry[this.__id] is undefined', privateRegistry, this);
        }
        return fcn.apply(privateRegistry[this.__id], arguments);
    };
};

var defineGetAccessorProperty = function(privateRegistry, get) {
    return function getProperty() {
        return get.call(privateRegistry[this.__id]);
    };
};

var defineGetProperty = function(privateRegistry, propertyName) {
    return function getProperty() {
        return privateRegistry[this.__id][propertyName];
    };
};

var defineSetPublicAccessorPropertyNotify = function(privateRegistry, set, notifyKey) {
    return function setProperty(value) {
        var priv = privateRegistry[this.__id];
        //if (get)
        //  var oldValue = get.call(priv);
        set.call(priv, value);
        if ( typeof priv.protected[notifyKey] === "function") {
            priv.protected[notifyKey](value);
        }
        priv.protected.publish(notifyKey, value);
    };
};
var defineSetPublicAccessorProperty = function(privateRegistry, set, notifyKey) {
    return function setProperty(value) {
        var priv = privateRegistry[this.__id];
        //if (get)
        //  var oldValue = get.call(priv);
        set.call(priv, value);
        if ( typeof priv.protected[notifyKey] === "function") {
            priv.protected[notifyKey](value);
        }
        priv.protected.publish(notifyKey, value);
    };
};

var defineSetProtectedAccessorProperty = function(privateRegistry, set, notifyKey) {
    return function setProperty(value) {
        var priv = privateRegistry[this.__id];
        set.call(priv, value);
        /*if ( typeof priv.protected[notifyKey] === "function")
         priv.protected[notifyKey](value, oldValue);*/
    };
};

var defineSetAccessorProperty = function(privateRegistry, set) {
    return function setProperty(value) {
        set.call(privateRegistry[this.__id], value);
    };
};

var defineSetPublicPropertyNotify = function(privateRegistry, key) {
    var notifyKey = key + "Changed";
    return function setProperty(value) {
        var priv = privateRegistry[this.__id];
        var oldValue = priv[key];
        priv[key] = value;
        if ( typeof priv.protected[notifyKey] === "function") {
            priv.protected[notifyKey](value, oldValue);
        }
        priv.protected.publish(notifyKey, value, oldValue);
    };
};
var defineSetPublicProperty = function(privateRegistry, key) {
    var notifyKey = key + "Changed";
    return function setProperty(value) {
        var priv = privateRegistry[this.__id];
        var oldValue = priv[key];
        priv[key] = value;
        if ( typeof priv.protected[notifyKey] === "function") {
            priv.protected[notifyKey](value, oldValue);
        }
    };
};

var defineSetProperty = function(privateRegistry, key) {
    return function setProperty(value) {
        privateRegistry[this.__id][key] = value;
    };
};

var defineInit = function(privateRegistry, init, _super, name, mixins, mixinExtended) {
    /**
     * Initialize an elsa object (Overridable)
     * @function initialize
     * @memberof ecma5-extend.Object.ProtectedInterface#
     */
    return function callInit() {
        var i, len;
        //console.log(definition.name + ": callInit");
        if ( typeof _super === "function") {
            _super.apply(this, arguments);
        }

        if (mixins) {
            len = mixins.length;
            for ( i = 0; i < len; i++) {
                mixins[i].apply(this.public, arguments);
            }
        }

        var priv = privateRegistry[this.public.__id];
        if (mixinExtended) {
            len = mixinExtended.length;
            for ( i = 0; i < len; i++) {
                mixinExtended[i].init.apply(priv, arguments);
            }
        }

        if ( typeof init === "function") {
            init.apply(priv, arguments);
        }
    };
};

var destroyObjectProperties = function(priv, type) {
    if (exports.memoryLeakWarnings || exports.memoryLeakProtector) {
        Object.getOwnPropertyNames(priv).forEach(function(key) {
            var value = priv[key];
            if (value && typeof value === "object") {
                if (exports.memoryLeakWarnings) {
                    console.warn("ecma5-extend.memoryLeakWarning " + type.name + "." + key + " = " + (value.tagName ? "<" + value.tagName.toLowerCase() + ">" : value));
                }
                if (exports.memoryLeakProtector) {
                    Object.defineProperty(priv, key, {
                        value : undefined
                    });
                }
            }
        }, this);
    }
};

var defineDestroy = function(privateRegistry, destroy, _super, publicPrototype, mixinExtended) {
    /**
     * Destroy an elsa object (Overridable)
     * @function destroy
     * @memberof ecma5-extend.Object.ProtectedInterface#
     */
    return function callDestroy() {
        var priv = privateRegistry[this.__id];
        if (!priv) {
            return;
        }

        if (destroy) {
            destroy.call(priv);
        }

        if (mixinExtended) {
            var len = mixinExtended.length;
            for (var i = 0; i < len; i++) {
                mixinExtended[i].destroy.call(priv);
            }
        }

        if (_super) {
            _super.call(this);
        }

        // we are is the 'final' type
        if (Object.getPrototypeOf(this) === publicPrototype) {
            Object.defineProperties(priv.protected, {
                "public" : {
                    value : undefined
                }
            });
            destroyObjectProperties(priv.protected, publicPrototype);
            Object.setPrototypeOf(priv.protected, Object.prototype);

            Object.defineProperties(priv.public, {
                "__id" : {
                    value : undefined
                }
            });

            if (HTMLElement.prototype.isPrototypeOf(priv.public)) {
                // Here we remove our proto hooks and restore the normal DOM
                var proto = Object.getPrototypeOf(priv.public);
                while ( typeof proto.constructor.extend === "function" && typeof proto.constructor.tagName === "string") {
                    proto = Object.getPrototypeOf(proto);
                }
                Object.setPrototypeOf(priv.public, proto);
            } else {
                Object.setPrototypeOf(priv.public, Object.prototype);
            }
        }
        Object.defineProperties(priv, {
            "protected" : {
                value : undefined
            },
            "public" : {
                value : undefined
            },
            "__subscribers__" : {
                value : undefined
            }
        });
        destroyObjectProperties(priv, publicPrototype.constructor);
        Object.setPrototypeOf(priv, Object.prototype);
        delete privateRegistry[this.__id];
    };
};

// ---------------------------------------------------------
var propertyDescriptorNames = ["configurable", "enumerable", "writable", "set", "get", "value", "publish"];
var isPropertyDescriptor = function(obj) {
    if ( typeof obj !== "object" || obj === null) {
        return false;
    }

    var keys = Object.getOwnPropertyNames(obj);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (propertyDescriptorNames.indexOf(key) === -1) {
            return false;
        }
    }
    return (keys.length > 0);
};

var extendMixin = function(mixin) {
    var okeys = Object.keys(Object.prototype);
    var src = mixin.prototype || mixin;
    Object.keys(src).forEach(function(key) {
        if (okeys.indexOf(key) !== -1) {
            return;
        }
        var value = src[key];
        var isFunction = typeof value === "function";
        this[key] = Object.getOwnPropertyDescriptor(src, key) || {
            configurable : true,
            writable : true,
            enumerable : !isFunction,
            value : value
        };
    }, this);
};

var extendSimpleScope = function(definitionObj, propertyDescriptors, protectedPrototype, publicPrototype, ignore) {
    ignore = ignore || [];
    Object.getOwnPropertyNames(definitionObj).forEach(function(key) {
        if (ignore.indexOf(key) === -1) {
            var defn = definitionObj[key];
            if (isPropertyDescriptor(defn)) {
                propertyDescriptors[key] = defn;
            } else {
                propertyDescriptors[key] = {
                    configurable : true,
                    writable : true,
                    enumerable : true,
                    value : defn
                };
            }
        }
    });

    var _super = {};
    Object.defineProperties(_super, {
        "public" : {
            value : defineSuper(publicPrototype, "public"),
            writable : false
        },
        "protected" : {
            value : defineSuper(protectedPrototype, "protected"),
            writable : false
        }
    });
    propertyDescriptors["super"] = {
        get : function() {
            _super.object = this;
            return _super;
        }
    };
    propertyDescriptors.getPrivate = {
        value : getPrivate
    };
};

var addExtendedMixins = function(definition) {
    var mixin, name, len = definition.mixinExtended.length;
    for (var i = 0; i < len; i++) {
        mixin = definition.mixinExtended[i];
        for (name in mixin.public) {
            definition.public[name] = mixin.public[name];
        }
        for (name in mixin.protected) {
            if (!( name in definition.protected)) {
                definition.protected[name] = mixin.protected[name];
            }
        }
        for (name in mixin.private) {
            if (!( name in definition.private)) {
                definition.private[name] = mixin.private[name];
            }
        }
    }
};

/*
 * build a scope prototype from its definition
 * auto-fill ECMA5 descriptors
 * build inheritence links
 */
var extendScope = function(definition, scope, baseType, privateDefn, privateRegistry, ultimateType) {
    var scopeDefn = {}, obj;

    if (!baseType) {
        obj = {};
    } else if (scope === "protected") {
        if ( typeof baseType.extend === "function") {
            obj = baseType.extend({});
        } else {
            obj = {};
        }
    } else {
        obj = Object.create(baseType.prototype);
    }

    var autoNotifyOnSet = "autoNotifyOnSet" in definition ? definition.autoNotifyOnSet : exports.autoNotifyOnSet;

    Object.getOwnPropertyNames(definition[scope]).forEach(function(key) {
        if (key === "constructor" && scope === "public") {
            return;
        } else if (key === "public" && (scope === "protected" || scope === "private")) {
            return;
        } else if (key === "protected" && scope === "private") {
            return;
        }

        var defn = definition[scope][key];
        if (!isPropertyDescriptor(defn)) {
            var isFunction = typeof defn === "function";
            scopeDefn[key] = defn = {
                configurable : false,
                enumerable : !isFunction,
                writable : !isFunction, // && defn !== undefined && defn !== null
                value : defn
            };
        }
        if ( typeof defn.value === "function") {
            var callMethod = defineCallMethod(privateRegistry, defn.value);
            scopeDefn[key] = {
                enumerable : defn.enumerable || false,
                configurable : defn.configurable || false,
                writable : defn.writable || false,
                value : callMethod
            };
            return;
        }

        var descriptor = scopeDefn[key] = {
            enumerable : defn.enumerable !== false,
            configurable : defn.configurable || false,
        };
        var get, set, notifyKey = key + "Changed";

        if (defn.hasOwnProperty("get")) {
            get = defn.get;
            descriptor.get = defineGetAccessorProperty(privateRegistry, get);
        }
        if (defn.hasOwnProperty("set")) {
            if (!defn.hasOwnProperty("get")) {
                descriptor.get = defineGetProperty(privateRegistry, key);
            }

            set = defn.set;
            if (defn.publish || NOTIFY_ALL) {
                if (scope === "public") {
                    descriptor.set = (autoNotifyOnSet ? defineSetPublicAccessorPropertyNotify : defineSetPublicAccessorProperty)(privateRegistry, set, notifyKey);
                } else {
                    descriptor.set = defineSetProtectedAccessorProperty(privateRegistry, set, notifyKey);
                }
            } else {
                descriptor.set = defineSetAccessorProperty(privateRegistry, set);
            }
        }
        if ( typeof get === "undefined" && typeof set === "undefined") {
            privateDefn[key] = {
                configurable : true,
                writable : true,
                enumerable : true,
                value : defn.value
            };
            descriptor.get = defineGetProperty(privateRegistry, key);
            if (defn.writable !== false) {
                if (defn.publish || NOTIFY_ALL) {
                    if (scope === "public") {
                        descriptor.set = (autoNotifyOnSet ? defineSetPublicPropertyNotify : defineSetPublicProperty)(privateRegistry, key);
                    } else {
                        descriptor.set = defineSetProperty(privateRegistry, key);
                    }
                } else {
                    descriptor.set = defineSetProperty(privateRegistry, key);
                }
            }
        }
    });

    if (ultimateType) {
        if (scope === "public" && (!scopeDefn.subscribe || !scopeDefn.unsubscribe)) {
            scopeDefn.subscribe = {
                enumerable : false,
                configurable : false,
                writable : false,
                value : defineSubscribe(privateRegistry)
            };
            scopeDefn.unsubscribe = {
                enumerable : false,
                configurable : false,
                writable : false,
                value : defineUnsubscribe(privateRegistry)
            };
        } else if (scope === "protected" && !scopeDefn.publish) {
            scopeDefn.publish = {
                enumerable : false,
                configurable : false,
                writable : false,
                value : definePublish(privateRegistry)
            };
        }
        if (scope === "public" && !scopeDefn.publish) {
            scopeDefn.publish = {
                enumerable : false,
                configurable : false,
                writable : false,
                value : (autoNotifyOnSet ? definePublicPublishNotify : definePublicPublish)(privateRegistry)
            };
        }
    }

    var mixins;
    if (definition.mixin) {
        mixins = Array.isArray(definition.mixin) ? definition.mixin : [definition.mixin];
    }

    if (scope === "protected") {
        scopeDefn.init = {
            value : defineInit(privateRegistry, definition.init, Object.getPrototypeOf(obj).init, definition.name, mixins, definition.mixinExtended)
        };
    } else if (scope === "public") {
        scopeDefn.destroy = {
            value : defineDestroy(privateRegistry, definition.destroy, Object.getPrototypeOf(obj).destroy, obj, definition.mixinExtended)
        };
        if (definition.mixin) {
            mixins = Array.isArray(definition.mixin) ? definition.mixin : [definition.mixin];
            mixins.forEach(extendMixin, scopeDefn);
        }
    }

    Object.defineProperties(obj, scopeDefn);

    return obj;
};

var isHTMLType = function(object) {
    if ( typeof window === "undefined" || typeof window.Node === "undefined" || typeof object === "undefined") {
        return false;
    }
    return (object.prototype instanceof window.Node || object instanceof window.Node);
};

var EXTEND_ORACLE = "75E3BA8C-63AF-45DE-85C3-260FF96453B9";
var defineTypeProperties = function defineTypeProperties(desc, publicPrototype, protectedPrototype, privatePrototype) {
    var self = desc.self;
    var extend = function(properties) {
        return Object.create(protectedPrototype, properties || {});
    };
    Object.defineProperty(extend, " oracle ", {
        value : EXTEND_ORACLE
    });
    return {
        create : {
            /**
             * Create an instance of this type.
             * @name create
             * @memberof ecma5-extend.Type#
             */
            value : function() {
                var args = Array.prototype.slice.apply(arguments);

                if (this === self) {
                    var __id = objectCount++, iPublic;
                    if (isHTMLType(args[0]) && isHTMLType(publicPrototype)) {
                        iPublic = args[0];
                        args = args.slice(1);
                        if (Object.getPrototypeOf(iPublic) !== publicPrototype) {
                            Object.setPrototypeOf(iPublic, publicPrototype);
                        }
                    } else if (this.tagName !== undefined) {
                        iPublic = document.createElement(this.tagName);
                        Object.setPrototypeOf(iPublic, publicPrototype);
                    } else {
                        var RootType = desc ? desc.baseType : undefined;
                        while (RootType && typeof RootType.extend === "function" && RootType.extend[' oracle '] === EXTEND_ORACLE) {
                            var proto = Object.getPrototypeOf(RootType.prototype);
                            RootType = proto ? proto.constructor : undefined;
                        }

                        if (RootType && typeof RootType === 'function') {
                            // lets use `new` which *should* be supported
                            iPublic = new (Function.prototype.bind.apply(RootType, [RootType].concat(args)))();
                            Object.setPrototypeOf(iPublic, publicPrototype);
                        } else {
                            // we have no root constructor, so just create from our prototype
                            iPublic = Object.create(publicPrototype);
                        }
                    }
                    Object.defineProperty(iPublic, "__id", {
                        configurable : true,
                        writable : false,
                        enumerable : false,
                        value : __id
                    });

                    var iProtected = Object.create(protectedPrototype, {
                        "public" : {
                            enumerable : true,
                            writable : badDefineProperty,
                            configurable : true,
                            value : iPublic
                        },
                        "__id" : {
                            configurable : true,
                            writable : false,
                            enumerable : false,
                            value : __id
                        }
                    });

                    // call the branch below to chain up the extend type hierarchy to create private objects
                    self.create.apply(iProtected, args);

                    // run the type initialization code (chains through the types)
                    iProtected.init.apply(iProtected, args);

                    return iPublic;
                } else {
                    /* chain to base clase: this === iProtected */
                    if (desc.baseType && typeof desc.baseType.extend === "function" && desc.baseType.extend[' oracle '] === EXTEND_ORACLE) {
                        desc.baseType.create.apply(this, args);
                    }

                    var iPrivate = Object.create(privatePrototype, {
                        "protected" : {
                            enumerable : true,
                            writable : badDefineProperty,
                            configurable : true,
                            value : this
                        },
                        "public" : {
                            enumerable : true,
                            writable : badDefineProperty,
                            configurable : true,
                            value : this.public
                        }
                    });

                    desc.privateRegistry[this.public.__id] = iPrivate;
                }
            }
        },
        extend : {
            value : extend
        },
        "prototype" : {
            enumerable : true,
            writable : false,
            configurable : false,
            value : publicPrototype
        },
        constructor : {
            configurable : false,
            writable : false,
            enumerable : false,
            value : Object.create({}, {
                "name" : {
                    configurable : false,
                    writable : false,
                    enumerable : false,
                    value : "Type<" + desc.name + ">"
                }
            })
        },
        /**
         * The name of this type
         * @constant {string} name
         * @memberof ecma5-extend.Type#
         */
        "name" : {
            enumerable : true,
            value : desc.name
        },
        /*"__definition__" : {
         value : definition
         }*/
    };
};

var defineTypeGetPrivate = function(publicPrototype, privateRegistry) {
    return function(object) {
        if (!publicPrototype.isPrototypeOf(object)) {
            throw TypeError("object " + object.constructor.name + " is not of type " + publicPrototype.constructor.name);
        }
        return privateRegistry[object.__id];
    };
};

/**
 * check if an object is an ecma5-extend type
 *
 * @instance
 * @param {Object} type - an object that may be an ecma5-extend type
 * @returns {Boolean}
 */
var isType = function isType(type) {
    if ( typeof type.extend === "function") {
        return type.extend[' oracle '] === EXTEND_ORACLE;
    } else {
        return false;
    }
};

/**
 * <p>Build a type from a compiled type definition</p>
 * <p>Type definitions have a custom object format that uses ECMA5 style scope definitions
 * as well as several short-forms (all parameters are optional)</p>
 *
 * @instance
 * @param {object} type definition - extend class definition created by the extend compiler
 * @returns {type}
 *
 * @example
 *
 * ecma5_extend.createType({
 *     name : "mycustomtype",
 *     extends : Object,
 *     private : {
 *         // private scope definition
 *     },
 *     protected : {
 *         // protected scope definition
 *     },
 *     public : {
 *         // public scope definition
 *     },
 *     init : function() {
 *     },
 *     destroy : fuction() {
 *     }
 * });
 */
var createType = function(definition) {
    if (definition.__id) {
        return typeRegistry[definition.__id];
    }
    var privateRegistry = {}, privateDefn = {}, privatePrototype = {}, protectedPrototype, publicPrototype;
    var self, baseType = null, ultimateType = true;
    var baseTypeDefinition = definition.extend;

    Object.defineProperties(definition, {
        "__id" : {
            writable : false,
            configurable : false,
            enumerable : false,
            value : definitionCount++
        }
    });

    if (!baseTypeDefinition) {
        self = {};
    } else if ( typeof baseTypeDefinition.create === "function" && baseTypeDefinition !== Object) {
        baseType = baseTypeDefinition;
        self = Object.create(baseType);
        ultimateType = false;
    } else if (isHTMLType(baseTypeDefinition)) {
        baseType = baseTypeDefinition;
        self = {};
    } else if ( typeof baseTypeDefinition === "function") {
        baseType = baseTypeDefinition;
        self = {};
    } else if ( typeof baseTypeDefinition === "string") {
        baseType = document.createElement(baseTypeDefinition).constructor;
        self = {};
        self.tagName = baseTypeDefinition.toUpperCase();
    } else {
        // lets hope what you gave me is a valid baseType
        baseType = baseTypeDefinition;
        self = {};
    }
    if (baseType && isHTMLType(baseType)) {
        self.tagName = "EL-" + definition.name.toUpperCase();
    }
    typeRegistry[definition.__id] = self;

    definition.public = definition.public || {};
    definition.protected = definition.protected || {};
    definition.private = definition.private || {};

    if (definition.mixinExtended) {
        addExtendedMixins(definition);
    }

    Object.defineProperties(privatePrototype, {
        "privateRegistry" : {
            value : privateRegistry
        }
    });
    protectedPrototype = extendScope(definition, "protected", baseType, privateDefn, privateRegistry, ultimateType);
    publicPrototype = extendScope(definition, "public", baseType, privateDefn, privateRegistry, ultimateType);

    // public/protected extendScope MUST be before this ??
    extendSimpleScope(definition.private, privateDefn, protectedPrototype, publicPrototype);
    Object.defineProperties(privatePrototype, privateDefn);

    var typeDescriptor = {};
    extendSimpleScope(definition, typeDescriptor, protectedPrototype, publicPrototype, STATIC_IGNORE_NAMES);
    Object.defineProperties(self, typeDescriptor);

    // TODO: pull these out for scope save reduction
    Object.defineProperties(self, defineTypeProperties({
        self : self,
        name : definition.name,
        privateRegistry : privateRegistry,
        baseType : baseType
    }, publicPrototype, protectedPrototype, privatePrototype));

    Object.defineProperties(publicPrototype, {
        constructor : {
            configurable : true,
            writable : false,
            enumerable : false,
            value : self
        }
    });

    Object.defineProperties(definition, {
        getPrivate : {
            writable : false,
            configurable : false,
            enumerable : false,
            value : defineTypeGetPrivate(publicPrototype, privateRegistry)
        }
    });

    // Note : enable these to peer into 'forbidden' scopes
    //self.private = privatePrototype;
    //self.protected = protectedPrototype;

    return self;
};

module.exports = exports;
Object.defineProperties(module.exports, {
    createType : {
        enumerable : true,
        value : createType
    },
    isType : {
        enumerable : true,
        value : isType
    }
});

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":2}],4:[function(require,module,exports){
module.exports={
  "name": "elsa",
  "description": "BlackBerry Enterprise SDK UI toolkit",
  "version": "0.0.1-dev",
  "author": {
    "name": "Anzor Bashkhaz"
  },
  "contributors": [
    {
      "name": "Isaac Gordezky"
    },
    {
      "name": "Paul LeMarquand"
    }
  ],
  "homepage": "https://gerrit.rim.net/gitweb?p=meapclient/ui-components.git",
  "repository": {
    "type": "git",
    "url": "ssh://gerrit.rim.net:29418/meapclient/ui-components.git"
  },
  "bugs": {
    "url": "https://jira.bbqnx.net/browse/MEAPCLIENT/component/20018"
  },
  "main": "dist/elsa.js",
  "devDependencies": {
    "angular": "^1.3.4",
    "backbone": "~1.1.2",
    "browserify-istanbul": "^0.1.1",
    "chai": "^1.9.1",
    "cheerio": "^0.18.0",
    "clean-css": "^2.1.8",
    "colors": "^0.6.2",
    "connect-livereload": "^0.3.2",
    "cssify": "^0.5.1",
    "ecma5-extend": "^0.3.0",
    "faketouches": "0.0.5",
    "faketouches-gestures": "^0.0.1",
    "font-awesome": "^4.2.0",
    "grunt": "~0.4.4",
    "grunt-autoprefixer": "^1.0.0",
    "grunt-browserify": "^3.0.0",
    "grunt-complexity": "^0.1.6",
    "grunt-concurrent": "^0.5.0",
    "grunt-contrib-clean": "~0.5.0",
    "grunt-contrib-concat": "~0.4.0",
    "grunt-contrib-connect": "^0.7.1",
    "grunt-contrib-jshint": "^0.10.0",
    "grunt-contrib-less": "~0.11.0",
    "grunt-contrib-uglify": "~0.4.0",
    "grunt-contrib-watch": "~0.6.1",
    "grunt-cordova-app": "^0.0.10",
    "grunt-exorcise": "^0.1.0",
    "grunt-focus": "^0.1.1",
    "grunt-githooks": "~0.3.1",
    "grunt-jscs": "^0.7.1",
    "grunt-jsdoc": "^0.6.1",
    "grunt-karma": "^0.8.2",
    "grunt-lesslint": "^1.1.0",
    "grunt-nsp-package": "0.0.4",
    "grunt-open": "^0.2.3",
    "grunt-subgrunt": "^0.4.4",
    "grunt-sync": "0.0.7",
    "grunt-wrap": "~0.3.0",
    "hammerjs": "~1.1.3",
    "ip": "",
    "jit-grunt": "^0.4.1",
    "jquery": "~2.1.0",
    "jshint-jenkins-checkstyle-reporter": "^0.1.2",
    "jshint-stylish": "^0.1.5",
    "jstify": "^0.7.0",
    "karma": "^0.12.14",
    "karma-chai": "^0.1.0",
    "karma-chrome-launcher": "^0.1.3",
    "karma-coverage": "^0.2.1",
    "karma-junit-reporter": "^0.2.2",
    "karma-mocha": "^0.1.3",
    "karma-mocha-reporter": "^0.2.8",
    "karma-sinon": "^1.0.3",
    "karma-spec-reporter": "~0.0.13",
    "karma-telemetry": "^0.1.1",
    "karma-webdriver-launcher": "^0.2.0",
    "mocha": "^1.18.2",
    "mold-source-map": "^0.3.0",
    "mustache": "^0.8.2",
    "sinon": "^1.9.1",
    "source-map": "^0.1.33",
    "stringify": "^3.0.0",
    "through": "^2.3.4",
    "time-grunt": "^0.3.1",
    "underscore": "^1.7.0"
  },
  "dependencies": {
    "htmlparser2": "^3.7.3",
    "through": "^2.3.4",
    "falafel": "^0.3.1",
    "glob": "^4.0.6"
  },
  "peerDependencies": {
    "grunt-browserify": ">= 3.0.0",
    "module-deps": "< 3.5.11"
  },
  "scripts": {
    "test": "grunt test",
    "release": "grunt prod"
  },
  "publishConfig": {
    "registry": "http://npm-proxy.rim.net:5984/"
  },
  "files": [
    "README.md",
    "CHANGELOG.md",
    "loader",
    "docs/output",
    "docs/live",
    "dist",
    "demo"
  ]
}

},{}],5:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var standardTemplate = require("./template.html");
var signatureTemplate = require("./signature.html");
var FastTouch = require("../common/fastTouch.js");
var applyAttributes = require("../../shared/utils.js").applyAttributes;

module.exports = {

    /**
     * Provides per-page actions. Defined inside a {@link bar bar}, or as a signature action inside `el-page-content` (see examples below). When too many actions to fit in a bar, automatically creates an {@link bar.overflow-menu overflow-menu}.
     *
     * @class action
     * @el control
     * <el-action></el-action>
     *
     * @extends base-action
     *
     * @demo
     * <caption>3 actions in bottom bar</caption>
     * <template name="action.html">
     * <el-page>
     *      <el-page-content>
     *          <p>Example of a bottom bar with 3 actions</p>
     *      </el-page-content>
     *      <el-bar>
     *          <el-action data-label="Pause" data-iconclass="fa fa-pause"></el-action>
     *          <el-action data-label="Play" data-iconclass="fa fa-play"></el-action>
     *          <el-action data-label="Stop" data-iconclass="fa fa-stop"></el-action>
     *      </el-bar>
     * </el-page>
     * </template>
     *
     * @demo
     * <caption>Signature action</caption>
     * <template name="action.html">
     * <el-page>
     *      <el-bar>
     *          <div class="title">Example of a signature action</div>
     *      </el-bar>
     *      <el-page-content>
     *      </el-page-content>
     *      <el-action class="signature" data-label="Play" data-iconclass="fa fa-play"></el-action>
     * </el-page>
     * </template>
     *
     * @demo
     * <caption>Signature action inside bar</caption>
     * <template name="action.html">
     * <el-page>
     *      <el-page-content>
     *      </el-page-content>
     *      <el-bar>
     *          <el-action data-label="Stop" data-iconclass="fa fa-stop"></el-action>
     *          <el-action class="signature" data-label="Play" data-iconclass="fa fa-play"></el-action>
     *          <el-action data-label="Share" data-iconclass="fa fa-share-alt"></el-action>
     *      </el-bar>
     * </el-page>
     * </template>
     */

    name: "action",

    attributes: ["iconsource", "iconclass", "label", "description", "overflow", "disabled"],

    extend: Extend.createType(require("../base-action")),

    mixinExtended: [FastTouch.mixin],

    public: {
        /**
         * overflow specifies that the action should only appear in the overflow menu
         * @default false
         * @example <el-action data-overflow="true"></el-action>
         * @example action.overflow = false
         */
        overflow: {
            get: function() {
                return this.public.classList.contains('el-action-overflow');
            },
            set: function(newValue) {
                if (newValue) {
                    this.public.classList.add('el-action-placement-overflow', 'el-managed-action');
                } else {
                    this.public.classList.remove('el-action-placement-overflow', 'el-managed-action');
                }
                this.protected.publish("overflowChanged", newValue);
            }
        },
    },

    /** @lends action# */
    init: function() {
        var template;
        if ((this.public.parentElement && this.public.parentElement.tagName === "EL-EXPANDABLE-ACTION") || this.public.classList.contains("signature")) {
            template = signatureTemplate;
        } else {
            template = standardTemplate;
        }
        this.protected.render(template);
        applyAttributes(this.public, module.exports.attributes);
    },

    destroy: function() {
        this.wrapperEl = undefined;
        this.iconEl = undefined;
        this.labelEl = undefined;
        this.descriptionEl = undefined;
        this.iconclass = undefined;
    }
};

},{"../../shared/utils.js":118,"../base-action":11,"../common/fastTouch.js":14,"./signature.html":6,"./template.html":7}],6:[function(require,module,exports){
module.exports = "<div class=el-signature-action-wrapper><div class=el-signature-action-bg></div><div class=\"el-action-icon el-signature-action-icon-box\"></div><div class=el-action-content><div class=el-action-label></div><div class=el-action-description></div></div></div>";

},{}],7:[function(require,module,exports){
module.exports = "<div class=el-action-icon></div><div class=el-action-content><div class=el-action-label></div><div class=el-action-description></div></div>";

},{}],8:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var template = require("./template.html");

module.exports = {

    /**
     * A control that indicates something is happening.
     * The activity indicator is useful when the length of time for a
     * particular process cannot accurately be determined, or may take
     * a long time.
     *
     * The activity indicator has two fixed graphics sizes. The size
     * of the indicator can be specified by using "small" or "large" as
     * the class property of the control.
     * @class activityindicator
     * @el control
     * <el-activityindicator></el-activityindicator>
     *
     * @extends HTMLElement
     *
     * @demo
     * <template name="activityindicator.html">
     * <el-page>
     *      <el-page-content>
     *          <el-activityindicator data-visible="true"></el-activityindicator>
     *      </el-page-content>
     * </el-page>
     * </template>
     */

    name: "activityindicator",

    extend: HTMLElement,

    /** @lends activityindicator# */
    public: {

        /**
         * Specifies whether this ActivityIndicator is visible
         *
         *  @example
         *     indicator.visible = false;
         */
        visible: {
            get: function() {
                return this.visible;
            },
            set: function(value) {
                if (this.visible !== value) {
                    this.public.toggle();
                }
            }
        },

        /**
         * Shows the ActivityIndicator
         */
        show: function() {
            if (!this.visible) {
                this.public.classList.remove("el-hidden");
                this.visible = true;
            }
        },

        /**
         * Hides the ActivityIndicator
         */
        hide: function() {
            if (this.visible) {
                this.public.classList.add("el-hidden");
                this.visible = false;
            }
        },

        /**
         * Toggles the visibility of the ActivityIndicator.
         */
        toggle: function() {
            if (this.visible) {
                this.public.hide();
            } else if (!this.visible) {
                this.public.show();
            }
        }
    },

    init: function() {
        this.public.innerHTML = template;
        this.visible = this.public.classList.contains("el-hidden") ? false : true;
    },

    destroy: function() {}
};

},{"./template.html":9}],9:[function(require,module,exports){
module.exports = "<div class=el-activityindicator-wrapper><div class=el-activityindicator-spinner></div></div>";

},{}],10:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = window.elsa.compiler;
var types = window.elsa;
var Extend = window.Ecma5Extend;

var applyAttributes = require("../../shared/utils.js").applyAttributes;
var FastTouch = require('../common/fastTouch.js');
var OverflowMenu = Extend.createType(require("../overflow-menu/index.js"));

var BackButtonState = {
    FALSE: 'false',
    ALWAYS: 'always',
    AUTO: 'auto'
};

var DrawerButtonState = {
    FALSE: 'false',
    STACK: 'stack',
    AUTO: 'auto',
};

module.exports = {

    /**
     *  Provides a horizontal bar, that can be used to page-specific titles, actions, buttons, etc.
     *  @class bar
     *  @el control
     *  <el-bar></el-bar>
     *  @extends HTMLElement
     *
     *  @demo
     *  <caption>Top bar with title</caption>
     *  <template name="bar.html">
     *  <el-page>
     *      <style type="text/css">
     *          .description { font-size: 0.7em; color: #444}
     *     </style>
     *      <el-bar data-drawerbutton="auto">
     *          <div class="title">
     *              <div>I am a title inside the top bar</div>
     *              <div class="description">I am a description</div>
     *          </div>
     *      </el-bar>
     *      <el-page-content></el-page-content>
     *  </el-page>
     *  </template>
     *
     *  @demo
     *  <caption>Both bars with an action</caption>
     *  <template name="bar.html">
     *  <el-page>
     *      <el-page-content>
     *          <p>Bottom bar with action</p>
     *      </el-page-content>
     *      <el-bar>
     *          <el-action data-label="Compose" data-iconclass="fa fa-pencil"></el-action>
     *      </el-bar>
     *  </el-page>
     *  </template>
     *
     *  @demo
     *  <caption>Top bar with buttons</caption>
     *  <template name="bar.html">
     *  <el-page>
     *      <el-bar>
     *          <button>Cancel</button>
     *          <div class="title">Bar with buttons</div>
     *          <button>Save</button>
     *      </el-bar>
     *      <el-page-content>
     *      </el-page-content>
     *  </el-page>
     *  </template>
     */

    name: "bar",

    extend: HTMLElement,

    attributes: ["backbutton", "drawerbutton"],

    /** @lends bar# */
    public: {

        /**
         * Renders a drawerbutton icon, which toggles displaying the drawer.
         * The drawerbutton has three possible values: "stack", "auto", and "false".
         * "false" forces the drawerbutton off.
         * "auto" will display the drawerbutton if the page is a top level page inside a
         * drawer. If the page is deeper in stack or there is no drawer in the application,
         * the button will not be displayed. Any other value is ignored.
         * "stack" will display the drawerbutton at any depth of stack so long as there is
         * a drawer and the drawer isn't forced open because of the layout width.
         *
         * Default value is "false".
         *
         * @example <el-bar data-drawerbutton="auto"></el-bar>
         * @example bar.drawerbutton = auto;
         */
        drawerbutton: {
            get: function() {
                return this.drawerButtonState;
            },
            set: function(value) {
                if (value === this.drawerButtonState) {
                    return;
                }

                if (value === DrawerButtonState.FALSE) {
                    this.public.removeChild(this.drawerbutton);
                    this.drawerbutton.removeEventListener("trigger", this.toggleSidemenu);
                    this.toggleSidemenu = undefined;
                    this.drawerbutton = undefined;
                } else if ((value === DrawerButtonState.STACK) || (value === DrawerButtonState.AUTO)) {
                    if (!this.drawerbutton) {
                        this.toggleSidemenu = function(element, event) {
                            if (window.elsa.App.scene.tagName === "EL-DRAWER" &&
                                event.target && event.target.classList.contains("el-drawerbutton")) {
                                window.elsa.App.scene.visualState = "toggle";
                            } else {
                                return;
                            }
                        };

                        this.drawerbutton = document.createElement("div");
                        this.drawerbutton.classList.add("el-action", "el-drawerbutton", "el-managed-action");
                        this.drawerbutton.innerHTML = '<div class="el-action-icon"></div>';
                        this.drawerbutton.querySelector(".el-action-icon").classList.add("el-icon", "core-actionbar-tab-icon-taboverflow");
                        this.drawerbuttonFastTouch = new FastTouch(this.drawerbutton, this.toggleSidemenu.bind(this));

                        this.public.insertBefore(this.drawerbutton, this.public.firstElementChild);
                    }
                    this.drawerbutton.classList.remove("drawerbuttonstate-" + this.drawerButtonState);
                    this.drawerbutton.classList.add("drawerbuttonstate-" + value);
                } else {
                    // bail out on invalid input
                    return;
                }

                // remove old style and add the new one
                this.drawerButtonState = value;
            }
        },

        /**
         * Renders a back button icon, which automatically pops the page if on a stack
         * The backbutton has three possible values: "auto", "always", "false".
         * "always" forces the backbutton on, "false" forces the backbutton off.
         * "auto" will display the backbutton only if the page is not the first page
         * inside a stack. Any other value is ignored.
         *
         * Default value is "false".
         *
         * @example <el-bar data-backbutton="auto"></el-bar>
         * @example bar.backbutton= auto;
         */
        backbutton: {
            get: function() {
                return this.backButtonState;
            },
            set: function(value) {
                if (value === this.backButtonState) {
                    return;
                }

                if (value === BackButtonState.FALSE) {
                    this.public.removeChild(this.backbutton);
                    this.backbutton.removeEventListener("trigger", this.pop);
                    this.pop = undefined;
                    this.backbutton = undefined;
                } else if ((value === BackButtonState.ALWAYS) || (value === BackButtonState.AUTO)) {
                    if (!this.backbutton) {
                        var self = this;
                        this.pop = function() {
                            /** support a bar in a nested scope for full customization */
                            for (var node = self.public.parentNode; node && node.tagName !== "EL-PAGE"; node = node.parentNode) {}
                            if (node && node.stack) {
                                node.stack.pop();
                            }
                        };

                        this.backbutton = document.createElement("div");
                        this.backbutton.classList.add("el-action", "el-backbutton", "el-managed-action");
                        this.backbutton.innerHTML = '<div class="el-action-icon"></div>';
                        this.backbutton.querySelector(".el-action-icon").classList.add("el-icon", "core-actionbar-icon-back");
                        this.backbuttonFastTouch = new FastTouch(this.backbutton, this.pop.bind(this));

                        this.public.insertBefore(this.backbutton, this.public.firstElementChild);
                    }
                    this.backbutton.classList.remove("backbuttonstate-" + this.backButtonState);
                    this.backbutton.classList.add("backbuttonstate-" + value);

                } else {
                    // bail out on invalid input
                    return;
                }

                // remove old style and add the new one
                this.backButtonState = value;
            }
        }
    },

    private: {
        overflow: function() {
            this.overflowMenu.open();
        }
    },

    init: function() {
        this.more = function(e) {
            console.error("NOT IMPLEMENTED: more");
        };
        this.morebutton = document.createElement("div");
        this.morebutton.classList.add("el-action", "el-morebutton", "el-managed-action");
        this.morebutton.innerHTML = '<div class="el-action-icon"></div>';
        this.morebutton.firstElementChild.classList.add("el-icon", "core-actionbar-icon-actionoverflow");
        this.morebuttonFastTouch = new FastTouch(this.morebutton, this.overflow.bind(this));
        this.overflowMenu = OverflowMenu.create({
            bar: this.public
        });

        var start = document.createElement("div");
        var end = document.createElement("div");
        start.classList.add("el-bar-start");
        end.classList.add("el-bar-end");
        this.public.appendChild(this.morebutton);
        this.public.appendChild(start);
        this.public.appendChild(end);
        this.backButtonState = BackButtonState.FALSE;
        this.drawerButtonState = DrawerButtonState.FALSE;
        applyAttributes(this.public, module.exports.attributes);
    },

    destroy: function() {
        this.morebutton = undefined;
        this.more = undefined;
        compiler.destroy(this.overflowMenu);
        if (this.overflowMenu.destroy) {
            this.overflowMenu.destroy();
        }
        this.overflowMenu = undefined;
        this.morebuttonFastTouch.destroy();
        this.morebuttonFastTouch = undefined;
        if (this.backbutton) {
            this.backbuttonFastTouch.destroy();
            this.backbuttonFastTouch = undefined;
            this.backbutton = undefined;
        }
        if (this.drawerbutton) {
            this.drawerbuttonFastTouch.destroy();
            this.drawerbuttonFastTouch = undefined;
            this.drawerbutton = undefined;
        }
        this.pop = undefined;
        this.toggleSidemenu = undefined;
    }
};

},{"../../shared/utils.js":118,"../common/fastTouch.js":14,"../overflow-menu/index.js":52}],11:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var events = require('../../shared/events');

module.exports = {

    /**
     * Abstract action type.
     *
     * @class base-action
     * @fires base-action#trigger
     * @el abstract
     * @extends HTMLElement
     */

    /**
     * Dispatched when an action item is tapped. If there are no expandable actions
     * the `trigger` event will be dispatched when the user taps on the action. If
     * there are expandable actions the event will only be dispatched when one of the
     * expandable actions are clicked.
     *
     * ##### Detail:
     * __`action`__ The Action that was trigger.
     *
     * @event base-action#trigger
     * @type {DOMEvent}
     */

    name: "base-action",

    extend: window.HTMLElement,

    /** @lends base-action# */
    public: {

        /**
         * label specifies the label
         * @example <el-<%= name %> data-label="hello"></el-action>
         * @example <%= name %>.label = "hello"
         * @type {string}
         */
        label: {
            get: function() {
                return this.labelEl.textContent;
            },
            set: function(newValue) {
                if (this.labelEl) {
                    this.labelEl.textContent = newValue;
                }
                this.protected.publish("labelChanged", newValue);
            }
        },

        /**
         * disabled sets/gets disabled state
         * @example <el-<%= name %> data-disabled="true"></el-action>
         * @type {boolean}
         * @example <%= name %>.disabled = true
         */
        disabled: {
            get: function() {
                return this.disabled;
            },
            set: function(newValue) {
                if (this.disabled === newValue) {
                    return;
                }
                this.disabled = newValue;
                if (!this.disabled) {
                    this.public.removeAttribute("disabled");
                    this.public.removeAttribute("aria-disabled");
                } else {
                    this.public.setAttribute("disabled", "");
                    this.public.setAttribute("aria-disabled", this.disabled);
                }
                this.protected.publish("disabledChanged", newValue);
            }
        },

        /**
         * description specifies the description for the action item, that appears at the bottom (in horizontal mode only)
         * @example <el-<%= name %> data-description="hello"></el-action>
         * @example <%= name %>.description = "hello"
         * @type {string}
         */
        description: {
            get: function() {
                return this.descriptionEl.textContent;
            },
            set: function(newValue) {
                if (this.descriptionEl) {
                    this.descriptionEl.textContent = newValue;
                }
                this.protected.publish("descriptionChanged", newValue);
            }
        },

        /**
         * iconsource specifies the source of the icon in image format
         * @example <el-<%= name %> data-iconsource="hello.png"></el-action>
         *
         * @example <%= name %>.iconsource = "hello.png";
         *
         * @see iconclass
         * If both iconsource and iconclass are set, then one which was set last
         * is used. It is recommended not to use both properties on the same action.
         * @type {string}
         */
        iconsource: {
            set: function(newValue) {
                if (!newValue) {
                    this.iconEl.style.backgroundImage = "";
                } else {
                    this.iconEl.style.backgroundImage = "url(" + newValue + ")";
                }
                this.iconsource = newValue;
            }
        },

        /**
         * iconclass property allows setting the icon using a CSS class
         * @example <el-<%= name %> data-iconclass="hello"></el-action>
         * @example <%= name %>.iconclass = "hello";
         *
         * @see iconsource
         * If both iconsource and iconclass are set, then one which was set last
         * is used. It is recommended not to use both properties on the same action.
         * @type {string}
         */
        iconclass: {
            set: function(value) {
                if (this.iconclass) {
                    this.toggleImageClass(this.iconclass, false);
                }

                this.toggleImageClass(value, true);
                this.iconclass = value;
            }
        }
    },

    private: {
        /**
         * Sets or removes a class or array of classes on the DOM
         * element that holds the image.
         */
        toggleImageClass: function(classes, toggle) {
            if (!classes) {
                return;
            }
            var classList = this.iconEl.classList;
            classes = classes instanceof Array ? classes : classes.split(" ");
            for (var i = 0; i < classes.length; i++) {
                classList.toggle(classes[i], toggle);
            }
        },
    },

    protected: {

        render: function(template) {
            this.public.innerHTML = template;
            this.labelEl = this.public.querySelector(".el-action-label");
            this.descriptionEl = this.public.querySelector(".el-action-description");
            this.iconEl = this.public.querySelector(".el-action-icon");
        },

        trigger: function() {
            if (!this.disabled) {
                var event = events.trigger({
                    action: this.public
                });
                this.public.dispatchEvent(event);
            }
        }

    },

    init: function() {
        this.disabled = false;
    },

    destroy: function() {
        this.wrapperEl = undefined;
        this.iconEl = undefined;
        this.labelEl = undefined;
        this.descriptionEl = undefined;
        this.iconclass = undefined;
    }
};

},{"../../shared/events":115}],12:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = {

    name: "Collection",

    extend: Array,

    public: {

        append: function(item) {
            var index = this.public.length;
            var result;
            if (Array.isArray(item)) {
                item.unshift(0);
                item.unshift(-1);
                result = Array.prototype.splice.apply(this.public, item);
                // TODO: support coalesced events with the collection adapter api
                for (var i = 0; i < item.length - 2; i++) {
                    this.protected.publish("add", index + i, item[i + 2]);
                }
            } else {
                result = Array.prototype.push.call(this.public, item);
                this.protected.publish("add", index, item);
            }
            return result;
        },

        insert: function(index) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (args.length > 1) {
                args = [index, 0].concat(args);
                Array.prototype.splice.apply(this.public, args);
                for (var i = 0; i < args.length - 2; i++) {
                    this.protected.publish("add", index + i - 2, args[i]);
                }
            } else {
                Array.prototype.splice.call(this.public, index, 0, args[0]);
                this.protected.publish("add", index, args[0]);
            }
            return index;
        },

        push: function() {
            var args = [this.public.length];
            args.push.apply(args, arguments);
            this.public.insert.apply(this.public, args);
            return this.length;
        },

        pop: function() {
            return this.public.remove(this.public.length - 1)[0];
        },

        at: function(index) {
            return this.public[index];
        },

        remove: function(index, count) {
            count = count === undefined ? 1 : count;

            var len = this.public.length;
            var result = Array.prototype.splice.call(this.public, index, count);
            for (var i = 0; i < result.length; i++) {
                this.protected.publish("remove", this.wrapIndex(index + i, len), result[i]);
            }
            return result;
        },

        isEmpty: {
            writable: false,
            get: function() {
                return this.public.length === 0 ? true : false;
            }
        },

        replace: function(index, value) {
            if (this.public[index]) {
                this.public[index] = value;
                this.protected.publish("change", index, value);
                return true;
            } else {
                return false;
            }
        },

        empty: function() {
            // TODO: support coalesced events in the data adapter layer
            //this.protected.publish("reset");
            var items = Array.prototype.splice.call(this.public, 0, this.public.length);
            var len = items.length;
            for (var i = len - 1; i >= 0; i--) {
                this.protected.publish("remove", i, items[i]);
            }
        },

        sort: function(compareFunction) {
            throw new TypeError("Not Implemented: elsa.Collection.sort()");
        },

        reverse: function() {
            throw new TypeError("Not Implemented: elsa.Collection.reverse()");
        },

        splice: function(index, howMany) {
            throw new TypeError("Not Implemented: elsa.Collection.reverse()");
        }
    },

    private: {
        wrapIndex: function(index, length) {
            index = index % length;
            if (index < 0) {
                index += length;
            }
            return index;
        }
    },

    destroy: function() {
        // no-op for now
        Array.prototype.splice.call(this.public, 0, this.public.length);
    }
};

},{}],13:[function(require,module,exports){
/*
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
// http://www.kirupa.com/forum/showthread.php?378287-Robert-Penner-s-Easing-Equations-in-Pure-JS-(no-jQuery)
module.exports = {
    easeOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    },
    easeInCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
    },
    easeInOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
        }
        return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
    },
    easeOutQuad: function(currentIteration, startValue, changeInValue, totalIterations) {
        return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
    },
    linear: function(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * currentIteration / totalIterations + startValue;
    }
};

},{}],14:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var InteractionMode = require('../../shared/interactionMode.js');
var events = require('../../shared/events.js');
/**
 * Mixes in a 'trigger' event that gets dispatched
 * without the 300ms delay some mobile platforms impose on click
 * events.
 *
 * Use `enableFastTouch(targetDispatcher, lock)` to configure fast touching,
 * then listen for the `trigger` event. lock ensures that the element that was originally tapped is the same as the listener.
 *
 * [Cross-Browser Differences](https://docs.google.com/document/d/12k_LL_Ot9GjF8zGWP9eI_3IMbSizD72susba0frg44Y/mobilebasic)
 *
 * Chrome >= 36 (android|desktop)
 * - throttled async touchmoves after scrolling starts (cancelable => false)
 *
 * Chrome >= 32, < 36 (desktop), Chome < 36 (android)
 * - touchcancel on scroll
 *
 * Chrome < 32 (desktop)
 * - sync events when scrolling
 *
 * Android Browser
 * - sync with timeout 4.0.4 has move/end suppressed ?
 *
 * Mobile Safari
 * - sync touchmove ? TODO: test
 *
 * Firefox
 * - async touchmove
 *
 * @class fastTouch
 * @private
 */

var compareRect = function(a, b) {
    return (a.top === b.top && a.left === b.left);
};

var compareRectDelta = function(a, b, delta) {
    return (Math.abs(a.top - b.top) < delta && Math.abs(a.left - b.left) < delta);
};

var pointInRectDelta = function(r, x, y, delta) {
    return (x >= r.left - delta && x <= r.right + delta && y >= r.top - delta && y <= r.bottom + delta);
};

var FastTouch = module.exports = function FastTouch(el, triggerCallback) {
    if (this === FastTouch) {
        return new FastTouch(el, triggerCallback);
    }
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);

    if (!this.protected) {
        this.protected = {
            trigger: triggerCallback
        };
    }
    if (el) {
        this.enableFastTouch(el);
    }
    return this;
};

FastTouch.create = FastTouch;

/**
 * @lends FastTouch#
 */
FastTouch.prototype = {

    dragThreshold: 10,

    originalTouch: undefined,

    enableFastTouch: function(target, lock) {
        if (lock !== undefined) {
            this.lock = lock;
        }
        this.__fastTouchTarget = target;
        // double underscore to ensure no conflicts with mixin target.
        this.__fastTouchTarget.addEventListener("touchstart", this.onTouchStart);
        this.__fastTouchTarget.addEventListener("mousedown", this.onTouchStart);
        return this;
    },
    disableFastTouch: function() {
        // check if fastTouch is enabled
        if (this.__fastTouchTarget) {
            // cleanup in-progress events listeners
            if (this.triggerFrame) {
                window.cancelAnimationFrame(this.triggerFrame);
                this.triggerFrame = undefined;
            }
            if (this.triggerTimeout) {
                clearTimeout(this.triggerTimeout);
            }
            //this.__fastTouchTarget.classList.remove("active");
            //document.body.removeEventListener("touchmove", this.onTouchMove);
            document.body.removeEventListener("touchend", this.onTouchEnd);
            document.body.removeEventListener("touchcancel", this.onTouchCancel);
            //document.body.removeEventListener("mousemove", this.onTouchMove);
            document.body.removeEventListener("mouseup", this.onTouchEnd);
            document.body.removeEventListener("mouseleave", this.onTouchCancel);
            this.__fastTouchTarget.removeEventListener("touchstart", this.onTouchStart);
            this.__fastTouchTarget.removeEventListener("mousedown", this.onTouchStart);
            this.__fastTouchTarget = undefined;
        }
        this.state = "up";
        return this;
    },

    onTouchStart: function(e) {
        this.stateChange("down", e);
    },

    onTouchMove: function(e) {
        if (this.firstMove) {
            this.firstMove = false;
            this.onTouchMoveHandler(e, true);
        } else {
            var self = this;
            window.requestAnimationFrame(function() {
                self.onTouchMoveHandler(e);
            });
        }
    },

    onTouchMoveHandler: function(e, raf) {
        var cancel = false;
        if (!e.cancelable) {
            // Scroll Detected:
            // chome >= 36 uses throttled async moves once scrolling starts
            // cancelable will be false in this case
            this.stateChange("cancel");
            return;
        }

        if (!compareRect(this.boundingClientRect, this.__fastTouchTarget.getBoundingClientRect())) {
            // Scroll Detected:
            // The rect moved
            this.stateChange("cancel");
            return;
        }

        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        if (clientX >= this.boundingClientRect.left - this.dragThreshold && clientX <= this.boundingClientRect.right + this.dragThreshold &&
            clientY >= this.boundingClientRect.top - this.dragThreshold && clientY <= this.boundingClientRect.bottom + this.dragThreshold) {
            this.stateChange("in", e);
        } else {
            this.stateChange("out", e);
            //this.stateChange("cancel");
        }
    },

    onTouchEnd: function(e) {
        if (e.cancelable) {
            e.preventDefault();
        }

        var out = false;
        var scrolled = !e.cancelable;
        var boundingClientRect = this.__fastTouchTarget.getBoundingClientRect();

        if (!scrolled) {
            scrolled = !compareRect(this.boundingClientRect, boundingClientRect);
        }

        if (!scrolled) {
            var clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            var clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            out = !pointInRectDelta(boundingClientRect, clientX, clientY, this.dragThreshold);
            if (out && e.target !== this.__fastTouchTarget) {
                out = !pointInRectDelta(e.target.getBoundingClientRect(), clientX, clientY, this.dragThreshold);
            }
        }
        //console.log("TOUCH END", scrolled, out);
        if (scrolled || out) {
            this.stateChange("cancel");
        } else {
            this.stateChange("up", e);
        }
    },

    onTouchCancel: function(e) {
        //console.log("==> touchcancel (" + e.type + ")");
        this.stateChange("cancel", e);
    },

    "up-exit": function(e) {
        this.boundingClientRect = this.__fastTouchTarget.getBoundingClientRect();
        //this.firstMove = true;

        //document.body.addEventListener("touchmove", this.onTouchMove);
        document.body.addEventListener("touchend", this.onTouchEnd);
        document.body.addEventListener("touchcancel", this.onTouchCancel);
        //document.body.addEventListener("mousemove", this.onTouchMove);
        document.body.addEventListener("mouseup", this.onTouchEnd);
        document.body.addEventListener("mouseleave", this.onTouchCancel);

        if (this.triggerTimeout) {
            clearTimeout(this.triggerTimeout);
        }
    },

    /*"press-enter" : function(e) {
        this.__fastTouchTarget.classList.add("active");
    },

    "press-out-enter" : function(e) {
        this.__fastTouchTarget.classList.remove("active");
    },*/

    "up-enter": function(e) {
        document.body.removeEventListener("touchmove", this.onTouchMove);
        document.body.removeEventListener("touchend", this.onTouchEnd);
        document.body.removeEventListener("touchcancel", this.onTouchCancel);
        document.body.removeEventListener("mousemove", this.onTouchMove);
        document.body.removeEventListener("mouseup", this.onTouchEnd);
        document.body.removeEventListener("mouseleave", this.onTouchCancel);
        //this.__fastTouchTarget.classList.remove("active");
    },

    "trigger-enter": function(e) {
        this.triggerFrame = window.requestAnimationFrame(function() {
            this.triggerFrame = undefined;
            this.stateChange("frame", e);
        }.bind(this));
    },

    "trigger-exit": function(e) {
        if (this.triggerFrame) {
            window.cancelAnimationFrame(this.triggerFrame);
            this.triggerFrame = undefined;
        }

        if (this.lock && this.__fastTouchTarget !== e.target) {
            return;
        }

        var fastTouchTarget = this.__fastTouchTarget || e.target;
        this.triggerTimeout = setTimeout(function() {
            if ('getSelection' in document) {
                var sel = document.getSelection();
                if (sel) {
                    sel.removeAllRanges();
                }
            }

            if (typeof this.protected.trigger === "function") {
                this.protected.trigger(fastTouchTarget, e);
            } else {
                var event = events.trigger({
                    detail: fastTouchTarget
                });
                fastTouchTarget.dispatchEvent(event);
                event = undefined;
            }

            if (e.type.indexOf("mouse") === -1) {
                var click = document.createEvent("MouseEvents");
                click.initMouseEvent("click", true, true, document.defaultView,
                    e.detail, e.clientX, e.clientY, e.clientX, e.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
                click.forwardedTouchEvent = true;
                fastTouchTarget.dispatchEvent(click);
            }

        }.bind(this), 0);
    },

    state: "up",
    stateChange: function(input, param1, param2, param3) {
        /* State-Machine */
        var states = {
            "up": {
                "down": "press"
            },
            "press": {
                "up": "trigger",
                "cancel": "up",
                "out": "press-out"
            },
            "press-out": {
                "up": "up",
                "cancel": "up",
                "in": "press"
            },
            "trigger": {
                "frame": "up",
            },
        };

        var actions = states[this.state];
        var newstate = actions && actions[input];
        if (newstate) {
            var oldstate = this.state;
            //console.log("fastTouch.state (" + input + ") " + oldstate + " => " + newstate);
            this.state = newstate;

            var exitHandler = this[oldstate + "-exit"];
            if (typeof exitHandler === "function") {
                exitHandler.call(this, param1, param2, param3);
            }
            var enterHandler = this[newstate + "-enter"];
            if (typeof enterHandler === "function") {
                enterHandler.call(this, param1, param2, param3);
            }
            return this.state;
        }
        /*else {
            console.log("fastTouch.ignore (" + input + ")");
        }*/
    },

    destroy: function() {
        this.disableFastTouch();
        this.boundingClientRect = undefined;

        this.protected = undefined;
    }

};

FastTouch.mixin = {
    init: function() {
        FastTouch.call(this, this.public);
    },
    destroy: FastTouch.prototype.destroy,
    private: Object.create(FastTouch.prototype, {
        destroy: {
            value: undefined
        }
    })
};

},{"../../shared/events.js":115,"../../shared/interactionMode.js":116}],15:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

/**
 * Single or multi dimensional object pool.
 *
 * Optional keys allow you to create multiple different
 * object pools.
 */
module.exports = Extend.createType({

    name: 'pool',

    public: {
        /**
         * Fetches an object from the pool. If
         * no objects are available, `null` is returned.
         *
         * @param {string} [key] Optional pool key to fetch from.
         */
        get: function(key) {
            var pool = this.public.getPool(key);
            return pool.length ? pool.pop() : null;
        },

        /**
         * Fetches a pool array. If no pool exists at
         * the supplied key, an empty array is returned.
         *
         * @param {string} [key] Pool to fetch. If not provided the default pool is returned.
         */
        getPool: function(key) {
            return this.pool[key] || [];
        },

        /**
         * Puts an object into the pool. If an optional key
         * is specified, that key must be used to `get` the object.
         *
         * @param {object} obj Object to place into the pool.
         * @param {string} [key] Optional pool key to put object in to. If not provided the default pool is used.
         */
        put: function(obj, key) {
            this.pool[key] = this.public.getPool(key);
            this.pool[key].push(obj);
        },

        /**
         * Runs a function on each object in the pool.
         *
         * Optional key lets you run the method on all objects
         * in a single dimension of the pool.
         *
         * Function signature follows `forEach` conventions.
         *
         * @param {function} fn Function to run with objects in the pool.
         * @param {string} [key] Optional pool key. If not provided the method is run on objects in all pools.
         */
        forEach: function(fn, key) {
            if (key) {
                // Array version of `forEach`
                this.public.getPool(key).forEach(fn);
            } else {
                for (var i in this.pool) {
                    this.public.forEach(fn, i);
                }
            }
        },

        /**
         * Empties all pools.
         */
        empty: function() {
            this.pool = {};
        }
    },

    init: function() {
        this.public.empty();
    },

    destroy: function() {
        this.pool = undefined;
    }
});

},{}],16:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var transformPolyfill = window.elsa.utils.styles;

var OverlayTouch = require("../../shared/overlayTouch.js");
var events = require('../../shared/events');

/**
 * Provides a dialog with custom content. Place the desired dialog content inside.
 *
 * @class dialog
 * @extends control
 *
 * @fires dialog#open
 * @fires dialog#close
 *
 * @el control
 * <el-dialog></el-dialog>
 *
 * @demo backbone
 * <caption>Backbone: display a dialog</caption>
 * <template name="dialog.html">
 * <el-page data-controller="backbone:./dialogPage.js">
 *      <el-dialog data-controller="backbone:./dialog.js">
 *          <p>Hi! I am a dialog.</p>
 *          <button id="ok-button">OK</button>
 *          <button id="cancel-button">Cancel</button>
 *      </el-dialog>
 *      <el-page-content>
 *          <p id="status"></p>
 *      </el-page-content>
 *      <el-bar>
 *         <el-action id="open-dialog" data-label="Open Dialog" data-iconclass="fa fa-info"></el-action>
 *      </el-bar>
 * </el-page>
 * </template>
 * <template name="dialog.js">
 * module.exports = Backbone.View.extend({
 *
 *  events: {
 *      "click #ok-button": function(e) {
 *          this.el.close('OK');
 *      },
 *      "click #cancel-button": function() {
 *          this.el.close('Cancel');
 *      }
 *  }
 *
 * });
 * </template>
* <template name="dialogPage.js">
 * module.exports = Backbone.View.extend({
 *
 *  events: {
 *      "close el-dialog": function(e) {
 *          this.el.querySelector("#status").textContent = e.originalEvent.result;
 *      },
 *      "trigger #open-dialog": function() {
 *          this.dialogEl.open();
 *      }
 *  },
 *
 *  initialize: function() {
 *      this.dialogEl = this.el.querySelector("el-dialog");
 *  }
 *
 * });
 * </template>
 *
 * @demo angular
 * <caption>Angular: display a dialog</caption>
 * <template name="dialog.html">
 * <el-page ng-controller="dialogPageCtrl">
 *      <el-dialog id="dialog" el-on="{ close: 'evaluateDialog($event)' }" ng-controller="dialogCtrl">
 *          <p>Hi! I am a dialog.</p>
 *          <button ng-click="close('OK')">OK</button>
 *          <button ng-click="close('Cancel')">Cancel</button>
 *      </el-dialog>
 *      <el-page-content>
 *          <p>{{status}}</p>
 *      </el-page-content>
 *      <el-bar>
 *         <el-action id="open-dialog" el-on="{ trigger: 'openDialog()' }" data-label="Open Dialog" data-iconclass="fa fa-info"></el-action>
 *      </el-bar>
 * </el-page>
 * </template>
 * <template name="dialogPageCtrl.js">
 * angular.module("demo").controller("dialogPageCtrl", function($scope, $element){
 *      var dialog = $element[0].querySelector("#dialog");
 *      $scope.openDialog = function() {
 *          dialog.open();
 *      }
 *      $scope.evaluateDialog = function(e) {
 *          $scope.status = "Dialog result: " + e.result;
 *      }
 * });
 * </template>
 * <template name="dialogCtrl.js">
 * angular.module("demo").controller("dialogCtrl", function($scope, $element){
 *      $scope.close = function(status){
 *          $element[0].close(status);
 *      }
 * });
 * </template>
 *
 */

/**
 * Fired after the dialog is closed
 * @event dialog#close
 * @type {DOMEvent}
 */

/**
 * Fired when the dialog is opened
 * @event dialog#open
 * @type {DOMEvent}
 */

var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
};

module.exports = {

    name: "dialog",

    extend: window.elsa.control,

    events: {
        open: events.createEventType('open', {
            bubbles: true
        }),
        close: events.createEventType('close')
    },

    /** @lends dialog# */
    public: {
        /**
         * Open the dialog.
         *
         * @fires dialog#open
         */
        open: function() {
            var self = this;
            var event = module.exports.events.open();
            window.elsa.App.requestAnimationFrame(this, function() {
                window.elsa.App.requestAnimationFrame(self, function() {
                    window.elsa.App.scene.classList.add("fade-in");
                    self.public.classList.add("fade-in");
                    self.overlayTouch.enableOverlayTouch(window.elsa.App.scene, this.public);
                    /*self.public.addEventListener("mouseup", stopPropagation);
                    self.public.addEventListener("touchend", stopPropagation);
                    self.public.addEventListener("touchcancel", stopPropagation);*/
                });
                self.public.classList.add("open");
                window.elsa.App.scene.classList.add("el-overlay");
            });
            this.public.dispatchEvent(event);
        },
        /**
         * Close the dialog. Optionally, pass in data, which is proxied to the event
         *
         * @fires dialog#close
         */
        close: function(result) {
            var self = this;
            var event = module.exports.events.close({
                result: result
            });
            this.overlayTouch.disableOverlayTouch(window.elsa.App.scene);

            this.scene = window.elsa.App.scene;
            this.scene.addEventListener(transformPolyfill.transitionend, this.hideDialog);
            this.scene.classList.remove("fade-in");
            self.public.classList.remove("fade-in");
            this.public.dispatchEvent(event);
        }
    },

    private: {

        lock: true,

        hideDialog: function(e) {
            this.scene.removeEventListener(transformPolyfill.transitionend, this.hideDialog);
            this.public.classList.remove("open");
            this.scene.classList.remove("el-overlay");
            this.scene = undefined;
        }

    },

    protected: {

        trigger: function() {
            this.public.close();
        }

    },

    init: function() {
        this.hideDialog = this.hideDialog.bind(this);
        this.overlayTouch = new OverlayTouch(undefined, this.protected.trigger.bind(this.protected));
    },

    destroy: function() {
        this.overlayTouch = this.overlayTouch.destroy();
        window.elsa.App.cancelAnimationFrame(this);
        if (this.scene) {
            this.scene.removeEventListener(transformPolyfill.transitionend, this.hideDialog);
            this.scene = undefined;
        }
        this.public.removeEventListener("mouseup", stopPropagation);
        this.public.removeEventListener("touchend", stopPropagation);
        this.public.removeEventListener("touchcancel", stopPropagation);
        this.hideDialog = undefined;
    }

};

},{"../../shared/events":115,"../../shared/overlayTouch.js":117}],17:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var template = require("./template.html");
var FastTouch = require("../common/fastTouch.js");
var applyAttributes = require("../../shared/utils.js").applyAttributes;
var path = require("path");
var utils = require("../../shared/utils");

var routenames = {};

/**
 * Provides primary navigation targets in the {@link drawer drawer}.
 * Each draweritem activates a route using the {@link drawer#defaultroute defaultroute} property when triggered, which is how it ties to other routeables in the application. See the {@link drawer drawer} demos to see this in action.
 * @see drawer
 *
 * @el control
 * <el-draweritem></el-draweritem>
 * @example
 * <el-draweritem data-stateid="myitem" data-label="My Item" data-defaultroute="welcome"></el-draweritem>
 *
 * @class draweritem
 * @extends base-action
 */
module.exports = {

    name: "draweritem",

    extend: Extend.createType(require("../base-action")),

    mixinExtended: [FastTouch.mixin],

    attributes: ["iconsource", "iconclass", "label", "category", "description", "badgecount", "defaultroute", "stateid"],

    /** @lends draweritem# */
    public: {

        /**
         * badgecount indicates the unread count for draweritem.
         * The el-draweritem-new-items class can be applied to the draweritem to make the badge fillout in the theme color, indicating new items.
         * @example <el-draweritem data-badgecount="3"></el-draweritem>
         * @example draweritem.badgecount = "3"
         * @type {number}
         */
        badgecount: {
            get: function() {
                return this.badgecount;
            },
            set: function(newValue) {
                if (typeof newValue === "undefined" || newValue === "" || newValue === null || parseInt(newValue) === 0) {
                    this.badgecountEl.classList.add("el-hidden");
                    this.badgecountEl.textContent = "";
                    this.badgecount = undefined;
                    return;
                }
                this.badgecount = newValue;
                this.badgecountEl.classList.remove("el-hidden");
                this.badgecountEl.textContent = this.badgecount;
                this.protected.publish("badgecountChanged", this.badgecount);
            }
        },

        /**
         * The value that represents the current draweritem in the URL segment when triggered, following `item=`. The {@link drawer drawer} listens for this value and makes changes necessarry for navigation.
         * If undefined, will default to:
         * 1. slugified value of {@link draweritem#label label}
         * 2. Elsa __id
         *
         * @readonly
         * @type {string}
         * @example
         *  <el-drawer data-routename="mailbox">
         *      <nav>
         *          <el-draweritem data-stateid="inbox"></el-draweritem>
         *      </nav>
         *  </el-drawer>
         *
         *  elsa.App.navigateTo("/mailbox?item=inbox/");
         */

        stateid: {
            writable: false
        },

        /**
         * The stack that shows content for this drawer
         * @readonly
         */
        stack: {
            writable: false
        },

        /**
         * The memory management strategy controls what happens to the pages associated with an item when
         * it becomes invisible.
         * Possible values:
         *   * `remove` - removes the pages from the DOM
         *   * `hide` - leaves the page in the DOM, hidden with display:none
         *   * `destroy` - removes the pages from the DOM and destroy them
         *   * `default` - the default behavior for this control
         * @default remove
         * @type {string}
         */
        memorymanagement: {
            value: "remove"
        },

        /**
         * defaultroute indicates where the draweritem should navigate when triggered
         * @example <el-draweritem data-defaultroute="items/item1"></el-draweritem>
         * @example draweritem.defaultroute = "items/item1"
         * @type {string}
         */
        defaultroute: {
            set: function(newRoute) {
                this.stack.defaultroute = newRoute;
            },
            get: function() {
                return this.stack.defaultroute;
            }
        }
    },

    private: {

        createStack: function(params) {
            this.stack = window.elsa.stack.create({
                parentControl: params.parentControl
            });
        },
    },

    protected: {
        creationCompleted: function() {
            this.stack.publish("creationCompleted");
        }
    },

    init: function(params) {
        params = params || {};
        this.sourcepath = params ? params.sourcepath : '/' + this.routename;
        this.defaultroute = params.defaultroute || utils.getAttribute(this.public, "defaultroute");
        this.createStack(params);
        this.protected.render(template);
        this.badgecountEl = this.public.querySelector(".el-action-badgecount");
        applyAttributes(this.public, module.exports.attributes);
        this.stateid = params.stateid || utils.getAttribute(this.public, "stateid") ||
            (this.public.label ? utils.slugify(this.public.label) : false) ||
            (this.defaultroute ? this.defaultroute.split("/")[0] : false);
        if (!this.stateid) {
            throw new Error("draweritem expects label or stateid", this.public, this.sourcepath);
        }
        this.memorymanagement = utils.getAttribute(this.public, "memorymanagement") || this.memoryManagementStrategy;

        if (!this.iconclass && !this.iconsource) {
            this.public.classList.add("no-image");
        } else {
            this.public.classList.remove("no-image");
        }
    },

    destroy: function() {
        if (this.stack && this.stack.destroy) {
            window.elsa.compiler.destroy(this.stack);
        }
        this.wrapperEl = undefined;
        this.iconEl = undefined;
        this.labelEl = undefined;
        this.iconclass = undefined;
        this.descriptionEl = undefined;
        this.iconclass = undefined;
        this.badgecountEl = undefined;

        routenames[this.routename] = undefined;
        this.stack = undefined;
    }
};

},{"../../shared/utils":118,"../../shared/utils.js":118,"../base-action":11,"../common/fastTouch.js":14,"./template.html":18,"path":3}],18:[function(require,module,exports){
module.exports = "<div class=el-action-icon></div><div class=el-action-content><div class=el-action-label></div><div class=el-action-description></div></div><div class=\"el-action-badgecount el-hidden\"></div>";

},{}],19:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var initialized, width, centerHeight, edgeHeight, b, r, t0, t1;
var transformPolyfill = window.elsa.utils.styles;
var isAndroid = navigator.userAgent.match(/Android/i);

/* code to calculate
width = 230;
centerHeight = 80;
edgeHeight = 30;
b = centerHeight / 2 - edgeHeight - (Math.pow(width, 2) / (8 * centerHeight));
r = centerHeight - b;
t0 = (Math.acos(-width / (2 * r)));
t1 = Math.acos(width / (2 * r));
*/

//old values:
/*
t0 = 2.3633753937404136;
t1 = 0.7782172598493797;
r = 210.625;
b = -130.625;
*/

/*t0 = 2.42390205934881;
t1 = 0.7176905942409832;
r = 152.65625;
b = -72.65625;*/

t0 = 2.426018941204166;
t1 = 0.715573712385627;
r = 132.5;
b = -52.5;

module.exports = function distributeFields(children, offsetY) {

    // Part of the android GPU hack, resets the size of the node to scale(0)
    // just before it's animated in order to have the full size version on the GPU
    // while still growing from scale(0).
    if (isAndroid) {
        for (var i = 0; i < children.length; i++) {
            var cs = children[i].style;
            cs[transformPolyfill.transitionDuration] = "0ms";
            cs[transformPolyfill.transform] = "translate(0px, -30px) scale(0)";
        }
    }

    var step = (t1 - t0) / (children.length - 1);
    var count = 0;
    var t = t0;
    for (count = 0; count < children.length; count++) {
        var x = Math.round(r * Math.cos(t));
        var y = Math.round(b + (r * Math.sin(t)));

        var child = children[count];
        var childStyle = child.style;

        // This forces a redraw, working around a bug in Android where nodes that start off scale(0)
        // and then grow are rendered at their compressed size the whole time the scale animation
        // is playing out, resulting in a blurry look. Workaround to force redraw from:
        // http://stackoverflow.com/a/3485654/50299
        if (isAndroid) {
            var noop = child.offsetHeight; // no need to store this anywhere, the reference is enough
            childStyle.visibility = 'visible';
        }

        childStyle[transformPolyfill.transitionDuration] = 180 + (count * 50) + "ms";
        childStyle[transformPolyfill.transform] = "translate(" + x + "px," + (offsetY - y) + "px) scale(1)";

        t += step;
    }

};

},{}],20:[function(require,module,exports){
module.exports = "<div class=el-signature-action-overlay></div><div class=el-signature-action-wrapper><div class=el-expandable-actions></div><div class=el-signature-action-bg></div><div class=\"el-action-icon el-signature-action-icon-box\"></div></div>";

},{}],21:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var transformPolyfill = window.elsa.utils.styles;

var expandableActionTemplate = require("./expandable.html");
var positioner = require("./calc.js");
var applyAttributes = require("../../shared/utils.js").applyAttributes;
var events = require('../../shared/events');
var isAndroid = navigator.userAgent.match(/Android/i);

var getEventX = function(e) {
    if (e.targetTouches) {
        return e.targetTouches[0].clientX;
    } else if (e.touches) {
        return e.touches[0].clientX;
    } else {
        return e.pageX;
    }
};

var getEventY = function(e) {
    if (e.targetTouches) {
        return e.targetTouches[0].clientY;
    } else if (e.touches) {
        return e.touches[0].clientY;
    } else {
        return e.pageY;
    }
};

module.exports = {

    /**
     * Provides a set of {@link action actions} that expand on press and long hold. Must be a direct descendant of `el-page-content`.
     *
     * @class expandable-action
     * @el control
     * <el-expandable-action>
     *   <el-action></el-action>
     *   <el-action></el-action>
     * </el-expandable-action>
     *
     * @extends base-action
     *
     * @demo
     * <caption>Expandable share action</caption>
     * <template name="expandable-action.html">
     * <el-page>
     *   <el-bar>
     *       <div class="title">Expandable action example</div>
     *   </el-bar>
     *   <el-page-content>
     *   </el-page-content>
     *   <el-expandable-action data-label="Share" data-iconclass="fa fa-share-alt"></el-action>
     *       <el-action data-label="Facebook" data-iconclass="fa fa-facebook"></el-action>
     *       <el-action data-label="Twitter" data-iconclass="fa fa-twitter"></el-action>
     *       <el-action data-label="LinkedIn" data-iconclass="fa fa-linkedin"></el-action>
     *   </el-expandable-action>
     * </el-page>
     * </template>
     */

    name: "expandable-action",

    extend: Extend.createType(require("../base-action")),

    attributes: ["iconsource", "iconclass", "label", "category", "description"],

    private: {

        expandableActionDistance: -5,
        debouncedTraceMoveAnimID: undefined,
        oldElement: undefined,
        currentElement: undefined,
        startElement: undefined,

        closeExpanadableActions: function(e) {
            var self = this;
            window.elsa.App.requestAnimationFrame(this, this.closeExpandableActionsFrame);
            this.open = false;
            this.currentElement = undefined;
            this.oldElement = undefined;
            this.startElement = undefined;
            this.public.classList.remove("open");
        },

        closeExpandableActionsFrame: function() {
            for (var count = 0; count < this.subActionsEl.children.length; count++) {
                var child = this.subActionsEl.children[count];
                child.style[transformPolyfill.transform] = "";
            }
            this.overlayEl.classList.remove("open");
        },

        openExpandableActions: function(e) {
            this.open = true;
            var self = this;
            positioner(this.subActionsEl.children, -this.expandableActionDistance);
            this.public.classList.add("open");

            this.openTimeout = setTimeout(function() {
                self.openTimeout = undefined;
                self.overlayEl.classList.add("open");
            }, 50);
        },

        handleTriggered: function(e) {
            this.stateChange("up", e);
        },

        handleTouchMove: function(e) {
            e.preventDefault();
            if (!this.debouncedTraceMoveAnimID) {
                this.debouncedTraceMoveAnimID = window.elsa.App.requestAnimationFrame(this, this.updateCurrentElement, [e]);
            }
        },

        handleTouchCancel: function(e) {
            this.handleCommonTouchFinished();
            this.stateChange("cancel", e);
        },

        handleTouchEnd: function(e) {
            e.preventDefault();

            if (!this.public) {
                return;
            }

            this.handleCommonTouchFinished();
            this.stateChange("up", e);
        },

        handleCommonTouchFinished: function(e) {
            document.body.removeEventListener("mouseleave", this.handleTouchCancel);
            this.mainIconBg.classList.remove("active");
        },

        handleTouchStart: function(e) {
            e.preventDefault();

            var self = this;
            if (this.disabled) {
                return;
            }
            if (this.state === "closed" && e.target === this.overlayEl) {
                return true;
            }

            this.startElement = this.getActionElement(e);

            this.mainIconBg.classList.add("active");
            this.stateChange("down", e);
            document.body.addEventListener("mouseleave", this.handleTouchCancel);
        },

        "closed-exit": function() {
            this.public.addEventListener("touchcancel", this.handleTouchCancel);
            this.public.addEventListener("touchend", this.handleTouchEnd);
            this.public.addEventListener("mouseup", this.handleTouchEnd);
        },
        "closed-enter": function(e) {
            if (this.openTimeout) {
                clearTimeout(this.openTimeout);
                this.openTimeout = undefined;
            }
            this.public.removeEventListener("touchcancel", this.handleTouchCancel);
            this.public.removeEventListener("touchend", this.handleTouchEnd);
            this.public.removeEventListener("mouseup", this.handleTouchEnd);
            document.body.removeEventListener("mouseup", this.handleTouchEnd);
            document.body.removeEventListener("touchend", this.handleTouchEnd);
            document.body.removeEventListener("touchcancel", this.handleTouchCancel);
            this.subActionsEl.removeEventListener("trigger", this.handleTriggered);
            if (e !== "destroy") {
                this.closeExpanadableActions();
            }
        },

        "closed-down-enter": function() {
            var self = this;
            this.timeout = setTimeout(function() {
                self.timeout = undefined;
                self.stateChange("hold");
            }, 400);
            this.public.classList.add("active");
        },
        "closed-down-exit": function() {
            this.openExpandableActions();
            this.public.classList.remove("active");

            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }
            this.subActionsEl.addEventListener("trigger", this.handleTriggered);
            document.body.addEventListener("mouseup", this.handleTouchEnd);
            document.body.addEventListener("touchend", this.handleTouchEnd);
            document.body.addEventListener("touchcancel", this.handleTouchCancel);
        },

        "open-down-enter": function(e) {
            document.body.addEventListener("touchmove", this.handleTouchMove);
            document.body.addEventListener("mousemove", this.handleTouchMove);
        },
        "open-down-exit": function() {
            document.body.removeEventListener("touchmove", this.handleTouchMove);
            document.body.removeEventListener("mousemove", this.handleTouchMove);

            if (this.currentElement && this.currentElement !== this.public) {
                this.currentElement.classList.remove("label-visible");

                // If the element the user started touching is the same as the current one,
                // the action control will dispatch a trigger event itself.
                // Otherwise, we need to dispatch the event.
                if (this.startElement !== this.currentElement) {
                    var event = events.trigger({
                        action: this.currentElement
                    });
                    this.currentElement.dispatchEvent(event);
                    event = undefined;
                }
            }
            if (this.oldElement) {
                this.oldElement.classList.remove("label-visible");
            }
        },

        "open-up-exit": function(e) {
            this.updateCurrentElement(e);
        },

        getActionElement: function(e) {
            var element = document.elementFromPoint(getEventX(e), getEventY(e));
            while (element && element.tagName !== "EL-ACTION" && element.parentElement) {
                element = element.parentElement;
                if (element.tagName === "EL-EXPANDABLE-ACTION" || element.tagName === "EL-PAGE" || element.tagName === "BODY") {
                    element = undefined;
                    break;
                }
            }

            return element;
        },

        updateCurrentElement: function(e) {
            this.debouncedTraceMoveAnimID = undefined;

            this.currentElement = this.getActionElement(e);

            if (this.oldElement) {
                this.oldElement.classList.remove("label-visible");
            }
            if (this.currentElement) {
                this.currentElement.classList.add("label-visible");
                this.oldElement = this.currentElement;
            }
        },

        state: "closed",
        stateChange: function(input, param1, param2, param3) {
            /* State-Machine */
            var states = {
                "closed": {
                    "down": "closed-down"
                },
                "closed-down": {
                    "up": "open-up",
                    "hold": "open-down",
                    "cancel": "closed"
                },
                "open-up": {
                    "down": "open-down",
                    /* enable these to close when clicked/released outside of this page
                    "up": "closed",
                    "cancel": "closed"*/
                },
                "open-down": {
                    "down": "open-up",
                    "up": "closed",
                    "cancel": "open-up"
                },
            };

            var actions = states[this.state];
            var newstate = actions && actions[input];
            if (newstate) {
                var oldstate = this.state;
                if (Object.getPrototypeOf(this.public).constructor.debug) {
                    console.log("action.state (" + input + ") " + oldstate + " => " + newstate);
                }
                this.state = newstate;

                var exitHandler = this[oldstate + "-exit"];
                if (typeof exitHandler === "function") {
                    exitHandler.call(this, param1, param2, param3);
                }
                var enterHandler = this[newstate + "-enter"];
                if (typeof enterHandler === "function") {
                    enterHandler.call(this, param1, param2, param3);
                }
                return this.state;
            } else {

            }
        }
    },

    protected: {

        trigger: function() {
            //do nothing on standard trigger
        }

    },
    /** @lends expandable-action# */
    init: function() {
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchCancel = this.handleTouchCancel.bind(this);
        this.handleTriggered = this.handleTriggered.bind(this);

        var temp = document.createDocumentFragment();
        var timeout,
            e,
            open = false;
        var self = this;

        for (var el = self.public.firstElementChild; el; el = self.public.firstElementChild) {
            if (!el.classList.contains("signature")) {
                el.classList.add("signature");
                el.classList.add("expandable-child");
            }
            temp.appendChild(el);
        }

        this.protected.render(expandableActionTemplate);
        applyAttributes(this.public, module.exports.attributes);
        this.disabled = false;
        this.public.querySelector(".el-expandable-actions").appendChild(temp);
        this.public.classList.add("signature");
        this.overlayEl = this.public.querySelector(".el-signature-action-overlay");
        this.subActionsEl = this.public.querySelector(".el-expandable-actions");
        this.mainIconBg = this.public.querySelector(".el-signature-action-wrapper>.el-signature-action-bg");

        this.public.addEventListener("touchstart", this.handleTouchStart);
        this.public.addEventListener("mousedown", this.handleTouchStart);
    },

    destroy: function() {
        window.elsa.App.cancelAnimationFrame(this);
        document.body.removeEventListener("mouseleave", this.handleTouchCancel);
        document.body.removeEventListener("touchmove", this.handleTouchMove);
        document.body.removeEventListener("mousemove", this.handleTouchMove);
        this["closed-enter"]("destroy");

        this.public.removeEventListener("touchstart", this.handleTouchStart);
        this.public.removeEventListener("mousedown", this.handleTouchStart);
        if (this.openTimeout) {
            clearTimeout(this.openTimeout);
            this.openTimeout = undefined;
        }

        this.handleTouchMove = undefined;
        this.handleTouchStart = undefined;
        this.handleTouchEnd = undefined;
        this.handleTouchCancel = undefined;
        this.handleTriggered = undefined;

        this.mainIconBg = undefined;
        this.overlayEl = undefined;
        this.subActionsEl = undefined;
        this.cancelLongPress = undefined;
        this.openExpandableActions = undefined;
        this.beginTrace = undefined;
        this.traceMove = undefined;
        this.cancelTouchHold = undefined;
        this.currentElement = undefined;
        this.oldElement = undefined;
        this.startElement = undefined;
    }
};

},{"../../shared/events":115,"../../shared/utils.js":118,"../base-action":11,"./calc.js":19,"./expandable.html":20}],22:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var template = require("./template.html");
var applyAttributes = require("../../shared/utils.js").applyAttributes;

/**
 * Provides a top-level navigation element, with a side-menu. Side menu is revealed using the "drawer button" (see bar).
 * The drawer maintains a unique navigation stack for each of its {@link draweritem draweritems}. The current item
 * is stored in the drawer's state variable under the item key.
 * Note: By default, draweritems will not display their icons. To display icons, add "with-icons" class to drawer.
 *
 * @class header
 * @el control
 * <el-header></el-header>
 * @extends HTMLElement
 *
 * @demo
 * <caption>Header with label</caption>
 * <template name="header.html">
 * <el-page>
 *  <el-page-content>
 *      <el-header data-label="Tools"></el-header>
 *      <ul>
 *          <li>Tool 1</li>
 *          <li>Tool 2</li>
 *          <li>Tool 3</li>
 *      </ul>
 *      <el-header data-label="Links" data-iconclass="fa fa-info"></el-header>
 *      <ul>
 *          <li>Tool 1</li>
 *          <li>Tool 2</li>
 *          <li>Tool 3</li>
 *      </ul>
 *  </el-page-content>
 * </el-page>
 * </template>
 */

module.exports = {

    name: "header",

    extend: window.HTMLElement,

    attributes: ["iconsource", "iconclass", "label"],

    precompile: function(el) {
        var shim = Object.create(module.exports.private, {
            public: {
                value: el
            }
        });
        el.innerHTML = template;
        shim.labelEl = el.querySelector(".el-action-label");
        shim.iconEl = el.querySelector(".el-action-icon");

        var attrs = module.exports.attributes;
        for (var i = attrs.length - 1; i >= 0; i--) {
            var attr = attrs[i];
            var value = el.getAttribute('data-' + attr);
            if (value) {
                module.exports.public[attr].set.call(shim, value);
                el.removeAttribute('data-' + attr);
            }
        }
        return el;
    },

    /** @lends header# */
    public: {
        /**
         * label specifies the label
         * @example <el-header data-label="hello"></el-header>
         * @example header.label = "hello"
         */
        label: {
            get: function() {
                return this.labelEl.innerHTML;
            },
            set: function(newValue) {
                this.labelEl.innerHTML = newValue;
            }
        },

        /**
         * iconsource specifies the source of the icon in image format
         * @example <el-header data-iconsource="hello.png"></el-header>
         *
         * @example header.iconsource = "hello.png";
         *
         * @see iconclass
         * If both iconsource and iconclass are set, then one which was set last
         * is used. It is recommended not to use both properties on the same action.
         */
        iconsource: {
            set: function(newValue) {
                if (!newValue) {
                    this.iconEl.style.backgroundImage = "";
                } else {
                    this.iconEl.style.backgroundImage = "url(" + newValue + ")";
                }
                this.iconsource = newValue;
                this.toggleNoIconClass();
            }
        },

        /**
         * iconclass property allows setting the icon using a CSS class
         * @example <el-header data-iconclass="hello"></el-header>
         * @example header.iconclass = "hello";
         *
         * @see iconsource
         * If both iconsource and iconclass are set, then one which was set last
         * is used. It is recommended not to use both properties on the same action.
         */
        iconclass: {
            set: function(value) {
                if (this.iconclass) {
                    this.toggleImageClass(this.iconclass, false);
                }

                this.toggleImageClass(value, true);
                this.iconclass = value;
                this.toggleNoIconClass();
            }
        }
    },

    private: {
        /**
         * Sets or removes a class or array of classes on the DOM
         * element that holds the image.
         */
        toggleImageClass: function(classes, toggle) {
            if (!classes) {
                return;
            }
            var classList = this.iconEl.classList;
            classes = classes instanceof Array ? classes : classes.split(" ");
            for (var i = 0; i < classes.length; i++) {
                classList.toggle(classes[i], toggle);
            }
        },

        /**
         * Sets or removes no-icon class when no icon is present.
         */
        toggleNoIconClass: function() {
            if (!this.iconclass && !this.iconsource) {
                this.public.classList.add("no-icon");
            } else {
                this.public.classList.remove("no-icon");
            }
        }
    },

    init: function() {
        this.public.innerHTML = template;
        this.labelEl = this.public.querySelector(".el-action-label");
        this.iconEl = this.public.querySelector(".el-action-icon");
        //scan for attributes and apply
        applyAttributes(this.public, module.exports.attributes);
        this.toggleNoIconClass();
    },

    destroy: function() {
        this.labelEl = undefined;
        this.iconEl = undefined;
        this.iconclass = undefined;
    }
};

},{"../../shared/utils.js":118,"./template.html":23}],23:[function(require,module,exports){
module.exports = "<div class=el-action-icon></div><div class=el-action-content><div class=el-action-label></div></div>";

},{}],24:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var types = window.elsa;
var plugins = window.elsa.compiler.plugins;

module.exports = Extend.createType({

    name: "list-adapter",

    extend: undefined, //TODO: extend Object when https://jira.bbqnx.net/browse/MEAPCLIENT-739 is fixed

    public: {

        get: function(index) {
            return this.plugin.get(this.public, this.collection, index);
        },

        indexOf: function(item) {
            return this.plugin.indexOf(this.public, this.collection, item);
        },

        length: {
            writable: false,
            get: function() {
                return this.plugin.length(this.public, this.collection);
            }
        }
    },
    private: {
        collection: undefined,
        type: undefined,
        getScheme: function(collection) {
            var scheme;
            if (Array.isArray(collection) || types.collection.prototype.isPrototypeOf(collection)) {
                scheme = 'elsa';
            } else if (window.Backbone && window.Backbone.Collection.prototype.isPrototypeOf(collection)) {
                scheme = 'backbone';
            }
            return scheme;
        },

        getPlugin: function(scheme) {
            if (scheme) {
                var plugin = plugins.get(scheme);
                if (plugin.collection) {
                    return Object.create(plugin.collection);
                }
            }
        }
    },

    init: function(collection) {
        this.collection = collection;
        if (!collection) {
            return;
        }

        var scheme = this.getScheme(collection);
        this.plugin = this.getPlugin(scheme);

        if (this.plugin) {
            this.plugin.bind(this.public, this.collection);
        } else {
            console.error("Unable to load collection plugin for " + scheme);
        }
    },

    destroy: function() {
        if (this.plugin) {
            this.plugin.unbind(this.public, this.collection);
            this.plugin = undefined;
        }
        this.collection = undefined;
    }
});

},{}],25:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var easingEquations = require('../../common/easing.js');

module.exports = Extend.createType({
    name: 'Animator',

    extends: Object,

    public: {
        onAnimated: null,

        /**
         * Read only flag that indicates if the animation has completed.
         */
        complete: {
            writable: false,
            value: true
        },

        /**
         * Runs the animation and returns the new value. If the animation completes
         * the public `complete` flag is set.
         *
         * @param {DOMHighResTimeStamp} timestamp A timestamp when callbacks have begun to fire this frame.
         */
        tick: function(timestamp) {
            if (this.complete) {
                return this.destination;
            }

            timestamp = window.performance.polyfilled ? Date.now() : timestamp;
            //@TODO: this was done to make Blend on iOS work properly
            //timestamp = window.performance.now();
            var deltaTime = Math.min(timestamp - this.startTime, this.duration);
            var scrollVal = this.easingMethod(deltaTime, this.startValue, this.destination, this.duration);

            this.complete = deltaTime >= this.duration;

            this.protected.calculatedCallback(scrollVal);

            return scrollVal;
        },

        /**
         * Configures a scroll animation. Returns whether or not the
         * supplied configuration values will result in a scroll once `tick()`
         * is called.
         */
        configure: function(start, end, duration) {
            this.protected.duration = duration;

            if (duration) {
                this.protected.startValue = start;
                this.protected.destination = end;
                this.protected.startTime = window.performance.polyfilled ? Date.now() : window.performance.now();
            }

            var willAnimate = !!duration;
            this.complete = !willAnimate;
            return willAnimate;
        },

        setEasing: function(method) {
            this.easingMethod = method;
        },

        cancel: function() {
            this.complete = true;
        }
    },

    protected: {
        duration: 0,

        startTime: 0,

        startValue: 0,

        destination: 0,

        calculatedCallback: function(scrollVal) {
            this.protected.dispatchAnimatedCallback(scrollVal);
        },

        dispatchAnimatedCallback: function(scrollVal) {
            if (this.public.onAnimated) {
                this.public.onAnimated(scrollVal);
            }
        }
    },

    private: {
        easingMethod: easingEquations.easeOutCubic
    },

    init: function() {
        this.boundTick = this.public.tick.bind(this.public);
    },

    destroy: function() {
        window.cancelAnimationFrame(this.configureAnimationId);
        window.cancelAnimationFrame(this.tickAnimationId);

        this.boundTick = undefined;
    }
});

},{"../../common/easing.js":13}],26:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = function(friction, minSpeed, sizeMultiplier) {
    return {
        animationDuration: function(pixelsPerMilisecond) {
            var duration = Math.log(minSpeed / pixelsPerMilisecond) / Math.log(friction);
            return duration > 0 ? Math.round(duration) : 0;
        },

        animationLength: function(initialSpeed, duration) {
            var f = friction * sizeMultiplier;
            var factor = (1 - Math.pow(f, duration + 1)) / (1 - f);
            return initialSpeed * factor;
        }
    };
};

},{}],27:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var utils = require('../../../shared/utils.js');

// Simple little object that tracks touch movement over time, treating movement between
// ticks as absolute deltas to be added to the total.
var CumulativeDelta = function() {
    this.getX = utils.getInteractionPositionMethod('x');
    this.getY = utils.getInteractionPositionMethod('y');
    this.delta = 0;
};

CumulativeDelta.prototype.track = function(e) {
    var nowX = this.getX(e);
    var nowY = this.getY(e);

    if (this.lastX !== undefined) {
        // *not* a real distance, but a computationally cheap alternative
        // that gives the pixels moved in both the x and y planes.
        this.delta += Math.abs(nowX - this.lastX) + Math.abs(nowY - this.lastY);
    }

    this.lastX = nowX;
    this.lastY = nowY;
};

module.exports = CumulativeDelta;

},{"../../../shared/utils.js":118}],28:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

/**
 * Calculates a cumumlative moving average (http://en.wikipedia.org/wiki/Moving_average#Cumulative_moving_average) of values.
 * When used with scrolling this makes it feel more natural as the last few touches aren't typically representative of the speed
 * of the flick, so by taking the average of the last several scroll deltas we can get a decent approximation of the force.
 */
module.exports = Extend.createType({
    name: 'MovingAverage',

    extends: Object,

    public: {
        size: 16,

        average: {
            writable: false,
            value: 0
        },

        push: function(value) {
            this.movingAverage += value;
            this.values.push(value);

            // Move the window in a slightly unintuitive but fast way (http://jsperf.com/pop-vs-shift-on-a-array/15)
            while (this.size > 0 && this.values.length > this.size) {
                this.movingAverage -= this.values.splice(0, 1)[0];
            }

            return this.movingAverage / this.values.length;
        },

        reset: function() {
            this.values.length = 0;
            this.movingAverage = 0;
        }
    },

    private: {
        values: null,

        movingAverage: 0
    },

    init: function() {
        this.values = [];
        this.movingAverage = 0;
    },

    destroy: function() {
        this.values = undefined;
    }
});

},{}],29:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var Animator = require('./animator.js');
var easingEquations = require('../../common/easing.js');
var util = require('./animutil.js');

var AnimationPhase = {
    START: 'start',
    END: 'end'
};

var constrain = function(min, max, val) {
    return Math.min(Math.max(val, min), max);
};

module.exports = Extend.createType({
    name: 'OverscrollAnimator',

    extend: Animator,

    public: {
        maxOverscroll: 75,

        configure: function(momentum, start) {
            momentum = constrain(-this.maxMomentum, this.maxMomentum, momentum);

            var duration = this.util.animationDuration(Math.abs(momentum));
            var end = this.util.animationLength(momentum, duration);

            this.public.setEasing(easingEquations.easeOutCubic);

            var willAnimate = this.super.public('configure', start, end, duration);
            this.phase = willAnimate ? AnimationPhase.START : AnimationPhase.END;
            return willAnimate;
        },

        /**
         * Configures the overscroll animator to reset back to its non overscrolled position.
         */
        configureResetScroll: function(destination, start) {
            var duration = Math.abs(destination - start) * 3.5;
            var end = destination - start;
            var willAnimate = this.super.public('configure', start, end, duration);
            this.phase = willAnimate ? AnimationPhase.END : AnimationPhase.START;
            return willAnimate;
        },

        dragOverscroll: function(overscroll) {
            var perc = constrain(-1, 1, overscroll / this.maxOverscroll);
            return this.maxOverscroll * Math.sin(perc * (Math.PI * 0.5));
        }
    },

    protected: {
        minSpeed: 0.2,

        friction: 0.975,

        sizeMultiplier: 0.76,

        maxMomentum: 50,

        calculatedCallback: function(scrollVal) {
            // flip it and reverse it.
            if (this.public.complete && this.phase === AnimationPhase.START) {
                var start = scrollVal;
                var end = this.protected.startValue - scrollVal;
                var duration = this.protected.duration * 1.3;

                this.public.setEasing(easingEquations.easeInOutCubic);
                this.phase = AnimationPhase.END;
                this.super.public('configure', start, end, duration);
            }

            this.protected.dispatchAnimatedCallback(scrollVal);
        }
    },

    private: {
        phase: undefined
    },

    init: function() {
        this.util = util(this.friction, this.minSpeed, this.sizeMultiplier);
    },

    destroy: function() {
        this.util = undefined;
    }
});

},{"../../common/easing.js":13,"./animator.js":25,"./animutil.js":26}],30:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var Animator = require('./animator.js');
var easingEquations = require('../../common/easing.js');
var util = require('./animutil.js');

module.exports = Extend.createType({
    name: 'ScrollAnimator',

    extend: Animator,

    public: {
        configure: function(momentum, start) {
            var duration = this.util.animationDuration(Math.abs(momentum));
            var end = this.util.animationLength(momentum, duration);
            return this.super.public('configure', start, end, duration);
        }
    },

    protected: {
        minSpeed: 0.2,

        friction: 0.995,

        sizeMultiplier: 0.96
    },

    init: function() {
        this.util = util(this.friction, this.minSpeed, this.sizeMultiplier);
    },

    destroy: function() {
        this.util = undefined;
    }
});

},{"../../common/easing.js":13,"./animator.js":25,"./animutil.js":26}],31:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var Animator = require('./animator.js');
var easingEquations = require('../../common/easing.js');

module.exports = Extend.createType({
    name: 'ScrollToAnimator',

    extend: Animator,

    public: {
        onComplete: null,

        updateDestination: function(destination) {
            this.protected.destination = destination;
        }
    },

    protected: {
        calculatedCallback: function(scrollVal) {
            this.protected.dispatchAnimatedCallback(scrollVal);

            if (this.public.complete && this.public.onComplete) {
                this.public.onComplete();
            }
        }
    }
});

},{"../../common/easing.js":13,"./animator.js":25}],32:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = require("ecma5-extend");
var events = require('../../../shared/events.js');

var keyDirectionMap = {
    vertical: {
        Up: -1,
        Down: 1
    },
    horizontal: {
        Left: -1,
        Right: 1
    }
};

module.exports = Extend.createType({

    name: "list-keyboard-interactions",

    select: events.createEventType('select', {
        bubbles: true
    }),

    public: {
        mode: null,

        orientation: null,

        modelProxy: null,

        ctrlMode: false,

        shiftMode: false,

        enabled: {
            set: function(value) {
                if (value) {
                    this.addKeyboardEventListeners();
                } else {
                    this.removeKeyboardEventListeners();
                }
            }
        },

        updateState: function(event) {
            this.processState(event);
        }
    },

    private: {
        addKeyboardEventListeners: function() {
            document.addEventListener('keydown', this.boundKeyPressed);
            document.addEventListener('keyup', this.boundProcessState);
        },

        removeKeyboardEventListeners: function() {
            document.removeEventListener('keydown', this.boundKeyPressed);
            document.removeEventListener('keyup', this.boundProcessState);
        },

        getKeyDirection: function(identifier) {
            return keyDirectionMap[this.public.orientation][identifier] || 0;
        },

        isIndexInvalid: function(index) {
            return index < 0 || index >= this.list.collection.length;
        },

        processState: function(e) {
            this.ctrlMode = e.metaKey || e.ctrlKey;
            this.shiftMode = e.shiftKey;
            return true;
        },

        processSelection: function(direction) {
            if (document.activeElement.tagName !== 'BODY') {
                return false;
            }

            var List = require('../index.js');
            var newIndex, proxied;
            if (this.list.selectedIndices.length) {
                if (this.mode === List.UserSelectable.SINGLE || this.userSelectable === List.UserSelectable.MULTI || this.userSelectable === List.UserSelectable.MULTI_KEYBOARD) {
                    var selectedIndices = this.list.selectedIndices.concat();
                    newIndex = selectedIndices[selectedIndices.length - 1] + direction;

                    if (this.isIndexInvalid(newIndex)) {
                        return false;
                    }

                    proxied = this.modelProxy(newIndex, direction);
                    if (proxied === null) {
                        return false;
                    }

                    if (this.userSelectable === List.UserSelectable.MULTI_KEYBOARD && this.shiftMode) {
                        if (selectedIndices.indexOf(proxied.index) !== -1) {
                            var endToRemove = selectedIndices.length - 1;
                            selectedIndices.splice(endToRemove, 1);
                            this.updateSelectedIndices(selectedIndices);
                        } else {
                            this.updateSelectedIndices(selectedIndices.concat([proxied.index]));
                        }
                    } else {
                        this.updateSelectedIndices([proxied.index]);
                    }

                    if (!this.list.isIndexVisible(proxied.index)) {
                        this.list.scrollTo(proxied.index);
                    }
                }
            } else {
                var firstVisible = this.getFirstVisibleElement();
                if (!firstVisible) {
                    return;
                }

                newIndex = parseInt(firstVisible.getAttribute('data-index')) + direction;
                if (this.isIndexInvalid(newIndex)) {
                    return;
                }

                // Get next item above or below the currently selected one.
                proxied = this.modelProxy(newIndex, direction);
                if (proxied === null) {
                    return false;
                }

                this.list.scrollTo(proxied.index);
            }

            return true;
        },

        updateSelectedIndices: function(indices) {
            this.list.selectedIndices = indices;

            var event = module.exports.select({
                indices: indices.concat()
            });
            this.list.dispatchEvent(event);
        },

        onKeyPressed: function(e) {
            this.processState(e);

            var direction = this.getKeyDirection(e.keyIdentifier);
            if (!direction) {
                return;
            }

            if (this.processSelection(direction)) {
                e.preventDefault();
                return false;
            }
        }
    },

    init: function(list, getFirstVisibleElement) {
        this.list = list;
        this.getFirstVisibleElement = getFirstVisibleElement;
        this.boundKeyPressed = this.onKeyPressed.bind(this);
        this.boundProcessState = this.processState.bind(this);
    },

    destroy: function() {
        this.removeKeyboardEventListeners();
        this.boundKeyPressed = undefined;
        this.boundProcessState = undefined;
        this.getFirstVisibleElement = undefined;
        this.list = undefined;
    }
});

},{"../../../shared/events.js":115,"../index.js":37,"ecma5-extend":1}],33:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = require("ecma5-extend");

module.exports = Extend.createType({

    name: "list-touch-interactions",

    public: {
        mode: null,

        modelProxy: null,

        updateSelection: function(selectedIndices, index, listItem) {
            var deselectedIndices = this.deselectItems(selectedIndices, index);

            // Shift selection, select from the last selected item to the tapped one.
            if (this.mode === this.UserSelectable.MULTI_KEYBOARD && this.keyboardInteractions.shiftMode && selectedIndices.length) {
                var lastIndex = selectedIndices[selectedIndices.length - 1];
                var start = Math.min(lastIndex, index);
                var end = Math.max(lastIndex, index);
                var indices = selectedIndices.concat();
                for (var j = start; j <= end; j++) {
                    var proxy = this.modelProxy(j);
                    if (proxy && deselectedIndices.indexOf(proxy.index) === -1 && selectedIndices.indexOf(proxy.index) === -1) {
                        var item = this.list.querySelector('li[data-index="' + j + '"]');
                        if (item) {
                            item.classList.add('el-listitem-selected');
                        }
                        indices.push(j);
                    }
                }
                selectedIndices = indices;

            } else if ((this.mode === this.UserSelectable.SINGLE && deselectedIndices.indexOf(index) === -1) || (this.mode === this.UserSelectable.MULTI_KEYBOARD && !this.keyboardInteractions.ctrlMode)) {
                listItem.classList.add('el-listitem-selected');
                selectedIndices = [index];
            } else {
                if (deselectedIndices.indexOf(index) === -1) {
                    listItem.classList.add('el-listitem-selected');
                    selectedIndices.push(index);
                }
            }

            this.lastShiftMode = this.keyboardInteractions.shiftMode;

            return selectedIndices;
        },
    },

    private: {
        getIndicesToDeselect: function(selectedIndices, index) {
            if (!selectedIndices.length) {
                return [];
            }

            var List = require('../index.js');
            // deselect an item if the list is in single selection mode and an item is aready selected
            // or if we're in single or multi selection mode and the tapped item is already selected
            var isSingle = this.mode === this.UserSelectable.SINGLE;
            var isMultiKeyboard = this.mode === this.UserSelectable.MULTI_KEYBOARD;
            var isMulti = this.mode === this.UserSelectable.MULTI;
            var existingIndex = selectedIndices.indexOf(index);

            if (isSingle && selectedIndices.length) {
                // Single selection mode means clear the selected indices.
                return selectedIndices.splice(0, selectedIndices.length);
            } else if (isMultiKeyboard && this.keyboardInteractions.shiftMode && (!this.lastShiftMode || existingIndex !== -1) && selectedIndices.length) {
                var firstIndex = selectedIndices[!this.lastShiftMode ? selectedIndices.length - 1 : 0];
                var start = Math.min(firstIndex, index);
                var end = Math.max(firstIndex, index);
                return this.deselectIndicesRange(start, end, selectedIndices);
            } else if (isMultiKeyboard && this.keyboardInteractions.shiftMode && selectedIndices.length) {
                // Handle the case where we've got shift selection of a range, and we shift select past the
                // first selected item in the other direction. For example selection is [2,3] and then we shift-click
                // item 1, selection should now be [1,2] with 3 being deselected.
                var first = selectedIndices[0];
                var last = selectedIndices[selectedIndices.length - 1];
                var down = last - first > 0;
                var isFlipped = ((down && index < first) || (!down && index > last));
                if (isFlipped) {
                    return this.deselectIndicesRange(down ? first : index, down ? index : first, selectedIndices);
                }
            } else if ((isMulti || (isMultiKeyboard && this.keyboardInteractions.ctrlMode)) && existingIndex !== -1) {
                // Multi selection mode and we've tapped an item thats already selected, so deselect.
                return [selectedIndices.splice(existingIndex, 1)[0]];
            } else if (isMultiKeyboard && !this.keyboardInteractions.shiftMode && !this.keyboardInteractions.ctrlMode) {
                return selectedIndices.splice(0, selectedIndices.length);
            }

            return [];
        },

        /**
         * Deselects items that fall outsie the [start, end] range. Removes them from the selectedIndices array
         * and returns the items that were removed.
         */
        deselectIndicesRange: function(start, end, selectedIndices) {
            // Allows for the start/end range to be ascending or descending
            if (start > end) {
                var tmp = start;
                start = end;
                end = tmp;
            }

            var toDeselect = [];
            for (var i = 0; i < selectedIndices.length; i++) {
                if (selectedIndices[i] < start || selectedIndices[i] > end) {
                    toDeselect.push(selectedIndices[i]);
                }
            }

            // Purge items to deselect from the selectedIndices array.
            for (var j = 0; j < toDeselect.length; j++) {
                selectedIndices.splice(selectedIndices.indexOf(toDeselect[j]), 1);
            }

            return toDeselect;
        },

        deselectItems: function(selectedIndices, index) {
            var toDeselectIndices = this.getIndicesToDeselect(selectedIndices, index);
            if (toDeselectIndices) {
                var len = toDeselectIndices.length;
                for (var i = 0; i < len; i++) {
                    var toDeselect = this.list.querySelector('li[data-index="' + toDeselectIndices[i] + '"]');
                    if (toDeselect) {
                        toDeselect.classList.remove('el-listitem-selected');
                    }
                }
            }

            return toDeselectIndices;
        }
    },

    init: function(list, keyboardInteractions) {
        this.list = list;
        this.UserSelectable = require('../index.js').UserSelectable.value;
        this.keyboardInteractions = keyboardInteractions;
    },

    destroy: function() {
        this.list = undefined;
        this.UserSelectable = undefined;
        this.keyboardInteractions = undefined;
    }
});

},{"../index.js":37,"ecma5-extend":1}],34:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var utils = require('../../../shared/utils.js');
var RailState = {
    UNDEFINED: 'undefinedRail',
    ON_RAIL: 'onRail',
    OFF_RAIL: 'offRail'
};

/**
 * Creates a delta and locks the scroll to the rails if they are within the threshold angle.
 */
module.exports = Extend.createType({

    name: 'RailDetector',

    ScrollRailAngle: 30,

    DerailingAngle: 45,

    States: {
        writable: false,
        value: RailState
    },

    public: {
        horizontalRailState: {
            writable: false,
            value: RailState.UNDEFINED
        },

        verticalRailState: {
            writable: false,
            value: RailState.UNDEFINED
        },

        start: function(e) {
            this.lastX = this.xVal(e);
            this.lastY = this.yVal(e);
        },

        track: function(e) {
            if (this.horizontalRailState === RailState.OFF_RAIL && this.verticalRailState === RailState.OFF_RAIL) {
                return;
            }

            var x = this.xVal(e);
            var y = this.yVal(e);

            var dX = x - this.lastX;
            var dY = y - this.lastY;

            var w = Math.abs(dX);
            var h = Math.abs(dY);

            this.lastX = x;
            this.lastY = y;

            var scrollRailAngle = module.exports.ScrollRailAngle;
            var horizontalAngle = scrollRailAngle * (Math.PI / 180);
            var verticalAngle = (Math.PI / 2) - horizontalAngle;

            var derailingAngle = Math.max(module.exports.DerailingAngle, scrollRailAngle);

            var horizontalDerailingAngle = derailingAngle * (Math.PI / 180);
            var verticalDerailingAngle = (Math.PI / 2) - horizontalDerailingAngle;

            var angle = Math.atan(h / w);
            var horizontalRail = angle <= horizontalAngle;
            var verticalRail = angle >= verticalAngle;
            var stayOnHorizontalRail = angle <= horizontalDerailingAngle;
            var stayOnVerticalRail = angle >= verticalDerailingAngle;

            if (this.horizontalRailState === RailState.UNDEFINED && w >= this.threshold) {
                this.horizontalRailState = horizontalRail ? RailState.ON_RAIL : RailState.OFF_RAIL;
                this.verticalRailState = horizontalRail ? RailState.OFF_RAIL : this.verticalRailState;
            }

            if (this.verticalRailState === RailState.UNDEFINED && h >= this.threshold) {
                this.verticalRailState = verticalRail ? RailState.ON_RAIL : RailState.OFF_RAIL;
                this.horizontalRailState = verticalRail ? RailState.OFF_RAIL : this.horizontalRailState;
            }

            if (this.horizontalRailState === RailState.ON_RAIL && stayOnHorizontalRail) {
                dY = 0;
            }

            if (this.verticalRailState === RailState.ON_RAIL && stayOnVerticalRail) {
                dX = 0;
            }

            e.deltaX = dX;
            e.deltaY = dY;
        },

        end: function() {
            this.horizontalRailState = RailState.UNDEFINED;
            this.verticalRailState = RailState.UNDEFINED;
        }
    },

    private: {
        horizontalRailState: undefined,

        verticalRailState: undefined,

        threshold: 10 //TODO: Vary depending on mouse or touch?
    },

    init: function() {
        this.xVal = utils.getInteractionPositionMethod('x');
        this.yVal = utils.getInteractionPositionMethod('y');

        this.public.end();
    },

    destroy: function() {
        this.xVal = undefined;
        this.yVal = undefined;
    }
});

},{"../../../shared/utils.js":118}],35:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var MovingAverage = require('../animation/movingAverage.js');
var utils = require('../../../shared/utils.js');

var GestureState = {
    IDLE: 'idle',
    DETECTING: 'detecting',
    SCROLLING: 'scrolling',
    CANCELLED: 'cancelled'
};

var Events = {
    START: 'start',
    MOVE: 'move',
    END: 'end'
};

var LINE_IN_PX = 19;

var wheelEventPixels = function (evt) {
    // ASSERT(evt && evt instanceof "WheelEvent")
    var mult = 1;
    if (evt.deltaMode === window.WheelEvent.DOM_DELTA_LINE) {
        mult = LINE_IN_PX;
    }
    return -mult * evt.deltaY;
};
/**
 * Detects scrolls. Works horizontally or vertically, depending
 * on the orientation set.
 */
module.exports = Extend.createType({
    name: 'ScrollGestureDetector',

    States: {
        writable: false,
        value: GestureState
    },

    public: {
        threshold: 20,

        orientation: {
            set: function(orientation) {
                this.getScrollInteractionPosition = utils.getInteractionPositionMethod(orientation === 'vertical' ? 'y' : 'x');
                this.getDelta = utils.getEventDelta(orientation === 'vertical' ? 'y' : 'x');
            }
        },

        scrollDelta: {
            writable: false,
            value: 0
        },

        scrollMomentum: {
            writable: false,
            value: 0
        },

        timeSinceLastMove: {
            writable: false,
            value: 0
        },

        state: {
            writable: false,
            value: GestureState.IDLE
        },

        start: function(e) {
            this.state = GestureState.DETECTING;
            this.movingAverage.reset();
            this.lastScrollDelta = this.scrollTriggerTally = this.scrollMomentum = this.scrollMovingAverage = 0;
            this.lastEventPos = this.getScrollInteractionPosition(e);
        },

        track: function(e, isWheelEvent) {
            if (this.state === GestureState.CANCELLED) {
                return;
            }

            var delta;
            if (isWheelEvent) {
                delta = wheelEventPixels(e);
                this.scrollDelta = delta;
            } else {
                var thisPos = this.getScrollInteractionPosition(e);

                delta = e.hasOwnProperty('deltaX') ? this.getDelta(e) : (thisPos - this.lastEventPos);
                this.scrollDelta = this.lastScrollDelta + delta;
                this.lastEventPos = thisPos;
            }

            this.lastScrollTimestamp = e.timeStamp;

            this.scrollTriggerTally += Math.abs(delta);
            this.scrollMomentum = this.calculateScrollMomentum(this.lastScrollDelta - this.scrollDelta);
            this.lastScrollDelta = this.scrollDelta;

            // No point in notifing if we haven't moved
            if (delta !== 0) {
                this.dispatchTrackedEvent(isWheelEvent);
            }
        },

        trackScrollWheel: function(e) {
            e.preventDefault();

            if (this.state !== GestureState.SCROLLING) {
                this.public.start(e);
                this.state = GestureState.SCROLLING;
                this.protected.publish(Events.START);
            }

            this.public.track(e, true);
        },

        end: function(e) {
            this.timeSinceLastMove = e.timeStamp - this.lastScrollTimestamp;
            if (this.state !== GestureState.CANCELLED) {
                this.protected.publish(Events.END);
            }
            this.state = GestureState.IDLE;
        },

        cancel: function() {
            this.state = GestureState.CANCELLED;
        }
    },

    private: {

        getScrollInteractionPosition: function(event) {
            // do nothing, replaced in orientation setter.
        },

        getDelta: function(event) {
            // do nothing, replaced in orientation setter.
        },

        calculateScrollMomentum: function(scrollSizeIncrement) {
            return this.movingAverage.push(scrollSizeIncrement);
        },

        dispatchTrackedEvent: function(isWheelEvent) {
            if (this.state === GestureState.DETECTING && this.scrollTriggerTally > this.threshold) {
                this.state = GestureState.SCROLLING;
                this.scrollDelta = this.lastScrollDelta = 0;
                this.protected.publish(Events.START, isWheelEvent);
            } else if (this.state === GestureState.SCROLLING) {
                this.protected.publish(Events.MOVE, isWheelEvent);
            }
        }
    },

    init: function() {
        this.state = GestureState.IDLE;
        this.movingAverage = MovingAverage.create();
    },

    destroy: function() {
        this.movingAverage.destroy();
        this.scrollMovingAverageSpeeds = undefined;
        this.movingAverage = undefined;
    }
});

},{"../../../shared/utils.js":118,"../animation/movingAverage.js":28}],36:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var utils = require('../../../shared/utils.js');

var GestureState = {
    IDLE: 'idle',
    DETECTING: 'detecting',
    SWIPING: 'swiping',
    CANCELLED: 'cancelled'
};

var SwipeDirection = {
    LEFT: -1,
    RIGHT: 1
};

var Events = {
    START: 'start',
    MOVE: 'move',
    END: 'end'
};

/**
 * Detects swipes. Works horizontally or vertically, depending
 * on the orientation set.
 */
module.exports = Extend.createType({

    name: 'SwipeGestureDetector',

    States: {
        writable: false,
        value: GestureState
    },

    public: {
        threshold: 40,

        state: GestureState.IDLE,

        orientation: {
            set: function(orientation) {
                this.getSwipeInteractionPosition = utils.getInteractionPositionMethod(orientation === 'vertical' ? 'x' : 'y');
                this.getDelta = utils.getEventDelta(orientation === 'vertical' ? 'x' : 'y');
            }
        },

        start: function(e) {
            this.state = GestureState.DETECTING;
            this.lastSwipeDelta = this.swipeTriggerTally = 0;
            this.lastEventPos = this.getSwipeInteractionPosition(e);
        },

        track: function(e) {
            // Occasionally the document will dispatch a move event after an end. To prevent
            // the out of order processing of events, we don't proceed if `end` has already been called.
            if (this.state === GestureState.IDLE) {
                return;
            }

            var thisPos = this.getSwipeInteractionPosition(e);
            var delta = e.hasOwnProperty('deltaX') ? this.getDelta(e) : (thisPos - this.lastEventPos);
            var swipeDelta = this.lastSwipeDelta + delta;

            // No movement, can exit early.
            if (thisPos === this.lastEventPos) {
                return;
            }

            this.lastEventPos = thisPos;

            this.direction = swipeDelta < 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT;
            this.swipeTriggerTally += delta;

            if (this.state === GestureState.DETECTING && Math.abs(this.swipeTriggerTally) > this.public.threshold) {
                this.state = GestureState.SWIPING;
                this.swipeStart = thisPos;
                this.protected.publish(Events.START, this.eventDetails(e, this.direction));
            } else if (this.state === GestureState.SWIPING) {
                this.protected.publish(Events.MOVE, this.eventDetails(e, this.direction));
            }

            this.lastSwipeDelta = swipeDelta;
        },

        end: function(e) {
            if (this.state === GestureState.SWIPING) {
                this.protected.publish(Events.END, this.eventDetails(e, this.direction));
            }
            this.state = GestureState.IDLE;
        },

        cancel: function() {
            this.state = GestureState.CANCELLED;
        }
    },

    private: {
        eventDetails: function(e, direction) {
            return {
                originalEvent: e,
                direction: direction
            };
        },

        getSwipeInteractionPosition: function(event) {
            // do nothing, replaced in orientation setter.
        },

        getDelta: function(event) {
            // do nothing, replaced in orientation setter.
        },

        getDeltaX: function(event) {
            return event.deltaX;
        },

        getDeltaY: function(event) {
            return event.deltaY;
        }
    },

    init: function(threshold) {
        this.public.orientation = 'vertical';

        if (typeof threshold === "number") {
            this.public.threshold = threshold;
        }
    },

    destroy: function() {}
});

},{"../../../shared/utils.js":118}],37:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var styles = window.elsa.utils.styles;

var listSkeletonTemplate = require('./template.html');
var standardListItemTemplate = require('./standardListItem.html');
var DataAdapter = require('./adapter.js');
var KeyboardInteractions = require('./controller/keyboardInteractions.js');
var TouchInteractions = require('./controller/touchInteraction.js');
var SwipeGestureDetector = require('./gestures/swipeGestureDetector.js');
var ScrollGestureDetector = require('./gestures/scrollGestureDetector.js');
var RailDetector = require('./gestures/railDetector.js');
var InteractionMode = require('../../shared/interactionMode.js');
var easing = require('../common/easing.js');
var events = require('../../shared/events.js');
var SwipeActionDelegate = require('./swipe/swipeDelegate.js');
var ScrollAnimator = require('./animation/scrollAnimator.js');
var ScrollToAnimator = require('./animation/scrollToAnimator.js');
var OverscrollAnimator = require('./animation/overscrollAnimator.js');
var CumulativeDelta = require('./animation/cumulativeDelta.js');
var Templater = require('./templates/templater.js');
var Pool = require('../common/pool.js');
var ScrollBar = Extend.createType(require('./scrollbar/scrollbar.js'));

var isAndroid = navigator.userAgent.match(/Android/i);
var aps = Array.prototype.slice;

var partial = function(fn, ctx) {
    var args = aps.call(arguments, 2);
    return function() {
        return fn.apply(ctx, args.concat(aps.call(arguments)));
    };
};

// List of supported template level attributes
var TMPL_ATTR_ITEMSIZE = 'data-itemsize';
var TMPL_ATTR_TRIGGERABLE = 'data-triggerable';
var templateAttributes = [TMPL_ATTR_ITEMSIZE, TMPL_ATTR_TRIGGERABLE];

var UserSelectable = {
    NONE: 'none',
    SINGLE: 'single',
    MULTI: 'multi',
    MULTI_KEYBOARD: 'multi-keyboard'
};

var Events = {
    RENDER: 'render',
    SELECT: 'select',
    SWIPE_START: 'swipestart',
    SWIPE_MOVE: 'swipemove',
    SWIPE_END: 'swipeend'
};

module.exports = {
    /**
     * Dispatched when the list has rendered items into its viewport. Because the list
     * uses delayed rendering to prevent multiple renders in a frame, use this event to
     * know when the list has content.
     *
     * @event list#render
     * @type {DOMEvent}
     */

    /**
     * Dispatched when a list item has been selected or deselected. This event is only
     * dispatched if the list is selectable.
     *
     * ##### Properties:
     * __`indices`__ The indices that were selected
     *
     * @event list#select
     * @type {DOMEvent}
     */

    /**
     * Dispatched when an individual list item is tapped. This event is dispached
     * regardles of whether the list is selectable or allows multi selection.
     *
     * ##### Properties:
     * __`index`__ The index of the selected data model in the collection
     *
     * @event list#trigger
     * @type {DOMEvent}
     */

    /**
     * Dispatched when a swipe gesture has started on a list item. A swipe is started after
     * the user moves the cursor or a touch a fixed ammount in an axis opposite the list's `orientation`.
     *
     * ##### Properties:
     * __`index`__ The index of the item being swiped in the collection.
     * __`direction`__ The direction the swipe is travelling in. Is either 1 or -1.
     * __`swipeDelta`__ The amount the finger has moved since the start of the swipe. Will always be 0 for `swipestart`.
     * __`originalEvent`__ The original Touch or Mouse event. Useful if you need the touch or mouse positions.
     * @event list#swipestart
     * @type {DOMEvent}
     */

    /**
     * Dispatched each time the touch or mouse is moved during a swipe. `swipemove` events
     * will always be dispatched after a `swipestart`.
     *
     * ##### Properties:
     * __`index`__ The index of the item being swiped in the collection.
     * __`direction`__ The direction the swipe is travelling in. Is either 1 or -1.
     * __`swipeDelta`__ The amount the finger has moved since the start of the swipe. May be positive or negative, depending on `direction`.
     * __`originalEvent`__ The original Touch or Mouse event. Useful if you need the touch or mouse positions.
     * @event list#swipemove
     * @type {DOMEvent}
     */

    /**
     * Dispatched when a swipe is complete. A swipe is complete when the user releases the mouse or touch.
     * `swipeend` will always be dispatched after a `swipestart`.
     *
     * ##### Properties:
     * __`index`__ The index of the item being swiped in the collection.
     * __`direction`__ The direction the swipe is travelling in. Is either 1 or -1.
     * __`swipeDelta`__ The amount the finger has moved since the start of the swipe. May be positive or negative, depending on `direction`.
     * __`open`__ If the user swiped far enough that the swipe actions are revealed.
     * __`originalEvent`__ The original Touch or Mouse event. Useful if you need the touch or mouse positions.
     * @event list#swipeend
     * @type {DOMEvent}
     */

    /**
     *
     * The List control displays arrays of data as a scrollable list of rows or columns.
     *
     * The List is composed of three key concepts, collections, models, and list items.
     *
     * * __Collection__: An object that contains a collection of models.
     * * __Model__: A data object whose values are show in the list items.
     * * __List Item__: A visual row in the list that displays the model data.
     *
     * ### Templates
     *
     * Templates define the appearance of the list's items. A list can have multiple templates and depending
     * on values in a model a different template can be shown.
     *
     * By default the list uses a template that supports models with a title, description and image property,
     * all of which are optional. You can specify your own list templates for list items tailored to your needs.
     *
     * The root element of a template defined inline in a list should be a script tag of type
     * `text/template`. This prevents the browser from parsing the contents of the template when
     * the page is first loaded.
     *
     *  #### Properties
     *
     * Top level properties allow you to control the appearance and behaviour of list items. They should be set on
     * the root level `script` tag for the template.
     *
     * * __data-itemsize__: A size value, typically in px. This should always be set if you
     * know the size of your list items will not vary based on content as it improves the performance of recyclable lists.
     * Eg. `data-itemsize="60px"`.
     * * __data-triggerable__: A boolean value indicating if the list items of this template type should cause the list
     * to dispatch a `trigger` event when tapped. Use this for items such as headers.
     * Eg. `data-triggerable="false"`.
     * * __data-use-when__: A query on the model in the format `property:expectedValue`, or simply `property` if the property
     *  on the model is a truthy value. When a model needs to be rendered in to a list item, the query is run against it and
     * if it passes, that template is used. If no data-use-when property is specified on a template, it is treated as the
     * default and used when no data-use-when query matches a model.
     * Eg. `data-use-when="color:blue"`.
     * * __data-template-type__: A string value indicating the type of templating engine to use when rendering the template.
     * See the documentation for `templateType` for more information.
     *
     * #### Template Variables
     * The list implements its own minimal templating language for best performance. Inside your templates
     * elements can be annotated with data attributes that indicate they should be populated with the value
     * of that property. The following data attributes are supported in list templates:
     *
     * * __data-content__: Replaces the textContent of the element with the value of the property.
     * * __data-class__: Adds a class to the element whose name is the value of the property.
     * * __data-src__: Sets the src attribute of the element to the value of the property.
     *
     * @class list
     * @el control
     * <el-list></el-list>
     *
     * @demo backbone
     * <caption>Populating a standard list with items. Expects a model with optional title, description and or image.</caption>
     * <template name="basic-list.html">
     * <el-page data-controller="backbone:./basic-list.js">
     *   <el-page-content>
     *       <el-list id="myList" data-template-type="legacy"></el-list>
     *  </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="basic-list.js">
     * module.exports = Backbone.View.extend({
     *      events: {
     *          'trigger #myList': 'itemSelected'
     *      },
     *
     *      initialize: function() {
     *          var data = {
     *              title: 'Example Title',
     *              description: 'Example Description',
     *              image: 'http://upload.wikimedia.org/wikipedia/en/f/f2/BlackBerry_Messenger_logo.png'
     *          };
     *          var list = this.el.querySelector('#myList');
     *          list.collection = [data, data, data, data, data, data, data, data];
     *      },
     *
     *      itemSelected: function(event) {
     *          this.el.toast({label: 'Triggered! List index: ' + event.originalEvent.index});
     *      }
     * });
     * </template>
     *
     * @demo angular
     * <template name="basic-list.html">
     * <caption>Populating a list with items. The `data-list-repeat` attribute works the same as the ng-repeat directive.</caption>
     * <el-page ng-controller="basicListCtrl">
     *   <el-page-content>
     *       <el-list id="myList" data-list-repeat="item in listCollection">
     *           <script type="text/template" data-itemsize="54px">
     *               <div class="el-listitem">
     *                   <img class="el-listitem-image" src="{{item.image}}"/>
     *                   <div class="el-listitem-textcontent">
     *                       <div class="el-listitem-subtextcontent">
     *                           <div class="el-listitem-title">{{item.title}}</div>
     *                       </div>
     *                       <div class="el-listitem-description">{{item.description}}</div>
     *                   </div>
     *               </div>
     *           </script>
     *       </el-list>
     *  </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="basicListCtrl.js">
     * angular.module("demo").controller("basicListCtrl", function($scope) {
     *    var data = {
     *        title: 'Example Title',
     *        description: 'Example Description',
     *        image: 'http://upload.wikimedia.org/wikipedia/en/f/f2/BlackBerry_Messenger_logo.png'
     *    };
     *
     *    $scope.listCollection = [data, data, data, data, data, data, data, data];
     * });
     * </template>
     *
     * @demo backbone
     * <caption>Setting a fixed height on list item templates with the `data-itemsize` property yeilds better performance
     * because the list can pre-calculate the size and position of list items. If this parameter is omitted the size of the listItem
     * is calculated based on the size of the content.</caption>
     * <template name="list-fixed-height.html">
     * <el-page data-controller="backbone:./list-fixed-height.js">
     *     <style type="text/css">
     *          .listitem-icon { font-size: 5.5em; text-align: center; width: 100%; }
     *     </style>
     *     <el-page-content>
     *         <el-list id="myList" data-template-type="legacy">
     *             <script type="text/template" data-itemsize="100px">
     *                 <div class="el-listitem">
     *                     <span class="listitem-icon fa fa-rocket"></span>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-fixed-height.js">
     * module.exports = Backbone.View.extend({
     *      initialize: function() {
     *          var list = this.el.querySelector('#myList');
     *          var data = {};
     *          list.collection = [data, data, data, data, data, data, data, data];
     *      }
     * });
     * </template>
     *
     * @demo backbone
     * <caption>An example of swipe actions, two on the left and one on the right. The list will dispatch an 'actiontrigger' event.</caption>
     * <template name="list-swipe.html">
     * <el-page data-controller="backbone:./list-swipe.js">
     *     <style type="text/css">
     *          .el-listitem { font-size: 1em; padding: 6px; text-align:center; line-height: 50px }
     *     </style>
     *      <el-bar>
     *          <div class="description">Swipe to reveal contextual actions</div>
     *      </el-bar>
     *      <el-page-content>
     *         <el-list id="myList" data-template-type="mustache">
     *             <script type="text/template" data-itemsize="60px">
     *                 <div class="el-listitem">
     *                     <el-action data-position="left" data-label="Approve" data-iconclass="fa fa-check"></el-action>
     *                     <el-action data-position="left" data-label="Share" data-iconclass="fa fa-share"></el-action>
     *                     <el-action data-position="right" data-label="Delete" data-iconclass="fa fa-trash"></el-action>
     *                     <i class="fa fa-angle-left"></i>
     *                     <span class="listitem-title">{{title}}</span>
     *                     <i class="fa fa-angle-right"></i>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-swipe.js">
     * module.exports = Backbone.View.extend({
     *      events: {
     *          "actiontrigger #myList": "actionSelected"
     *      },
     *
     *      initialize: function() {
     *          var data = {
     *              title: "Swipe me"
     *          };
     *          var list = this.el.querySelector("#myList");
     *          list.collection = [data, data, data, data, data, data, data, data];
     *      },
     *
     *      actionSelected: function(event) {
     *          this.el.toast({label: "Triggered! List index: " + event.originalEvent.index + " Action: " + event.originalEvent.action.label});
     *      }
     * });
     * </template>
     *
     * @demo backbone
     * <caption>An example of swipe actions with custom backing content. Each action is stretched to be 100% of the width of the list item,
     * and the swipeend event is cancelled, closing the swipe UI as soon as the swipe is complete. This lets users execute actions with only
     * a swipe.</caption>
     * <template name="list-swipe-backing.html">
     * <el-page data-controller="backbone:./list-swipe-backing.js">
     *     <style type="text/css">
     *          #myList el-action { width: 100%; }
     *          #myList el-swipeui { width: 100%; }
     *          #myList el-action[data-position="left"] { width: 100%; background-color: green; }
     *          #myList el-action[data-position="right"] { width: 100%; background-color: red; }
     *          .el-listitem { font-size: 1em; padding: 6px; text-align:center; line-height: 50px }
     *     </style>
     *      <el-bar>
     *          <div class="description">Swipe to reveal contextual actions</div>
     *      </el-bar>
     *      <el-page-content>
     *         <el-list id="myList" data-template-type="mustache" data-swipe-events="true">
     *             <script type="text/template" data-itemsize="60px">
     *                 <div class="el-listitem">
     *                     <div>
     *                         <div>
     *                             <el-action data-position="left"></el-action>
     *                             <el-action data-position="right"></el-action>
     *                         </div>
     *                     <div>
     *                     <i class="fa fa-angle-left"></i>
     *                         <span class="listitem-title">{{title}}</span>
     *                     <i class="fa fa-angle-right"></i>
     *                     </div>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-swipe-backing.js">
     * module.exports = Backbone.View.extend({
     *      events: {
     *          "swipeend #myList": "listItemSwiped"
     *      },
     *
     *      initialize: function() {
     *          var data = {
     *              title: "Swipe me"
     *          };
     *          var list = this.el.querySelector("#myList");
     *          list.collection = [data, data, data, data, data, data, data, data];
     *      },
     *
     *      listItemSwiped: function(event) {
     *          var list = event.currentTarget;
     *          setTimeout(function() {
     *              list.cancelSwipe();
     *          }, 1000);
     *          this.el.toast({label: "Swiped! List index: " + event.originalEvent.index + " Direction: " + event.originalEvent.direction + " Opened Actions: " + event.originalEvent.open});
     *      }
     * });
     * </template>
     *
     * @demo angular
     * <caption>An example of swipe actions, two on the left and one on the right. The list will dispatch an 'actiontrigger' event.</caption>
     * <template name="list-swipe.html">
     * <el-page ng-controller="swipeCtrl">
     *     <style type="text/css">
     *          .el-listitem { font-size: 1em; padding: 6px; text-align:center; line-height: 50px }
     *          .description { font-size: 0.9em; color: #444; text-align:center; width: 100%}
     *     </style>
     *      <el-bar>
     *              <div class="description">Swipe to reveal contextual actions</div>
     *      </el-bar>
     *      <el-page-content>
     *       <el-list id="myList" data-list-repeat="item in listCollection">
     *             <script type="text/template" data-itemsize="60px">
     *                 <div class="el-listitem">
     *                     <el-action data-position="left" data-label="Approve" data-iconclass="fa fa-check" el-on="{trigger: 'toast({label: \'Trigger Approve\'})'}"></el-action>
     *                     <el-action data-position="left" data-label="Share" data-iconclass="fa fa-share" el-on="{trigger: 'toast({label: \'Trigger Share\'})'}"></el-action>
     *                     <el-action data-position="right" data-label="Delete" data-iconclass="fa fa-trash" el-on="{trigger: 'toast({label: \'Trigger Delete\'})'}"></el-action>
     *                     <i class="fa fa-angle-left"></i>
     *                     <span class="listitem-title">{{item.title}}</span>
     *                     <i class="fa fa-angle-right"></i>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="swipeCtrl.js">
     * angular.module("demo").controller("swipeCtrl", function($scope) {
     *    var data = {
     *        title: "Swipe me"
     *    };
     *
     *    $scope.listCollection = [data, data, data, data, data, data, data, data];
     * });
     * </template>
     *
     * @demo backbone
     * <caption>Multiple list item templates that are chosen based on properties in the list's models. By using the data-use-when attribute we can control what template to use when.</caption>
     * <template name="list-multiple-templates.html">
     * <el-page data-controller="backbone:./list-multiple-templates.js">
     *     <style type="text/css">
     *          .listitem { padding: 10px; }
     *          .listitem-icon { float: left; padding-right: 5px; }
     *          .complete { background-color: darkgreen; }
     *     </style>
     *     <el-page-content>
     *         <el-list id="myList" data-template-type="legacy">
     *             <script type="text/template" data-use-when="complete:false">
     *                 <div class="listitem">
     *                     <span class="listitem-icon fa fa-trash"></span>
     *                     <div data-content="title"></div>
     *                 </div>
     *             </script>
     *             <script type="text/template" data-use-when="complete:true">
     *                 <div class="listitem complete">
     *                    <span class="listitem-icon fa fa-check"></span>
     *                    <div data-content="title"></div>
     *                </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-multiple-templates.js">
     * module.exports = Backbone.View.extend({
     *      initialize: function() {
     *          var list = this.el.querySelector("#myList");
     *          var data = [];
     *          for(var i = 0; i < 50; i++) {
     *              data.push(this.createDataItem(i));
     *          }
     *          list.collection = data;
     *      },
     *
     *      createDataItem: function(i) {
     *          return {
     *              complete: i % 2 === 0,
     *              title: "Message " + i
     *          };
     *      }
     * });
     * </template>
     *
     *
     * @demo backbone
     * <caption>An example of an 'infinite' list. By using the `data-recycle-nodes` property the list only creates as many nodes as
     * are needed to fill the viewport of the list. This can result in significant speedups with large datasets.</caption>
     * <template name="infinite-list.html">
     * <el-page data-controller="backbone:./list-recycle.js">
     *     <el-page-content>
     *         <el-list id="myList" data-template-type="legacy" data-recycle-nodes="true"></el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-recycle.js">
     * module.exports = Backbone.View.extend({
     *      initialize: function() {
     *          var list = this.el.querySelector("#myList");
     *          var data = [];
     *          for(var i = 0; i < 5000; i++) {
     *              data.push(this.createDataItem(i));
     *          }
     *          list.collection = data;
     *      },
     *
     *      createDataItem: function(i) {
     *          return {title: "Message " + i};
     *      }
     * });
     * </template>
     *
     *
     * @demo backbone
     * <caption>A `modelTransform` function allows you to transform and filter your data before it's desplayed.</caption>
     * <template name="list-model-transform.html">
     * <el-page data-controller="backbone:./list-model-transform.js">
     *     <el-page-content>
     *         <input type="text" id="myInput" placeholder="Filter 5,000 models by title."></input>
     *         <el-list id="myList" data-template-type="legacy" data-recycle-nodes="true"></el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-model-transform.js">
     * module.exports = Backbone.View.extend({
     *      events: {
     *          "keyup #myInput": "handleInput"
     *      },
     *
     *      initialize: function() {
     *          this.list = this.el.querySelector("#myList");
     *          this.updateFilter();
     *
     *          var data = [];
     *          for(var i = 0; i < 5000; i++) {
     *              data.push(this.createDataItem(i));
     *          }
     *          this.list.collection = data;
     *      },
     *
     *      handleInput: function(event) {
     *          this.updateFilter(event.target.value.toLowerCase());
     *      },
     *
     *      updateFilter: function(needle) {
     *          this.list.modelTransform = function(model) {
     *
     *              // If the title property contains the string typed into the input or the input is empty, show the item.
     *              if(!needle || needle.length === 0 || model.title.toLowerCase().indexOf(needle) !== -1) {
     *                  var date = new Date();
     *                  var seconds = (date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds());
     *                  var minutes = (date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes());
     *
     *                  // creates a new property that is passed to the list template but doesn't modify the original model.
     *                  model.description = "Shown at: " + date.getHours() + ":" + minutes + ":" + seconds;
     *                  return model;
     *              } else {
     *                  return null; // returning null means the item will not be shown.
     *              }
     *          };
     *      },
     *
     *      createDataItem: function(i) {
     *          return {title: "Message " + i};
     *      }
     * });
     * </template>
     *
     *
     * @demo backbone
     * <caption>The `userSelectable` property controls if one or more items can be selected.
     * Once items are selected, the list's `selectedIndex` and `selectedIndices` property is set.</caption>
     * <template name="list-user-selectable.html">
     * <el-page data-controller="backbone:./list-user-selectable.js">
     *     <style type="text/css">
     *         .selection-btn-group {
     *              width: 100%;
     *              box-sizing: border-box;
     *         }
     *     </style>
     *     <el-bar>
     *          <div id="types" class="btn-group selection-btn-group">
     *              <button type="button" class="btn-default" value="none">None</button>
     *              <button type="button" class="btn-default" value="single">Single</button>
     *              <button type="button" class="btn-default" value="multi">Multi</button>
     *              <button type="button" class="btn-default" value="multi-keyboard">Keyboard</button>
     *          </div>
     *     </el-bar>
     *     <el-page-content>
     *          <el-list id="myList"></el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="list-user-selectable.js">
     * module.exports = Backbone.View.extend({
     *     events: {
     *         "click button": "buttonClick",
     *         "trigger #myList": "itemTriggered"
     *     },
     *
     *     initialize: function() {
     *         this.list = this.el.querySelector("#myList");
     *         var data = [];
     *         for(var i = 0; i < 100; i++) {
     *             data.push(this.createDataItem(i));
     *         }
     *         this.list.collection = data;
     *     },
     *
     *     createDataItem: function(i) {
     *         return {
     *             title: "Message " + i
     *         };
     *     },
     *
     *     buttonClick: function(event) {
     *         var buttons = this.el.querySelectorAll("button");
     *         for(var i = 0; i < buttons.length; i++) {
     *             buttons[i].classList.remove("selected");
     *         }
     *         event.target.classList.add("selected");
     *
     *         this.list.userSelectable = event.target.value;
     *     },
     *
     *     itemTriggered: function(event) {
     *          this.el.toast({label: "Selected Index: " + this.list.selectedIndex + " Selected Indices: [" + this.list.selectedIndices + "]"});
     *     }
     * });
     * </template>
     *
     *
     * @demo angular
     * <caption>The `userSelectable` property controls if one or more items can be selected.
     * Once items are selected, the list's `selectedIndex` and `selectedIndices` property is set.</caption>
     * <template name="list-selection.html">
     * <el-page ng-controller="selectableListCtrl">
     *     <style type="text/css">
     *         .selection-btn-group {
     *              width: 100%;
     *              box-sizing: border-box;
     *         }
     *     </style>
     *     <el-bar>
     *          <div id="types" class="btn-group selection-btn-group">
     *              <button type="button" class="btn-default" ng-class="{selected: type == 'none'}" ng-click="type='none'">None</button>
     *              <button type="button" class="btn-default" ng-class="{selected: type == 'single'}" ng-click="type='single'">Single</button>
     *              <button type="button" class="btn-default" ng-class="{selected: type == 'multi'}" ng-click="type='multi'">Multi</button>
     *              <button type="button" class="btn-default" ng-class="{selected: type == 'multi-keyboard'}" ng-click="type='multi-keyboard'">Keyboard</button>
     *          </div>
     *     </el-bar>
     *     <el-page-content>
     *       <el-list id="myList" data-user-selectable="{{type}}" data-list-repeat="item in listCollection" ng-model="selectedIndices">
     *           <script type="text/template" data-itemsize="54px">
     *               <div class="el-listitem" el-on="{trigger:'toast({label: \'Selected Indices: [\' + selectedIndices + \']\'})'}">
     *                    <div class="el-listitem-textcontent">
     *                         <div class="el-listitem-title">{{item.title}}</div>
     *                    </div>
     *               </div>
     *           </script>
     *       </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="basicListCtrl.js">
     * angular.module("demo").controller("selectableListCtrl", function($scope) {
     *    var data = {title: "Example Title"};
     *    $scope.listCollection = [data, data, data, data, data, data, data, data];
     *    $scope.selectedIndices = [];
     *    $scope.type = "none";
     * });
     * </template>
     *
     * @demo backbone
     * <caption>An example of list items templated with different templating libraries. Mustache and Underscore must be loaded via script
     * tag to make them available to the list. `The data-template-type` attribute also works on the root el-list tag, setting the template type for all templates.</caption>
     * <template name="templating-languages.html">
     * <el-page data-controller="backbone:./mustache-list-item.js">
     *     <style type="text/css">
     *         .listitem-icon { font-size: 5.3em; text-align: center; width: 100%; }
     *     </style>
     *     <el-page-content>
     *         <el-list id="myList">
     *             <script type="text/template" data-itemsize="93px" data-template-type="mustache">
     *                 <div class="el-listitem">
     *                     <span class="listitem-icon fa fa-{{icon}}"></span>
     *                 </div>
     *             </script>
     *             <script type="text/template" data-itemsize="30px" data-template-type="underscore" data-use-when="title">
     *                 <div class="el-listitem">
     *                     <span><%= title %></span>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="mustache-list-item.js">
     * module.exports = Backbone.View.extend({
     *      initialize: function() {
     *          var list = this.el.querySelector("#myList");
     *          list.collection = [{title: "Modes of Transportation"}, {icon: "bicycle"}, {icon: "car"}, {icon: "bus"}, {icon: "truck"}, {icon: "rocket"}];
     *      }
     * });
     * </template>
     *
     * @demo backbone
     * <caption>A horizontal list.</caption>
     * <template name="horizontal-list.html">
     * <el-page data-controller="backbone:./horizontal-list.js">
     *     <style>
     *         .bargraph {
     *             background: #3fb2e2;
     *             position: absolute;
     *             bottom: 0;
     *             left: 2px;
     *             width: 21px;
     *         }
     *         el-list {
     *             height: 500px;
     *         }
     *     </style>
     *     <el-page-content>
     *         <el-list id="myList" data-orientation="horizontal">
     *             <script type="text/template" data-template-type="mustache" data-itemsize="25px">
     *                 <div class="el-listitem">
     *                     <div class="bargraph" style="height: {{index}}%;"></div>
     *                 </div>
     *             </script>
     *         </el-list>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="horizontal-list.js">
     * module.exports = Backbone.View.extend({
     *      initialize: function() {
     *          this.list = this.el.querySelector("#myList");
     *          var data = [];
     *          for(var i = 0; i < 100; i++) {
     *              data.push({index: i});
     *          }
     *          this.list.collection = data;
     *      }
     * });
     * </template>
     *
     * @fires list#trigger
     * @fires list#swipestart
     * @fires list#swipemove
     * @fires list#swipeend
     * @extends HTMLElement
     */
    name: 'list',

    extend: window.HTMLElement,

    select: events.createEventType(Events.SELECT, {
        bubbles: true
    }),

    render: events.createEventType(Events.RENDER, {
        bubbles: false
    }),

    Events: {
        writable: false,
        value: Events
    },

    UserSelectable: {
        writable: false,
        value: UserSelectable
    },

    attributes: ['selectedIndex', 'selectedIndices', 'userSelectable', 'dispatchSwipeEvents', 'orientation'],

    /** @lends list# */
    public: {

        /**
         * Gets or sets one or more templates to be used to render model data into list items.
         *
         * A template can be either a string, a DOM tree, or a function that returns a string
         * or a DOM tree when called with no arguments.
         *
         * An array of templates can be supplied with a special `data-use-when` attribute on the
         * root element. The value of data-use-when is in the format `property:expectedValue`.
         * Whenever a model satisfies the data-use-when query, the associated template is used to
         * render the list item.
         *
         * If one of the templates in the supplied array does not have the `data-use-when` attribute
         * it will be used as the default template.
         *
         * If an array of templates is supplied and no `data-use-when` condition is met and there is no
         * default template with no `data-use-when` attribute, the default list item template is used.
         *
         * If no templates are set an empty array is returned and the list will use the standard list item
         * template, which supports 'title', 'subtitle', 'description', and 'image' properties.
         *
         * @type {string|Array}
         * @example
         * list.itemTemplate = require('templates/listItemTemplate.html');
         *
         * @example
         * list.itemTemplate = [
         *    require('templates/listHeaderTemplate.html'),
         *    require('templates/listItemTemplate.html')
         * ];
         */
        itemTemplate: {
            get: function() {
                return this.itemTemplate || [];
            },
            set: function(value) {
                value = Array.isArray(value) ? value : [value];

                // reset node list, otherwise items from this array will be pooled (and are no longer valid)
                this.nodeList = [];
                this.extrasAddedToPool = false;
                this.emptyPool();

                this.listItemTemplates = this.createTemplateLookup(value);
                this.itemTemplate = value;
                this.invalidate();
            }
        },

        /**
         * Gets or sets the collection of data models shown in the list.
         *
         * A collection can be share by multiple list components.
         *
         * The collection can be an array of plain objects or it can be a dynamic collection
         * that emits change, add, and remove events such as a Backbone Collection that
         * contains Backbone Models.
         *
         * In order to update the list visually when using a plain JavaScript array you must
         * reset the collection on the list in order to see your change.
         *
         * @type {Collection}
         * @example
         * list.collection = [{title:'Frank'}, {title:'Donna'}];
         */
        collection: {
            set: function(value) {
                this.collection = value;
                this.collectionAdapter = DataAdapter.create(value);

                this.onChangeHandler = this.modelChanged.bind(this);
                this.boundAddedHandler = this.modelAdded.bind(this);
                this.boundRemovedHandler = this.modelRemoved.bind(this);

                this.collectionAdapter.subscribe('change', this.onChangeHandler);
                this.collectionAdapter.subscribe('add', this.boundAddedHandler);
                this.collectionAdapter.subscribe('remove', this.boundRemovedHandler);

                this.scrollbar.collectionSize = this.collectionAdapter.length;

                this.invalidate();
            }
        },

        /**
         * Sets the direction that the list will scroll. Vertical scrolling
         * indicates the list will scroll up and down and list items will appear as rows.
         * Horizontal scrolling will scroll the list left and right, and list items will appear as columns.
         *
         * Valid values are `vertical` or `horizontal`. The default value is `vertical`.
         *
         * Can be applied on the `<el-list>` tag via the 'data-orientation' attribute.
         *
         * @default vertical
         * @type {string}
         */
        orientation: {
            set: function(value) {
                if (this.orientation !== value) {
                    this.orientation = value;
                    this.configureOrientation(this.orientation);
                    this.invalidate();
                }
            }
        },

        /**
         * Gets or sets the selected index of the item that is selected.
         *
         * A value of `-1` indicates that no item is selected. If multiple selections are made then selectedIndex is the index
         * of the last item selected.
         *
         * @default -1
         * @type {int}
         */
        selectedIndex: {
            get: function() {
                return this.selectedIndices.length ? this.selectedIndices[this.selectedIndices.length - 1] : -1;
            },
            set: function(value) {
                if (typeof value !== 'number') {
                    throw new Error("selectedIndex must be an integer");
                }
                this.public.selectedIndices = [value];
            }
        },

        /**
         * Gets or sets the array that indicates what items were selected from the list. Set this property
         * to select list items programmatically.
         *
         * If a single selected item is selected using the {@link list#selectedIndex selectedIndex} property, this property returns
         * an array of {@link list#selectedIndex selectedIndex}.
         *
         * If no items are selected, this property is an empty array.
         *
         * The sequence of the items in the array reflects the order in which they were selected by the user.
         *
         * If selectedIndices is set programatically but selectable is false the user will not be able to deselect
         * items by tapping on them.
         *
         * Modifying the selectedIndices array itsef will not update the selection of the list.
         * The property setter must be used.
         *
         * @default []
         * @type {Array}
         */
        selectedIndices: {
            set: function(values) {
                values = Array.isArray(values) ? values : [];

                this.toggleSelectedIndices(this.selectedIndices, false);
                this.selectedIndices = values;
                this.toggleSelectedIndices(values, true);
            }
        },

        /**
         * String that indicates if list items can be selected by the user by tapping on list items.
         *
         * Valid values are `none`, `single`, `multi` and `multi-keyboard`.
         *
         * * __`none`__: Items do not visually change appearance when tapped, and do not alter the `selectedIndex` or `selectedIndices` properties.
         * * __`single`__: User can select one item at a time. Modifies the `selectedIndex` property to reflect the selected item.
         * The `selectedIndices` property will be an array with one element, the `selectedIndex`.
         * * __`multi`__: User can select multiple items by tapping on them. Each tapped item adds an element to the `selectedIndices` array,
         * unless an already selected item is tapped, in which case it is removed. The `selectedIndex` property will be the first item selected.
         * * __`multi-keyboard`__: A single item can be tapped at a time, unless the 'shift' or 'control' keys are pressed.
         * If the shift key is pressed all items between the last selected item and the tapped item are selected. If 'control' is pressed the behavour is the same as `multi`.
         *
         * Can be applied on the `<el-list>` tag via the 'data-user-selectable' attribute.
         *
         * @default none
         * @type {string}
         */
        userSelectable: {
            value: UserSelectable.NONE,
            set: function(value) {
                this.keyboardInteractions.mode = this.touchInteractions.mode = value;
                this.userSelectable = value;
            }
        },

        /**
         * Boolean that indicates whether `swipestart`, `swipemove` and `swipeend` events should be dispatched
         * by the list when the user swipes on a list item. For performance reasons these events must
         * be opted in to with this property.
         *
         * By calling preventDefault() on any of the swipe events the swipe is cancelled and no more swipe events
         * will be dispatched for that swipe.
         *
         * Can be applied on the `<el-list>` tag via the 'data-swipe-events' attribute.
         *
         * @example
         * list.dispatchSwipeEvents = true; // without this, the events below will not trigger.
         * list.addEventListener('swipestart', function(e) { console.log("Swipe Started"); });
         * list.addEventListener('swipemove', function(e) { console.log("Swipe Moved:", e.originalEvent.clientX); });
         * list.addEventListener('swipeend', function(e) { console.log("Swipe Ended"); });
         *
         * @default false
         */
        dispatchSwipeEvents: false,

        /**
         * A function that is called before a model is shown in a list item.
         *
         * The modelTransform method lets you to transform existing properties in to new ones
         * or conditionally hide/show content depending on the model data.
         *
         * For instance, you may want transform milliseconds since epoch into a human readable
         * date, or decide to set a property based on some condition.
         *
         * The modelTransform function is passed a copy of the model data and the index of that model in the collection.
         * It is a copy of the original model so you can modify it without affecting the original
         * model object, which may be shared with other components. If your models aren't plain JavaScript objects,
         * (such as Backbone Models) then a plain JavaScript version the model is supplied to the model transform. Note
         * that child models remain complex.
         *
         * If the method returns null the model is skipped and the next one in the collection is used. This can be used to implement
         * efficient filtering as the filter is run per item as the user scrolls through the list.
         *
         * __Note__: Where you can, always try to have the model data in the correct format instead of using
         * a modelTransform. This may mean preprocessing your data models and creating a second, processed
         * set. Avoiding calculations in modelTransform keeps scroll performance snappy.
         *
         * __Note__: If the models supplied have a `toJSON` method on them, the result of that call is passed to the
         * modelTransform function.
         *
         * @example
         * // Before a model is set on a list item, add a new 'date' property that is a formatted date string.
         * list.modelTransform = function(model, index) {
         *     model.date = new Date(model.millisSinceEpoch).toString();
         *     return model;
         * };
         * @type {function}
         */
        modelTransform: {
            set: function(value) {
                this.modelTransform = value;
                this.scrollbar.style.visibility = "visible";

                var _this = this;

                // If the user unsets the value it still needs to be a valid
                // function, so fallback to the default.
                if (this.modelTransform) {
                    this.wrappedDataModelProxy = function(startIndex, fallbackDirection) {
                        var len = _this.collection.length;
                        var index = startIndex;
                        var model;
                        // Go until the filter returns a model
                        // or we get to the end of the collection.
                        while (!model && index < len && index >= 0) {
                            model = _this.collectionAdapter.get(index);

                            // 'Fast' clone the object so users wont modify the
                            // actual data model. http://jsperf.com/cloning-an-object/2
                            var cloned = JSON.parse(JSON.stringify(model));

                            model = value(cloned, index);

                            // If our search direction is 0, we're only interested in validity
                            // and not what the next model may be.
                            if (!model && fallbackDirection === 0) {
                                break;
                            } else if (!model) {
                                // If list has transform, we don't know the filtered length of
                                // the list, therefore hide the scrollbar.
                                _this.scrollbar.style.visibility = "hidden";

                                index += fallbackDirection;
                            }
                        }

                        if (!model) {
                            return null;
                        } else {
                            _this.transformedPointer.index = index;
                            _this.transformedPointer.model = model;
                            return _this.transformedPointer;
                        }
                    };
                } else {
                    this.wrappedDataModelProxy = this.defaultModelProxy;
                }

                this.keyboardInteractions.modelProxy = this.touchInteractions.modelProxy = this.wrappedDataModelProxy.bind(this);
                this.invalidate();
            }
        },

        /**
         * Boolean property that indicates if the list only render enough nodes to fill the list.
         *
         * Use this property in conjunction with giving the list a fixed size to only render the number of nodes that can fit
         * within the visible area of the list. This can drastically increase performance on large lists.
         *
         * It's important that the list be given a size in order for the list to be able to calculate
         * how many items it should show.
         *
         * Can be applied on the el-list tag via the 'data-recycle-nodes' attribute.
         *
         * If you use `recycleNodes` and want to modify the contents of a list item (the contents of the `<li>` tag)
         * then annotate the `<li>` tag with then `data-dirty-dom="true"` attribute. This lets the list know that this
         * list item should not be recycled and used for another data model.
         *
         * @example
         * <el-list data-recycle-nodes='true'>
         * </el-list>
         * @type {boolean}
         */
        recycleNodes: {
            set: function(value) {
                if (this.recycleNodes !== value) {
                    this.recycleNodes = value;
                    this.public.setAttribute('data-recycle-nodes', value.toString());
                    this.configureRecyclable(value);
                    this.configureOrientation(this.orientation);
                    this.invalidate();
                }
            }
        },

        /**
         * String type or template engine object that should be used to parse list items.
         *
         * Supported template types are:
         *
         * * `"underscore"`
         * * `"mustache"`
         * * `"angular"`
         *
         * The templateType can be set at many different levels, each one takes presidence over the previous:
         *
         * * Globally: The default `templateType` can be set for all lists by setting `elsa.list.templateType` __before__ `elsa.initialize()`.
         * * Entire List: The default `templateType` can be set for an individual list by setting `list.templateType` or on the `<el-list>` element with the `data-template-type` attribute.
         * * Individual Templates: Set `data-template-type` attribute on the template's top level element to set the templateType per template.
         *
         * In order to use a different templating engine the templating library must be present on the window object. For instance, to use mustache
         * `window.Mustache` should resolve to the Mustache templating library.
         *
         * If no `templateType` is set, the default is returned. If `templateType` is set to a falsy value the default is used.
         */
        templateType: {
            set: function(value) {
                var newType = value || Object.getPrototypeOf(this.public).constructor.templateType;
                if (newType !== this.templateType) {
                    this.templateType = newType;

                    // kind of a hacky way to recreate our template lookups.
                    this.public.itemTemplate = this.public.itemTemplate;
                }
            },
            get: function() {
                // Default templating engine set as last option here.
                return this.templateType || Object.getPrototypeOf(this.public).constructor.templateType || 'legacy';
            }
        },

        /**
         * Returns `true` if the supplied index is visible in the list.
         *
         * The item may be partially visible in the viewport and this method will return `true`.
         * This method does not take in to account if an external DOM element is occluding the list's viewport.
         *
         * @param {Number} index The index to check for visibility.
         * @return if the index is visible in the list.
         */
        isIndexVisible: function(index) {
            if (!this.hasNodes()) {
                return false;
            }

            // Querying the DOM lets us take in to account filtered models.
            var element = this.contentEl.querySelector('li[data-index="' + index + '"]');
            return !element ? false : this.intersectsRect(this.public.getBoundingClientRect(), element.getBoundingClientRect());
        },

        /**
         * Scrolls the list so that the supplied index is in view. The list is scrolled so that the
         * item to show is shown at the top of the list. If it can't be shown because it is close to
         * the bottom of the list, the list is scrolled completely to the bottom.
         *
         * Lists with `data-recycle-nodes` set to true cannot be animated and will snap to the new position, ignoring `duration`.
         *
         * @param {Number|Object} index The index or collection item you wish to scroll in to view. If the index is outside the bounds
         * of the collection it is clamped. If the index has been filtered by a `modelTransform` the next valid index is scrolled to.
         * @param {Number} duration Optional duration in milliseconds. If supplied the list will animate the scroll,
         * otherwise the item is scrolled to synchronously.
         * @param {list~ScrollCallback} callback Optional callback function to call, with the index as a parameter, when then scroll is completed. Called regardless of duration.
         */
        scrollTo: function(index, duration, callback) {
            index = typeof index === 'object' ? this.collectionAdapter.indexOf(index) : Math.max(0, Math.min(index, this.collectionAdapter.length - 1));

            var item = this.contentEl.querySelector('li[data-index="' + index + '"]');
            if (this.recycleNodes) {
                this.scrollToRecyclableSync(item, index, callback);
            } else {
                this.scrollToNonRecylable(item, index, duration, callback);
            }
        },

        /**
         * Scrolls the list so that the supplied index is in view. The list is scrolled only if the item is not fully visible.
         *
         * Lists with `data-recycle-nodes` set to true cannot be animated and will snap to the new position, ignoring `duration`.
         *
         * @param {Number|Object} index The index or collection item you wish to scroll in to view. If the index is outside the bounds
         * of the collection it is clamped. If the index has been filtered by a `modelTransform` the next valid index is scrolled to.
         * @param {Number} duration Optional duration in milliseconds. If supplied the list will animate the scroll,
         * otherwise the item is scrolled to synchronously.
         * @param {list~ScrollCallback} callback Optional callback function to call, with the index as a parameter, when then scroll is completed. Called regardless of duration.
         */
        scrollToIfNeeded: function(index, duration, callback) {
            index = typeof index === 'object' ? this.collectionAdapter.indexOf(index) : Math.max(0, Math.min(index, this.collectionAdapter.length - 1));

            var item = this.contentEl.querySelector('li[data-index="' + index + '"]');
            if (this.recycleNodes) {
                if (item &&
                    item.transformVal >= this.scrollVal &&
                    item.transformVal + this.getElementSize(item) <= this.scrollVal + this.listSize) {
                    if (callback) {
                        callback(index);
                    }
                } else {
                    this.scrollToRecyclableSync(item, index, callback);
                }
            } else {
                if (duration) {
                    this.scrollToNonRecylable(item, index, duration, callback);
                } else {
                    item.scrollIntoViewIfNeeded();
                    if (callback) {
                        callback(index);
                    }
                }
            }
        },

        /**
         * @callback ScrollCallback
         * @memberOf list~
         * @param {Number} index - The index that was scrolled to.
         */


        /**
         * If the swipe interface is showing calling this method will close it.
         */
        cancelSwipe: function() {
            if(this.swipeDelegate) {
                this.swipeDelegate.clear();
            }
        },

        /**
         * Returns true if this list is scrolled to the top.
         */
        isScrollPositionAtTop: function() {
            if (this.recycleNodes) {
                var firstVisibleItem = this.getFirstNode();
                if (this.getNodeIndex(firstVisibleItem) === this.collectionFirstIndex) {
                    var minScrollVal = firstVisibleItem.transformVal;

                    return this.scrollVal <= minScrollVal;
                }
                return false;
            }
            return this.public.scrollTop <= 0;
        },

        /**
         * Flag that disables or enables overscrolling on recycled lists.
         */
        overscrollEnabled: {
            set: function(value) {
                this.overscrollEnabled = value;
            },
            get: function() {
                return this.overscrollEnabled;
            }
        },

    },

    private: {

        orientation: null,

        listItemPool: null,

        templateSizeLookup: null,

        nodeList: null,

        scrollStyle: null,

        touchHighlightDelay: 150,

        numOverrunElements: 1,

        numExtraPooledElements: 2,

        dragStartThreshold: 10,

        selectedIndices: null,

        touchedNodes: null,

        overscrollEnabled: true,

        selectedClassName: 'el-listitem-selected',

        recycleClass: 'el-list-recycle',

        transformedPointer: {
            model: null,
            index: null
        },

        listSize: {
            get: function() {
                return this._listSize;
            },
            set: function(size) {
                this._listSize = size;
                this.scrollbar.scrollableArea = size;
            }
        },

        /**
         * Invalidates the list, indicating that it should be rendered in
         * the next tick. Use invalidate instead of calling repopulate() directly
         * to improve performance in situations where render may be called multiple
         * times in the same tick.
         */
        invalidate: function() {
            if (!this.dirty && this.addedToDOM && !this.ignoreInvalidation) {
                this.dirty = true;
                this.invalidateTimeoutId = window.requestAnimationFrame(this.boundRepopulate);
            }
        },

        /**
         * Testing only method that bypasses the invalidation delay.
         */
        unitTestInvalidate: function() {
            // assume we're in the dom in tests, validate immediately.
            if (!this.dirty && !this.ignoreInvalidation) {
                this.dirty = true;
                this.boundRepopulate();
            }
        },

        /**
         * Renders the component by creating any missing child nodes and
         * populating them with the appropriate collection item.
         */
        repopulate: function() {
            this.dirty = false;
            if (!this.collection) {
                return;
            }

            if (Object.getPrototypeOf(this.public).constructor.debug) {
                console.log("list.repopulate");
            }

            // Reset the first and last visible indices which are then refined later.
            this.dirtyLookup = {};
            this.scrollDetector.scrollMomentum = 0;
            this.scrollVal = this.lastScrollVal = 0;

            window.cancelAnimationFrame(this.momentumScrollAnimationId);

            this.swipeDelegate.resetAll();
            this.configureDefaultTemplate();

            // Any nodes already created should be added to the pool so we can use them
            // later in createItem().
            this.poolAll();

            this.listSize = this.getElementSize(this.public);
            this.addNodes();

            // We've effectively rendered now, dispatch the event.
            this.public.dispatchEvent(module.exports.render());

            // It's possible the collection has items, but they've all failed the modelTransform.
            if (!this.hasNodes()) {
                return;
            }

            // In case our newly populated list is shorter than how far down the user previously scrolled.
            // TODO: Once the scrolling API is in, move to the old position, but constrained to the new size of the list.
            this.applyScroll(this.scrollVal);
        },

        rebuildList: function(startIndex) {
            this.poolAll();
            this.addNodes(startIndex);
        },

        addNodes: function(startIndex) {
            startIndex = startIndex || 0; // coerce undefined to 0

            this.scrollbar.reset();

            var index = this.recycleNodes ? startIndex - 1 : -1;
            var direction = 0,
                overrunCounter = 0,
                touchedNodes = [],
                touchedNodesSize;
            var collectionFirstIndexSet = false;
            while ((direction = this.layoutTopToBottom(this.getLastNode(), false, touchedNodes, index)) !== 0) {
                index = this.getNodeIndex(this.getLastNode());
                if (startIndex === 0 && !collectionFirstIndexSet) {
                    this.collectionFirstIndex = index;
                    collectionFirstIndexSet = true;
                }

                if (this.recycleNodes && (touchedNodesSize = this.lastElementBottom()) > this.listSize) {
                    overrunCounter++;
                }

                if (overrunCounter === (this.numOverrunElements + 1) || index >= this.collectionAdapter.length) {
                    break;
                }
            }

            // we haven't fully populated going down but we hit the end of the collection, start going the other way.
            if (this.recycleNodes && startIndex !== 0 && overrunCounter === 0) {
                touchedNodes.push = touchedNodes.unshift; // tricky tricks, this lets us insert nodes in the right order.

                index = startIndex;
                while ((direction = this.layoutBottomToTop(this.getFirstNode(), false, touchedNodes, index)) !== 0) {
                    index = this.getNodeIndex(this.getFirstNode());

                    touchedNodesSize += this.getElementSize(this.getFirstNode());

                    if (this.recycleNodes && touchedNodesSize > this.listSize) {
                        overrunCounter++;
                    }


                    if (overrunCounter === this.numOverrunElements) {
                        break;
                    }
                }
            }

            if (touchedNodes.length) {
                this.applyTransformations(touchedNodes, null, 1);
            }

            if (this.recycleNodes && ((this.itemTemplate && this.itemTemplate.length > 1) || !this.allTemplateSizesCached)) {
                // Add some buffer nodes if we have multiple template types or variably sized templates.
                this.addPoolBufferNodes(this.contentEl);
            }

            this.scrollVal = this.lastScrollVal = 0;
            this.translateItem(this.scrollStyle, this.scrollVal);

            return this.nodeList;
        },

        /**
         * The most costly thing is appending children to the DOM while scrolling,
         * so we can create a few extra elements of each template type, add them to
         * the DOM and pool them up front to avoid the cost of creating them while scolling.
         */
        addPoolBufferNodes: function(frag) {
            // without this guard if we repopulated many times with the same templates
            // the pool would get larger and larger.
            if (this.extrasAddedToPool) {
                return;
            }
            this.extrasAddedToPool = true;

            var _this = this;
            var createNode = function(template) {
                var item = _this.processFetchedListItem(null, template);
                _this.poolNode(item);
                frag.appendChild(item);
                return item;
            };

            var createNodes = function(template) {
                var res = [];
                var pool = _this.listItemPool.getPool(template);
                var len = _this.numExtraPooledElements - pool.length;
                for (var i = 0; i < len; i++) {
                    res.push(createNode(template));
                }
                return res;
            };

            for (var i in this.templateAttributeLookup) {
                var nodes = createNodes(i);
                for (var j = 0; j < nodes.length; j++) {
                    var node = nodes[j];
                    // position elements up above the viewport until they're needed.
                    this.translateItem(node.style, -this.getElementSize(node) - this.overscrollAnimator.maxOverscroll * 4);
                }
            }
        },

        /**
         * Configures a default template for list items if one hasn't already been set
         */
        configureDefaultTemplate: function() {
            // without a collection model, don't bother configuring the template.
            if (!this.collection || !this.collection.length) {
                return;
            }

            // `itemTemplate` is exposed to users as the property they set,
            // `listItemTemplates` is used internally. The user should always see
            // the value they set even if the standard list item is being used. If
            // we expose the standardListItem they may be able to manipulate the DOM
            // of it and since it's used across all list implementations that could break
            // disperate parts of the app.
            if (!this.itemTemplate || this.itemTemplate.length === 0) {
                this.listItemTemplates = this.createTemplateLookup([standardListItemTemplate]);
            }
        },

        /**
         * Creates a list item DOM tree based off of an index.
         * @param {int} index - The index in the collection model from which to build the list item.
         */
        createItem: function(model, index) {
            var listItem = this.getListItemDOM(model, index);
            this.populateListItemDOM(model, index, listItem);
            this.setListItemElementIndex(index, listItem);
            return listItem;
        },

        /**
         * Given an array of template functions, inspect their data-use-when attribute
         * and creates a lookup that can map data models to templates.
         * @param {array} templates - An array of templates. Templates can be a string,
         * a DOM node, or a template function.
         */
        createTemplateLookup: function(templates) {
            var lookup = [];
            lookup.actionLookup = {};
            this.allTemplateSizesCached = true;
            this.templateAttributeLookup = {};

            this.templater.clear();

            // Annotates the DOM with template metadata and injects it in the template lookup for binding.
            var processTemplate = function(rawTemplate) {
                var templateDOM = this.templater.instantiate(rawTemplate);
                var templateChildDOM = templateDOM.firstElementChild;
                var templateHTML = templateDOM.innerHTML; // HTML inside of the <li> tag is used as a key many places.
                var actions = this.extractSwipeActions(templateChildDOM);
                var lookupFunction = this.createUseWhenLookupFunction(templateChildDOM.getAttribute('data-use-when'), templateHTML);

                lookup.actionLookup[templateHTML] = actions.map(function(action) {
                    return compiler.compile(action, this.public);
                });

                // Pull off template attributes from the template tag and store them so they can be queried based on template
                this.setTemplateAttributes(templateChildDOM, templateHTML);

                // If the template query function is null the template should be used as the default.
                this.addLookupFunction(lookup, lookupFunction, templateHTML);

                // If one template doesn't have its size cached, we need to repopulate the list
                // when both dimensions change, not just the dimension of scrolling
                if (this.allTemplateSizesCached && !this.templateAttributeLookup[templateHTML][TMPL_ATTR_ITEMSIZE]) {
                    this.allTemplateSizesCached = false;
                }

                var parsedTemplate = this.templater.parse(templateDOM, templateHTML);
                this.cacheListItemDOM(parsedTemplate, templateHTML);
            };

            templates.forEach(processTemplate, this);

            // If all templates have data-use-when clauses then inject the standard liste item template in case
            // a supplied model doesn't meet any of the data-use-when criteria we'll have something to fall back on.
            if (!lookup.lookupDefault) {
                processTemplate.call(this, standardListItemTemplate);
            }

            return lookup;
        },

        /**
         * Grabs supported templateAttributes off of the supplied template and stores them in
         * the `templateAttributeLookup`, which can then be queried using `lookupTemplateAttribute()`
         */
        setTemplateAttributes: function(template, templateHTML) {
            this.templateAttributeLookup[templateHTML] = {};
            for (var j = 0; j < templateAttributes.length; j++) {
                var attr = templateAttributes[j];
                this.templateAttributeLookup[templateHTML][attr] = template.getAttribute(attr) || null;
            }
        },

        /**
         * Removes any special UI from the template and returns an object that has the culled HTML as well
         * as extracted UI held separately.
         */
        extractSwipeActions: function(dom, templater) {
            var actions = Array.prototype.slice.call(dom.querySelectorAll('el-action'));
            actions.forEach(function(action) {
                action.parentElement.removeChild(action);
            });

            return actions;
        },

        /**
         * Adds a template lookup to the template HTML function lookup.
         */
        addLookupFunction: function(lookup, fn, result) {
            if (!fn) {
                lookup.lookupDefault = result;
            } else {
                lookup.push(fn);
            }
        },

        /**
         * Returns a partially applied query function that, when given a model, either returns a template or null.
         * If this method returns null then the supplied template should be marked as the default and used when no
         * other query method returned from this function applies.
         */
        createUseWhenLookupFunction: function(useWhen, template) {
            // It's in the format of prop:expectedValue
            if (useWhen && useWhen.indexOf(':') !== -1) {
                var keyVal = useWhen.split(':');
                return function keyValueTemplateLookup(data) {
                    return (keyVal[0] in data && (data[keyVal[0]].toString() === keyVal[1] || data[keyVal[0]] === parseInt(keyVal[1]))) ? template : null;
                };
                // The use-when key is a simple truthy property.
            } else if (useWhen && useWhen !== '*') {
                return function booleanPropertyTemplateLookup(data) {
                    return (useWhen in data && data[useWhen]) ? template : null;
                };
            }

            // The template should be marked as the default.
            return null;
        },

        /**
         * Given a data model, search the list of templates for one whose use-when
         * criteria matches the model. If none are the fallback template is used.
         * @param {object} templates - An hash of template functions where the key
         * is in the format of 'prop:expectedValue'. Alternatively the format of 'prop'
         * will check if the value is truthy.
         * @param {object} data - Data model to search using the template hash's keys.
         */
        findUseWhenResult: function(useWhenMethods, data) {
            var foundTemplate, len = useWhenMethods.length;
            for (var i = 0; i < len; i++) {
                if ((foundTemplate = useWhenMethods[i](data))) {
                    return foundTemplate;
                }
            }
            return useWhenMethods.lookupDefault;
        },

        /**
         * Gets a listitem DOM node that can be populated with content.
         * @param {object} data - Data model to search using the template hash's keys.
         */
        getListItemDOM: function(data, index) {
            // TODO: Sucks that we have to do a lookup here for every item.
            var template = this.dirtyLookup[index] || this.findUseWhenResult(this.listItemTemplates, data);

            // If a DOM element of the correct template type and has been pushed into the pool
            // it can safely be reused. Otherwise we create a new one, unpooled, as it should be used right away.
            var listItem = this.poolFetch(template);
            listItem = this.processFetchedListItem(listItem, template);
            this.configureNodeSelectionState(listItem, index);

            return listItem;
        },

        processFetchedListItem: function(listItem, template) {
            if (!listItem) {
                listItem = this.templater.fetch(template);
                listItem.cachedSize = listItem.dataTargets = null;
            }

            listItem.itemTemplateType = template;

            return listItem;
        },

        /**
         * Clones the list item and caches it, creating a list item that
         * can be used as a mould to create list items of this type.
         */
        cacheListItemDOM: function(listItem, template) {
            // Enforce that the template is the right size, if it has a cached one.
            var cachedTemplateSize = this.templateAttributeLookup[template] ? this.templateAttributeLookup[template][TMPL_ATTR_ITEMSIZE] : null;
            if (cachedTemplateSize) {
                listItem.style[this.dimensionProp] = cachedTemplateSize;
            }
        },

        /**
         * Pass in a DOM item and data and either get it back if its type matches the data,
         * or get a new or existing item and have the one passed in sent back to the pool.
         * @param {int} index - The index of the data you wish to use to populate the DOM item.
         * @param {object} listItem - An existing DOM item that will either be pooled or reused,
         * depending on its template.
         */
        getListItemDOMFromPool: function(model, index, listItem) {
            // Search for the template either in the lookup of dirty nodes, or the
            // list of valid templates.
            var template = this.dirtyLookup[index] || this.findUseWhenResult(this.listItemTemplates, model);

            // If the dirty dom parameter is set, use it as the template type. If its `true` or an empty
            // string, it's a unique category. If its anything else we can create a new item template type
            // category on the fly.
            if (listItem) {
                this.annotateIfDirtyNode(listItem);
            }

            var result;
            // If a dom node previously marked as dirty is requested and we've stashed it
            // in the dirty dom node lookup we can return it
            if (listItem && listItem.itemTemplateType === template) {
                // The recycled list item and the new data are compatible types.
                result = listItem;
            } else {
                if (listItem) {
                    this.poolNode(listItem);
                }

                var dom = this.getListItemDOM(model, index);

                // If the returned element doesn't have a parent, it is a new one not pulled from a pool.
                if (!dom.parentNode) {
                    this.contentEl.appendChild(dom);
                }

                result = dom;
            }

            this.configureNodeSelectionState(result, index);

            // Remove transitioning class that could have been added by the swipe ui
            this.swipeDelegate.resetDOM(result);

            return result;
        },

        /**
         * If the node is marked as dirty, overwrites the nodes `itemTemplateType` with the data-dirty-dom name.
         */
        annotateIfDirtyNode: function(node) {
            var dirtyCategory = node.getAttribute('data-dirty-dom');
            if (dirtyCategory) {
                this.templater.copyCache(node.itemTemplateType, dirtyCategory);

                this.templateAttributeLookup[dirtyCategory] = this.templateAttributeLookup[node.itemTemplateType];
                this.dirtyLookup[this.getNodeIndex(node)] = node.itemTemplateType = dirtyCategory;

                // reparse the node since its changed, and store it with the new template category as the key.
                this.templater.parse(node, dirtyCategory);
            }
        },

        /**
         * Given a list item, looks up the attribute that was set on it when the template was set on the list. The
         * property should be added to the static `templateAttributes` array.
         */
        lookupTemplateAttribute: function(listItem, attr) {
            return this.templateAttributeLookup[listItem.itemTemplateType][attr];
        },

        /**
         * Places the supplied node into a pool of nodes of the same type. Pooled nodes can be retrieved
         * using `getListItemDOMFromPool`.
         */
        poolNode: function(node) {
            this.annotateIfDirtyNode(node);
            this.listItemPool.put(node, node.itemTemplateType);
            node.style.visibility = 'hidden';
        },

        /**
         * Places all visible DOM nodes into the pool and empties the list item container.
         * Useful when you want to do a full rebuild of the DOM while preserving the nodes already created.
         */
        poolAll: function() {
            this.nodeList.forEach(this.poolNode, this);
            this.nodeList.length = 0;
            if (this.contentEl.children.length) {
                this.contentEl.innerHTML = '';
            }
        },

        /**
         * Fetches and removes a node from the pool if one exists.
         */
        poolFetch: function(template) {
            var node = this.listItemPool.get(template);
            if (node) {
                node.style.visibility = 'visible';
                return this.cleanNode(node);
            }
        },

        /**
         * Empties the pool of all DOM nodes and cleans up and references stored on them.
         */
        emptyPool: function() {
            this.listItemPool.forEach(function(node) {
                compiler.destroy(node);
                this.cleanNode(node);
            }, this);
            this.listItemPool.empty();
            this.extrasAddedToPool = false;
        },

        cleanNode: function(node) {
            node.dataTargets = null;
            node.cachedSize = null;
            return node;
        },

        cleanNodes: function() {
            this.nodeList.forEach(function(node) {
                compiler.destroy(node);
                this.cleanNode(node);
            }, this);
            this.nodeList.length = 0;
        },

        /**
         * Toggles the selection state on a node depending on if its index is in the
         * selectedIndices.
         */
        configureNodeSelectionState: function(node, index) {
            if (this.selectedIndices.indexOf(index) !== -1) {
                node.classList.add(this.selectedClassName);
            } else {
                node.classList.remove(this.selectedClassName);
            }
        },

        setListItemElementIndex: function(index, listItem) {
            listItem.__listIndex = index;
            listItem.setAttribute('data-index', index);

            if (this.selectedIndices.indexOf(index) !== -1) {
                listItem.classList.add(this.selectedClassName);
            }
        },

        populateListItemDOMAndIndex: function(model, index, listItem) {
            this.populateListItemDOM(model, index, listItem);
            this.setListItemElementIndex(index, listItem);
        },

        /**
         * Populates a list item with the supplied data model.
         */
        populateListItemDOM: function(data, index, listItem, incrementalUpdate) {
            this.templater.bind(listItem, data, listItem.itemTemplateType, index);

            // Invalidate the cached size of the content now that it's been repopulated.
            listItem.cachedSize = null;
        },

        /**
         * Event listener for change events on models in the list's collection. When a property
         * changes on one of the objects contained in the model, this method is trigger.
         * @param {object} changedData - The data that has changed.
         */
        modelChanged: function(changedData, index) {
            var elem = this.contentEl.querySelector('li[data-index="' + index + '"]');

            if (elem) {
                var proxy = this.wrappedDataModelProxy(index, 0);
                if (!proxy) {
                    this.invalidate();
                } else {
                    this.populateListItemDOM(proxy.model, index, elem, true);
                }
            }
        },

        /**
         * Event listener for add events on the list's collection. If a model is added to the
         * end of the collection the index is undefined and so the listItem should be appended to
         * the end of the list, otherwise insert it in to the DOM.
         * @param {object} data - The data that has been added.
         */
        modelAdded: function(model) {
            // we're going to invalidate anyway, forget it and let repopulate take care of it.
            if (this.dirty) {
                return;
            }

            this.scrollbar.collectionSize = this.collectionAdapter.length;

            var index = this.collection.indexOf(model);
            if (!this.recycleNodes) {
                this.configureDefaultTemplate();

                // If we're adding to the end of the collection (eg. with push)
                // then make sure we insert at the end.
                var isPush = index === this.collection.length - 1;
                var i = index;

                // Can't just use the previous index as the needle for the node's sibling
                // because a modelTransform may have filtered it out, so we find the
                // nearest neighbour. If the index is 0 then `previousNode` should be null in order
                // to properly insert it at the very start of the list.
                var previousNode;
                while (i >= 0) {
                    previousNode = this.contentEl.querySelector('li[data-index="' + i + '"]');
                    if (previousNode) {
                        break;
                    }
                    i--;
                }

                // Negate the last decrement to keep index and i aligned.
                if (!previousNode) {
                    i++;
                }

                // Treat an append after the last filtered model as a push to tack on to the end
                // instead of before the last item.
                isPush = isPush || previousNode === this.contentEl.lastElementChild;

                var node = this.getNodeDOM(index, 1, null);
                var sibling = isPush ? undefined : (previousNode || this.contentEl.firstElementChild);
                var targetNode = sibling && i !== index ? sibling.nextElementChild : sibling;
                this.nodeList.splice(i, 0, node);
                this.contentEl.insertBefore(node, targetNode);
                this.updateDataIndices(node, 1);
            } else if (this.isIndexInNodeList(index) || this.lastElementBottom() <= this.listSize) {

                //TODO: Investigate extending the repeater case to the recyclable nodes case when the item is visible.
                this.invalidate();
            }
        },

        /**
         * Event listener for remove events on the list's collection.
         * @param {object} data - The data that has been removed.
         * @param {int} index - The index the item was removed from.
         */
        modelRemoved: function(model, index) {
            // we're going to invalidate anyway, forget it and let repopulate take care of it.
            if (this.dirty) {
                return;
            }

            this.scrollbar.collectionSize = this.collectionAdapter.length;

            if (!this.recycleNodes) {
                var node = this.contentEl.querySelector('li[data-index="' + index + '"]');
                if (node) {
                    this.updateDataIndices(node, -1);
                    this.contentEl.removeChild(node);
                }
            } else if (this.isIndexInNodeList(index) || this.lastElementBottom() <= this.listSize) {

                //TODO: Investigate extending the repeater case to the recyclable nodes case when the item is visible.
                this.invalidate();
            }
        },

        /**
         * Increments the `data-index` of nodes by one.
         * Used after a list item has been inserted into the DOM.
         */
        updateDataIndices: function(afterNode, direction) {
            var children = Array.prototype.slice.call(this.contentEl.children);
            var afterIndex = children.indexOf(afterNode) + 1;
            for (var i = afterIndex; i < children.length; i++) {
                var child = children[i];
                var childIndex = this.getNodeIndex(child);
                var newIndex = childIndex + direction;
                child.__listIndex = newIndex;
                child.setAttribute('data-index', newIndex);
            }
        },

        onTouchStart: function(e) {
            this.listItemTouchStart(e, this.findListItem(e.target));
        },

        /**
         * Handles drag start by configuring scrolling variables.
         * @param {object} event - Scroll event
         * @param {object} listItem - The list item that was touched
         */
        listItemTouchStart: function(event, listItem) {
            // Because we're accepting both touch and mouse events, on platforms that emulate mouse events
            // for a touch we need to debounce with a state machine.
            if (!this.interactionMode.isValid(event)) {
                return;
            }

            // ignore right clicks.
            if (event.hasOwnProperty('button') && event.button === 2) {
                return;
            }

            // Exit early if there are no list items or we're already tracking a touch.
            if (!this.hasNodes() || this.scrollDetector.state === ScrollGestureDetector.States.DETECTING) {
                return;
            }

            var touchTracker = new CumulativeDelta();
            touchTracker.track(event);

            if (this.recycleNodes) {
                event.preventDefault();
                this.touchStartEvent = event;

                // Manually removes focus from an active element (such as an input).
                // This will bring down the keyboard if it's up.
                // https://jira.bbqnx.net/browse/MEAPCLIENT-1157
                if (document.activeElement && document.activeElement !== document.body && !this.public.contains(document.activeElement)) {
                    document.activeElement.blur();
                }

                if (this.isValidRetriggerClickTarget(this.touchStartEvent.target)) {
                    this.touchStartEvent.target.focus();
                }
            }

            var _this = this;
            var evtPointer = {
                e: event
            };
            this.onListItemTouchMove = function(e) {
                // Throttle the touch move so that we only process one event a frame. By maintaining
                // a reference to the last event we can avoid requesting a new animation frame and creating
                // an anonymous function for each touch move event.
                evtPointer.e = e;
            };

            this.onListItemTouchEnd = function(e) {
                if (Object.getPrototypeOf(_this.public).constructor.debug > 1) {
                    console.log("list.events.touchend");
                }

                // Manually simulates a click. The `preventDefault()` in touch start
                // means that we've eaten any clicks that may have occured on elements.
                if (_this.recycleNodes && touchTracker.delta < 15) {
                    event.preventDefault();

                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent('click', true, true);

                    if (_this.isValidRetriggerClickTarget(_this.touchStartEvent.target)) {
                        _this.touchStartEvent.target.dispatchEvent(evt);
                    }
                }

                window.cancelAnimationFrame(_this.touchMoveAnimationId);
                _this.scrolling = false;
                _this.listItemTouchEnd(e, listItem);
            };

            document.body.addEventListener("touchend", this.onListItemTouchEnd);
            document.body.addEventListener("touchcancel", this.onListItemTouchEnd);
            document.body.addEventListener("touchmove", this.onListItemTouchMove);
            document.body.addEventListener("mouseup", this.onListItemTouchEnd);
            document.body.addEventListener("mouseleave", this.onListItemTouchEnd);
            document.body.addEventListener("mousemove", this.onListItemTouchMove);

            this.overscrollAnimator.cancel();
            this.scrollAnimator.cancel();
            if (this.scrollToAnimator) {
                this.scrollToAnimator.cancel();
            }
            window.cancelAnimationFrame(this.momentumScrollAnimationId);

            // Delay highlight addition to prevent restyling on every touch.
            if (listItem) {
                this.setActiveItemTimeout = setTimeout(function() {
                    _this.setActiveItem(listItem);
                }, this.touchHighlightDelay);
            }

            this.scrolling = true;

            this.railDetector.start(event);
            this.swipeDetector.start(event);
            this.scrollDetector.start(event);

            this.dragStartPos = this.scrollVal;

            if ((this.recycleNodes || isAndroid) && listItem && listItem.setCapture) {
                listItem.setCapture();
            }

            // Keeps the scroll/swipe animations bound to the framerate, not the frequency of touchmove events.
            window.cancelAnimationFrame(this.touchMoveAnimationId);
            var touchRenderFn = function touchRenderFn() {
                touchTracker.track(evtPointer.e);
                _this.listItemTouchMove(evtPointer.e, listItem);

                // Prevents a race condition apparent on iOS where this code may get called after
                // onListItemTouchEnd when a touch is ended. This keeps the 'move' loop going after
                // the gesture is over, and results in the list freezing up.
                if (_this.scrolling) {
                    _this.touchMoveAnimationId = window.requestAnimationFrame(touchRenderFn);
                }
            };

            // Kick it off.
            this.touchMoveAnimationId = window.requestAnimationFrame(touchRenderFn);

            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("list.events.touchstart");
            }
        },

        /**
         * Re-dispatching click events on built in controls that rely on both down/up events
         * as well as clicks results in a double toggle effect. This method helps filter out
         * those controls to avoid this behaviour.
         */
        isValidRetriggerClickTarget: function(target) {
            if (target.tagName === 'INPUT') {
                if (target.getAttribute('type') === 'checkbox') {
                    return false;
                }
            }
            return true;
        },

        /**
         * Handles a drag event trigger every time the finger moves.
         * Responsible for scrolling the list vertically or horizontally.
         * @param {object} e - Touch or mouse event
         */
        listItemTouchMove: function(event) {
            event = event || window.event;
            if (this.recycleNodes) {
                event.preventDefault();
            }

            // Lock the movement on to rails if applicable.
            this.railDetector.track(event);

            this.swipeDetector.track(event);
            this.scrollDetector.track(event);
        },

        /**
         * Handles a drag end. If the list has momentum (the user is flicking
         * the list) then scroll deceleration is started.
         * @param {object} e - Touch or mouse event
         * @param {object} listItem - The list item that was touched
         */
        listItemTouchEnd: function(event, listItem) {
            if (!this.interactionMode.isValid(event)) {
                return;
            }

            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("list touch end", event.type);
            }

            document.body.removeEventListener("touchend", this.onListItemTouchEnd);
            document.body.removeEventListener("touchcancel", this.onListItemTouchEnd);
            document.body.removeEventListener("touchmove", this.onListItemTouchMove);
            document.body.removeEventListener("mouseup", this.onListItemTouchEnd);
            document.body.removeEventListener("mouseleave", this.onListItemTouchEnd);
            document.body.removeEventListener("mousemove", this.onListItemTouchMove);

            this.onListItemTouchEnd = this.onListItemTouchMove = null;

            if (listItem && this.scrollDetector.state === ScrollGestureDetector.States.DETECTING && event.type !== 'touchcancel') {
                this.listItemTapped(event, listItem);
            }

            if (listItem && listItem.releaseCapture && (this.recycleNodes || isAndroid)) {
                listItem.releaseCapture();
            }

            this.clearActiveItem();

            this.railDetector.end(event);
            this.swipeDetector.end(event);
            this.scrollDetector.end(event);
        },

        onScrollGestureStart: function(e) {
            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("list.gestures.scrollstart");
            }

            // Stop looking for swipes once we start scrolling.
            this.swipeDetector.cancel();
            this.swipeDelegate.clear();

            if (this.activeListItem) {
                this.clearActiveItem();
            }
        },

        onScrollGestureMove: function(isWheelEvent) {
            if (!this.recycleNodes) {
                return;
            }

            var newScrollVal = this.dragStartPos - this.scrollDetector.scrollDelta;
            var constrainedScrollVal = this.constrainScroll(newScrollVal);

            // Its a drag overscroll
            if (newScrollVal !== constrainedScrollVal && !isWheelEvent && this.overscrollEnabled) {
                newScrollVal = this.overscrollAmt;
            } else {
                newScrollVal = constrainedScrollVal;
            }

            this.setScrollVal(newScrollVal);
            this.applyScroll(this.scrollVal, true);
        },

        onScrollGestureEnd: function(e) {
            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("list.gestures.scrollend");
            }

            this.clearActiveItem();

            // No manual scrolling or overscrolling.
            if (!this.recycleNodes) {
                return;
            }

            var willAnimate;
            var constrainedScrollVal = this.constrainScroll(this.scrollVal);
            if ((constrainedScrollVal !== this.scrollVal) && this.overscrollEnabled) {
                willAnimate = this.overscrollAnimator.configureResetScroll(constrainedScrollVal, this.scrollVal);
                if (willAnimate) {
                    this.runScrollAnimator(this.overscrollAnimator);
                }
            } else if (this.scrollDetector.scrollMomentum !== 0 && this.scrollDetector.state !== ScrollGestureDetector.States.CANCELLED) {
                // A bit of tricky magic. Because the moving average of the scroll deltas is calculated on touch move and not
                // per frame, that means that if the user flicks fast and stops with their finger on the list, then releases we
                // would see the momentum pick up as if they hadn't stopped. By factoring in the time between last move and release
                // we can decrease the momentum linearly by the amount of time since last touch move.
                this.scrollDetector.scrollMomentum /= (this.scrollDetector.timeSinceLastMove) * 0.1;

                willAnimate = this.scrollAnimator.configure(this.scrollDetector.scrollMomentum, this.scrollVal);
                if (willAnimate) {
                    this.runScrollAnimator(this.scrollAnimator);
                }
            }
        },

        /**
         * Animates the list to the supplied end position.
         */
        animatedScroll: function(start, end, duration, completedCallback) {
            if (!this.scrollToAnimator) {
                this.scrollToAnimator = ScrollToAnimator.create();
                this.scrollToAnimator.onAnimated = this.boundMomentumScroll;
            }

            this.scrollToAnimator.configure(start, end, duration);
            this.scrollToAnimator.onComplete = completedCallback;
            this.runScrollAnimator(this.scrollToAnimator);
        },

        /**
         * Animates the scrolling of the list after it has been flicked.
         */
        momentumScroll: function(scrollVal) {
            var constrainedScrollVal = scrollVal;

            // only constrain if we're not overscrolling
            var canOverscroll = this.overscrollAnimator.complete;
            if (canOverscroll) {
                constrainedScrollVal = this.constrainScroll(scrollVal);
            }

            var isOverscrolling = (scrollVal !== constrainedScrollVal);
            if (isOverscrolling && canOverscroll && this.overscrollEnabled) {
                this.overscrollAnimator.configure(this.scrollVal - this.lastScrollVal, this.constrainScroll(scrollVal));

                // Cut the scroll animation short if we're overscrolling.
                this.scrollAnimator.complete = true;
            }

            this.setScrollVal(constrainedScrollVal);
            this.applyScroll(this.scrollVal, true);

            // Try to run each animator in turn. If the overscroll animator has been configured earlier in this
            // method that will take precidence over the scroll animation.
            var scrollComplete = this.runScrollAnimator(this.overscrollAnimator) || this.runScrollAnimator(this.scrollAnimator) || this.runScrollAnimator(this.scrollToAnimator);
        },

        /**
         * Runs a scroll animator in a loop if that scroll animator is not complete.
         */
        runScrollAnimator: function(animator) {
            var shouldRun = (animator && !animator.complete);
            if (shouldRun) {
                this.momentumScrollAnimationId = window.requestAnimationFrame(function(timestamp) {
                    // check if the method exists because the previous two conditions
                    // will pass if destroy has been called.
                    if (animator && !animator.complete && animator.tick) {
                        animator.tick(timestamp);
                    }
                });
            }
            return shouldRun;
        },

        /**
         * Returns the position of the bottomost element.
         */
        lastElementBottom: function() {
            if (this.hasNodes()) {
                var lastVisibleItem = this.getLastNode();
                return lastVisibleItem.transformVal + this.getElementSize(lastVisibleItem);
            }
            return 0;
        },

        /**
         * Styles the list depending on the orientation. The root element is given a data-orientation
         * with the supplied property.
         * @param {string} orientation - The orientation of the list.
         */
        configureOrientation: function(orientation) {
            this.public.classList.remove('el-list-' + (orientation === 'vertical' ? 'horizontal' : 'vertical'));
            this.public.classList.add('el-list-' + orientation);
            this.public.setAttribute('data-orientation', orientation);
            this.swipeDelegate.orientation = this.swipeDetector.orientation = this.scrollDetector.orientation = this.scrollbar.orientation = this.keyboardInteractions.orientation = orientation;

            // Calculate the property names required depending
            // on the orientation.
            if (orientation === 'vertical') {
                this.dimensionProp = 'height';
                this.invertedDimensionProp = 'width';
                this.sizeProp = 'clientHeight';
                this.translateProp = 'Y';
                this.translateItem = this.recycleNodes ? this.translateItemY : this.translateNone;
            } else {
                this.dimensionProp = 'width';
                this.invertedDimensionProp = 'height';
                this.sizeProp = 'clientWidth';
                this.translateProp = 'X';
                this.translateItem = this.recycleNodes ? this.translateItemX : this.translateNone;
            }
        },

        configureRecyclable: function(recyclable) {
            if (recyclable) {
                this.public.addEventListener('wheel', this.boundMouseWheelHandler, false);
                this.public.classList.add(this.recycleClass);
            } else {
                this.public.removeEventListener('wheel', this.boundMouseWheelHandler, false);
                this.public.classList.remove(this.recycleClass);
            }
        },

        /**
         * Given an element, walks up the element's parents until it finds the list item node.
         * @param {HTMLElement} element - A child element of a list item.
         */
        findListItem: function(element) {
            while (element && element !== this.public) {
                if (element.hasAttribute('data-index')) {
                    return element;
                }
                element = element.parentElement;
            }
            return null;
        },

        /**
         * Handles a tap gesture (touch + release in rapid succession).
         * Dispatches an 'trigger' event to notify clients an item has been selected.
         */
        listItemTapped: function(e, listItem) {
            if (this.lookupTemplateAttribute(listItem, TMPL_ATTR_TRIGGERABLE) === 'false') {
                return;
            }

            // Don't trigger if we just swiped this item open, but do close the swipe delegate.
            var isActiveItem = this.swipeDelegate.isActiveItem(listItem);
            if (this.swipeDelegate.hasActiveItem()) {
                // Tapped on another item that isn't active, or tapped on the list item while its been opened.
                if ((isActiveItem && this.swipeDetector.state === SwipeGestureDetector.States.DETECTING) || !isActiveItem) {
                    this.swipeDelegate.clear();
                    return;
                } else if (isActiveItem && this.swipeDetector.state === SwipeGestureDetector.States.SWIPING) {
                    // just completed an open swipe.
                    return;
                }
            }

            var index = this.getNodeIndex(listItem);
            if (this.userSelectable !== UserSelectable.NONE) {
                // Take advantage of the fact that all event types have meta key information associated (shiftKey, metaKey, etc...)
                this.keyboardInteractions.updateState(e);
                this.updateSelection(index, listItem);
            }

            var event = events.trigger({
                index: index
            });
            listItem.firstElementChild.dispatchEvent(event);
        },

        updateSelection: function(index, listItem) {
            this.selectedIndices = this.touchInteractions.updateSelection(this.selectedIndices, index, listItem);

            var event = module.exports.select({
                indices: this.selectedIndices.concat()
            });
            this.public.dispatchEvent(event);
        },

        /**
         * Constrains the given scroll value to valid bounds so that the viewport is never scrolled out of view.
         * @param {int} desiredScrollVal - The desired scroll value that will be clamped if it's out of bounds.
         */
        constrainScroll: function(desiredScrollVal) {
            if (!this.hasNodes()) {
                return 0;
            }

            // Don't bother constraining if its not recyclable because the browser will do it for us.
            if (!this.recycleNodes) {
                return desiredScrollVal;
            }

            var overscrollPercent;
            var firstVisibleItem = this.getFirstNode();
            var lastVisibleItem = this.getLastNode();

            // The last element in the list is shown, use it as the stop point for scrolling down.
            if (this.getNodeIndex(lastVisibleItem) === this.collectionLastIndex) {
                var bottomOfLastElement = this.lastElementBottom();
                // If there are so few items that they don't fill the height of the list, don't scroll.
                // Otherwise limit the scroll so the bottom of the last list item never goes beyond the list height.
                var lastElementVisible = bottomOfLastElement < this.listSize;
                var maxScrollVal = lastElementVisible ? 0 : bottomOfLastElement - this.listSize;

                if (desiredScrollVal > maxScrollVal || lastElementVisible) {
                    this.overscrollAmt = maxScrollVal + this.overscrollAnimator.dragOverscroll(desiredScrollVal - maxScrollVal);
                    return maxScrollVal;
                }
            }

            // It's possible for variable sized items to yeild a minimum scroll value < 0, so use the first item's translation
            // as the stop point for scrolling up.
            if (this.getNodeIndex(firstVisibleItem) === this.collectionFirstIndex) {
                var minScrollVal = firstVisibleItem.transformVal;
                if (desiredScrollVal < minScrollVal) {
                    this.overscrollAmt = minScrollVal - this.overscrollAnimator.dragOverscroll(-(desiredScrollVal - minScrollVal));
                    return minScrollVal;
                }
            }

            this.overscrolled = false;
            return desiredScrollVal;
        },

        /**
         * Given the total amount to scroll, applyScroll() moves the scroll canvas down or up and then
         * repositions individual list items by wrapping them around when they go off screen.
         * @param {int} scrollPosition - The scroll position of the list.
         */
        applyScroll: function(scrollPosition, showBar) {
            if (!this.recycleNodes) {
                this.public.scrollTop = scrollPosition;
                return;
            }

            // keep moving items from top to bottom or bottom to top until no more are moved.
            // This covers the case where the scroll delta is greater than the height of one item.
            var direction = 0,
                savedDirection = 0;
            while ((direction = this.relayout(scrollPosition, direction, this.touchedNodes)) !== 0) {
                // Save a reference to the direction we're going in so we know how to lay out nodes.
                if (direction !== 0) {
                    savedDirection = direction;
                }
            }

            // If any nodes have moved, lay them out. Decouples the measurement phase from the transform phase.
            if (savedDirection !== 0) {
                this.applyTransformations(this.touchedNodes, this.touchedNodes.startElement, savedDirection);
            }

            // reset the touched nodes array for use next scroll.
            this.touchedNodes.length = 0;
            this.touchedNodes.startElement = null;

            // Scrolls the main child container.
            this.translateItem(this.scrollStyle, -scrollPosition);
            this.scrollbar.scroll(scrollPosition, showBar);
        },

        /**
         * Sets the scroll val while keeping track of the last scroll value
         */
        setScrollVal: function(scrollVal) {
            this.lastScrollVal = this.scrollVal;
            this.scrollVal = scrollVal;
        },

        scrollbarScroll: function(scrollPosition) {
            // var lastVisibleIndex = this.getNodeIndex(this.getLastNode());
            //
            // this.collectionAdapter.length * scrollPosition // this.listSize
            //
            this.applyScroll(scrollPosition);
        },

        /**
         * Repositions a list item if one should be moved to the top from the bottom, or vice versa. If
         * an item is repositioned then this method returns true, otherwise it returns false.
         * @param {int} scrollPosition - The scroll position of the list.
         * @param {int} direction - A direction of movement, if one has been established. When relayout is called
         * multiple times in a frame, the direction is used to ensure that the relayout progresses in a uniform direciton.
         * Otherwise we encounter a corner case with list items that are larger than the list itself where an item is laid
         * out bottom to top and then the next frame top to bottom, in an infinite loop.
         */
        relayout: function(scrollPosition, direction, touchedNodes) {
            var outDirection = 0;
            if (!this.hasNodes()) {
                return outDirection;
            }

            var firstVisibleElement = this.getFirstNode();
            var lastVisibleElement = this.getLastNode();
            var lastElementPosition = Math.round(this.lastElementBottom() - scrollPosition);
            var recycle;

            // If either the first or the last element has moves fully out of the viewport, reposition it.
            if (lastElementPosition <= this.listSize && (direction === 0 || direction === 1)) {
                var firstElementSize = this.getElementSize(firstVisibleElement);
                touchedNodes.startElement = touchedNodes.startElement || lastVisibleElement;
                recycle = firstVisibleElement.transformVal + firstElementSize < scrollPosition;

                outDirection = this.layoutTopToBottom(lastVisibleElement, recycle, touchedNodes);
            } else if (scrollPosition < firstVisibleElement.transformVal && (direction === 0 || direction === -1)) {
                touchedNodes.startElement = touchedNodes.startElement || firstVisibleElement;

                outDirection = this.layoutBottomToTop(firstVisibleElement, true, touchedNodes);
            }

            // Nothing required a relayout.
            return outDirection;
        },

        layoutTopToBottom: function(lastVisibleElement, recycle, touchedNodes, forcedIndex) {
            var elementIndex = forcedIndex !== undefined ? forcedIndex : this.getNodeIndex(lastVisibleElement);

            // If the next element is beyond the bounds of the list, do nothing.
            if (elementIndex < this.collection.length - 1) {
                var proxied = this.wrappedDataModelProxy(elementIndex + 1, 1);
                if (proxied === null) {
                    this.collectionLastIndex = elementIndex;
                    return 0; // No items left, exit early.
                }

                var node = null;
                if (recycle) {
                    // Remove the first from the linked list and push it to the end.
                    node = this.nodeList.shift();
                }

                // Fetch a node of the appropriate template type.
                node = this.getListItemDOMFromPool(proxied.model, proxied.index, node);
                this.populateListItemDOMAndIndex(proxied.model, proxied.index, node);
                node.transformVal = lastVisibleElement ? lastVisibleElement.transformVal + this.getElementSize(lastVisibleElement) : 0;

                touchedNodes.push(node);
                this.nodeList.push(node);
            } else {
                this.collectionLastIndex = elementIndex;
                return 0;
            }

            return 1;
        },

        layoutBottomToTop: function(firstVisibleElement, recycle, touchedNodes, forcedIndex) {
            var elementIndex = forcedIndex !== undefined ? forcedIndex : this.getNodeIndex(firstVisibleElement);

            // If the next element is beyond the bounds of the list, do nothing.
            if (elementIndex > 0) {
                var proxied = this.wrappedDataModelProxy(elementIndex - 1, -1);
                if (proxied === null) {
                    this.collectionFirstIndex = elementIndex;
                    return 0;
                }

                // Remove from the end and push to the front.
                var node = null;
                if (recycle) {
                    node = this.nodeList.pop();
                }

                // Fetch a node of the appropriate template type.
                node = this.getListItemDOMFromPool(proxied.model, proxied.index, node);
                this.populateListItemDOMAndIndex(proxied.model, proxied.index, node);
                node.transformVal = firstVisibleElement ? firstVisibleElement.transformVal - this.getElementSize(node) : this.listSize - this.getElementSize(node);

                touchedNodes.push(node);
                this.nodeList.unshift(node);
            } else {
                this.collectionFirstIndex = elementIndex;
                return 0;
            }

            return -1;
        },

        /**
         * Queries the size of all the supplied nodes and calculates their position,
         * then applies the position. This happens in two loops so all the queries and
         * transformations are applied without interweaving which causes DOM thrashing.
         */
        applyTransformations: function(nodes, startElement, direction) {
            var listLen = nodes.length,
                j, node;
            for (j = 0; j < listLen; j++) {
                node = nodes[j];
                var size = direction === 1 ? (startElement ? this.getElementSize(startElement) : 0) : this.getElementSize(node);
                node.transformVal = (startElement ? startElement.transformVal + (direction * size) : 0);
                this.scrollbar.itemShown(size, this.getNodeIndex(node));
                startElement = node;
            }

            for (j = 0; j < listLen; j++) {
                node = nodes[j];
                this.translateItem(node.style, node.transformVal);
            }
        },

        getNodeDOM: function(index, direction, existingNode) {
            var proxied = this.wrappedDataModelProxy(index, direction);
            if (proxied === null) {
                if (direction === 1) {
                    this.collectionLastIndex = index - 1;
                } else {
                    this.collectionFirstIndex = index + 1;
                }
                return null; // No items left, exit early.
            }

            // Fetch a node of the appropriate template type.
            existingNode = this.getListItemDOMFromPool(proxied.model, proxied.index, existingNode);
            this.populateListItemDOMAndIndex(proxied.model, proxied.index, existingNode);

            return existingNode;
        },

        toggleSelectedIndices: function(indices, selected) {
            var nodes = this.nodeList;
            if (nodes.length === 0 || indices.length === 0) {
                return;
            }

            var _this = this;
            indices.forEach(function(val, i) {
                var element = _this.contentEl.querySelector('li[data-index="' + val + '"]');
                if (element) {
                    var classList = element.classList;
                    if (selected) {
                        classList.add(_this.selectedClassName);
                    } else {
                        classList.remove(_this.selectedClassName);
                    }
                }
            });
        },

        /**
         * Responsible for translating the supplied item to the supplied value. This method acts as a
         * placeholder which is replaced by either translateItemX or Y depending on the list's orientation.
         * @param {HTMLElement} item - The item to translate.
         * @param {int} val - The amount to translate the item.
         */
        translateItem: function(item, val) {
            // This method is redefined by configureOrientation depending on the current orientation.
        },

        translateItemX: function(item, val) {
            item[styles.transform] = 'translate3d(' + (val | 0) + 'px,0,0)';
        },

        translateItemY: function(item, val) {
            item[styles.transform] = 'translate3d(0,' + (val | 0) + 'px,0)';
        },

        translateNone: function(item, val) {
            // don't transform, rather unset it if we're moving from recylable -> non recylclable list.
            if (item[styles.transform]) {
                item[styles.transform] = '';
            }
        },

        /**
         * Clears the active state on the pressed item, if one exists.
         */
        clearActiveItem: function() {
            clearTimeout(this.setActiveItemTimeout);

            if (this.activeListItem) {
                this.activeListItem.classList.remove('el-listview-active');
            }
        },

        /**
         * Sets the supplied list item as the active one and highlights it with the active state.
         */
        setActiveItem: function(listItem) {
            if (this.lookupTemplateAttribute(listItem, TMPL_ATTR_TRIGGERABLE) === 'false') {
                return;
            }

            this.activeListItem = listItem;
            listItem.classList.add('el-listview-active');
        },

        /**
         * Calculates the size of an element.
         */
        getElementSize: function(elem) {
            // When not recylcing nodes the list always reports its max size as infinity so that it never stops populating itself.
            if (!this.recycleNodes && elem === this.public) {
                return Infinity;
            }

            // Fast path, the template has a 'data-itemsize' associated with it
            // or we've already calculated its size.
            var cachedTemplateSize = this.templateAttributeLookup[elem.itemTemplateType] ? parseInt(this.lookupTemplateAttribute(elem, TMPL_ATTR_ITEMSIZE)) || elem.cachedSize : 0;
            if (cachedTemplateSize) {
                return cachedTemplateSize;
            }

            // Can't work with % values, only px.
            var cssSize = elem.style[this.dimensionProp];
            cssSize = (cssSize.indexOf('px') === -1) ? null : parseInt(cssSize);

            // Start by looking for an explicit size in the CSS,
            // then calculate the clientSize and finally as a
            // last resort do a getComputedStyle.
            return (elem.cachedSize = cssSize || elem[this.sizeProp] || parseInt(window.getComputedStyle(elem)[this.dimensionProp]));
        },

        defaultModelProxy: function(index) {
            var model = this.collectionAdapter.get(index);
            if (!model) {
                throw new Error("Expected model at index " + index + " but found null or undefined");
            } else {
                this.transformedPointer.index = index;
                this.transformedPointer.model = model;
                return this.transformedPointer;
            }
        },

        // TODO: These three methods are a hack that monitors if the list has been added to the DOM.
        // It should be removed once we have a way of being notified when we're added to the DOM, as it's
        // pretty inefficient to be checking all the way up our ancestors every frame.

        isInDOMTree: function(node) {
            // If the farthest-back ancestor of our node has a "body"
            // property (that node would be the document itself),
            // we assume it is in the page's DOM tree.
            return !!(this.findUltimateAncestor(node).body);
        },

        /**
         * Returns `true` if the node is shown in the node list. This may not necessarily
         * mean that the node is visible in the viewport.
         * @param {int} index The index of the node you wish to check presence of.
         */
        isIndexInNodeList: function(index) {
            if (!this.hasNodes()) {
                return false;
            }

            var firstVisibleElement = this.getFirstNode();
            var lastVisibleElement = this.getLastNode();

            return index >= this.getNodeIndex(firstVisibleElement) && index <= this.getNodeIndex(lastVisibleElement);
        },

        findUltimateAncestor: function(node) {
            // Walk up the DOM tree until we are at the top (parentNode
            // will return null at that point).
            // NOTE: this will return the same node that was passed in
            // if it has no ancestors.
            var ancestor = node;
            while (ancestor.parentNode) {
                ancestor = ancestor.parentNode;
            }
            return ancestor;
        },

        executeOnLoad: function(node, func) {
            if (this.isInDOMTree(node)) {
                func();
            } else {
                var _this = this;
                this.domAdditionTimeout = window.requestAnimationFrame(function() {
                    _this.executeOnLoad(node, func);
                });
            }
        },

        /**
         * Tears down any existing swipe UI and then creates any new swipe UI
         * if there are actions associated with this template type.
         */
        prepareSwipeUI: function(listItem, direction) {
            var actions = this.listItemTemplates.actionLookup[this.swipeTarget.itemTemplateType];

            if (actions) {
                // Filter out the actions so we only show the ones for this direction.
                actions = actions.filter(this.filterActions.bind(this, -direction, this.orientation));
                if (actions.length) {
                    this.swipeDelegate.show(actions, listItem, direction, this.recycleNodes);
                }
            }

            this.clearActiveItem();
        },

        /**
         * Filter method for an array of actions that returns actions that have
         * match the direction of the swipe. Actions without a data-position property
         * are assumed to be 'top' or 'left' aligned, depending on the list's orientation.
         */
        filterActions: function(direction, orientation, action) {
            var actionDir = action.getAttribute('data-position') || '1';
            var dirStr;

            if (orientation === 'vertical') {
                dirStr = direction === -1 ? 'left' : 'right';
            } else {
                dirStr = direction === -1 ? 'bottom' : 'top';
            }

            return (actionDir === direction.toString() || actionDir === dirStr);
        },

        processSwipeStartEvent: function(type, detail) {
            this.swipeTarget = this.findListItem(detail.originalEvent.target);
            if (this.swipeTarget) {
                this.index = parseInt(this.swipeTarget.getAttribute('data-index'));

                // Cancel any scrolling that is happening.
                this.scrollDetector.cancel();

                this.prepareSwipeUI(this.swipeTarget, detail.direction);
                this.swipeDelegate.swipeStart(detail.originalEvent);
                this.processSwipeEvent(type, detail);
            } else {
                this.swipeDetector.cancel();
            }
        },

        processSwipeMoveEvent: function(type, detail) {
            this.swipeDelegate.swipeMove(detail.originalEvent);
            this.processSwipeEvent(type, detail);
        },

        processSwipeEndEvent: function(type, detail) {
            this.swipeDelegate.swipeEnd(detail.originalEvent);
            this.processSwipeEvent(type, detail);
        },

        /**
         * Takes the simple data passed back from the `SwipeGestureDetector` and transforms
         * it into data that can be broadcast to the world.
         */
        processSwipeEvent: function(type, detail) {
            if (this.dispatchSwipeEvents) {
                detail.target = this.swipeTarget;
                detail.index = this.index;

                // The swipeAction augmented the event with the swipeDelta,
                // the amount the finger has moved since the start of the swipe.
                detail.swipeDelta = detail.originalEvent.swipeDelta || 0;
                delete detail.originalEvent.swipeDelta;

                if(detail.originalEvent.hasOwnProperty('open')) {
                    detail.open = detail.originalEvent.open;
                    delete detail.originalEvent.open;
                }

                if (!this.forwardEvent(type, detail)) {
                    this.swipeDetector.cancel();
                    this.swipeDelegate.clear();
                }
            }
        },

        /**
         * Dispatches an event of the supplied type and with the supplie details. The event
         * will always bubble.
         */
        forwardEvent: function(type, detail) {
            // TODO:paul - what is a valid type here? why can't we re-use the original event
            var event = new CustomEvent(type, {
                bubbles: true,
                cancelable: true
            });
            for (var k in detail) {
                event[k] = detail[k];
            }

            return detail.target.dispatchEvent(event);
        },

        processScrollWheel: function(e) {
            this.overscrollAnimator.cancel();
            this.scrollAnimator.cancel();

            var _this = this;
            //if we don't prevent default, in browsers with a bounce, the whole app will bounce while scrolling the list
            e.preventDefault();
            this.scrollWheelAnim = window.requestAnimationFrame(function() {
                _this.dragStartPos = _this.scrollVal;
                _this.scrollDetector.trackScrollWheel(e);
            });
        },

        processResize: function(e) {
            if (this.recycleNodes) {
                clearTimeout(this.resizeDebounceTimeout);

                var newSize = this.getElementSize(this.public);
                if (!!newSize) {
                    if (newSize > this.listSize || !this.allTemplateSizesCached) {
                        this.resizeDebounceTimeout = setTimeout(this.executeResize.bind(this, newSize), 250);
                    } else {
                        this.listSize = newSize;
                    }
                }
            }
        },

        scrollToRecyclableSync: function(item, index, callback) {
            if (item) {
                this.setScrollVal(this.constrainScroll(item.transformVal));
                this.applyScroll(this.scrollVal);
            } else {
                // It isn't visible so we're going to have to rebuild the list.
                this.rebuildList(index);
            }
            this.scrollbar.scrollToIndex(index);
            if (callback) {
                callback(index);
            }
        },

        allTemplateSameSize: function() {
            if (!this.allTemplateSizesCached) {
                return false;
            }

            var size;
            for (var i in this.templateAttributeLookup) {
                var itemSize = this.templateAttributeLookup[i][TMPL_ATTR_ITEMSIZE];
                if (size === undefined) {
                    size = itemSize;
                } else if (size !== itemSize) {
                    return false;
                }
            }

            return parseInt(size);
        },

        scrollToNonRecylable: function(item, index, duration, callback) {
            var scrollTopEnd = item.getBoundingClientRect().top;

            if (!duration) {
                this.public.scrollTop = scrollTopEnd;
                if (callback) {
                    callback(index);
                }
            } else {
                this.animatedScroll(this.public.scrollTop, scrollTopEnd, duration, partial(callback, window, index));
            }
        },

        getFirstVisibleElement: function() {
            for (var i = 0; i < this.nodeList.length; i++) {
                var node = this.nodeList[i];
                if (node.transformVal + this.getElementSize(node) > this.scrollVal) {
                    return node;
                }
            }
        },

        getNodeIndex: function(node) {
            return node.__listIndex || parseInt(node.getAttribute('data-index'));
        },

        getLastNode: function() {
            return this.nodeList[this.nodeList.length - 1];
        },

        getFirstNode: function() {
            return this.nodeList[0];
        },

        hasNodes: function() {
            return this.nodeList.length > 0;
        },

        intersectsRect: function(parent, child) {
            return parent.left < child.right && parent.right > child.left && parent.top < child.bottom && parent.bottom > child.top;
        },

        executeResize: function(newSize) {
            this.listSize = newSize;

            // The relayout of content may have caused the size of the node
            // to change, so pool everything and re-layout without moving the scroll pos.
            if (!this.allTemplateSizesCached) {
                var firstVisibleElement = this.getFirstVisibleElement();
                // Empty list
                if (!firstVisibleElement) {
                    return;
                }
                var diff = this.scrollVal - firstVisibleElement.transformVal;

                this.rebuildList(this.getNodeIndex(firstVisibleElement));

                // The first item will be top-aligned, so reintroduce the offset from the top
                // it had before the relayout.
                this.setScrollVal(this.constrainScroll(this.scrollVal + diff));
                this.applyScroll(this.scrollVal);
            } else {
                this.applyScroll(this.scrollVal);
            }
        },

        processListAdded: function() {
            window.addEventListener('resize', this.boundProcessResize);
            this.addedToDOM = true;
            this.invalidate();
        },

        processPageFirstVisible: function() {
            this.parentPage.removeEventListener('visible', this.boundPageFirstVisible);
            this.parentPage.addEventListener('visible', this.boundProcessResize);
            this.processListAdded();
        },

        addKeyboardEventListeners: function() {
            this.keyboardInteractions.enabled = true;
        },

        removeKeyboardEventListeners: function() {
            this.keyboardInteractions.enabled = false;
        },

        configurePageVisibilityListeners: function(parentControl) {
            while (parentControl) {
                if (parentControl.tagName === 'EL-PAGE') {
                    this.parentPage = parentControl;
                    this.parentPage.addEventListener('visible', this.boundPageFirstVisible);
                    this.parentPage.addEventListener('visible', this.boundAddKeyboardEventListeners);
                    this.parentPage.addEventListener('invisible', this.boundRemoveKeyboardEventListeners);
                    break;
                }
                parentControl = parentControl.parentControl;
            }

            // We're operating outside of a page.
            if (!parentControl && !this.UNIT_TESTING) {
                // Populate only once we've been added to the DOM.
                this.executeOnLoad(this.public, this.processListAdded.bind(this));
            }
        },

        enableUnitTestMode: function() {
            this.oldInvalidate = this.invalidate;
            this.invalidate = this.unitTestInvalidate;
            window.addEventListener('resize', this.boundProcessResize);
            this.addKeyboardEventListeners();
        },

        disableUnitTestMode: function() {
            this.invalidate = this.oldInvalidate;
            this.removeKeyboardEventListeners();
        }
    },

    init: function(params) {
        params = params || {};
        // Grab template children if there are any. Save them until the skeleton is configured.
        var templates = Array.prototype.slice.call(this.public.querySelectorAll('script[type="text/template"]'));

        if (templates.length === 0 && this.public.children.length > 0) {
            var msg = params.sourcepath ? params.sourcepath + ':\n' : '';
            msg = msg + 'Found children in the list that aren\'t templates. Did you forget to wrap them in a <script type="text/template"> tag?';
            console.warn(msg);
        }

        templates.forEach(function (template) {
            template.parentNode.removeChild(template);
        });
        this.public.innerHTML = listSkeletonTemplate;
        this.contentEl = this.public.querySelector('ul');
        this.wrappedDataModelProxy = this.defaultModelProxy;

        this.scrollStyle = this.contentEl.style;
        this.sourcepath = params.sourcepath;
        this.require = params.require || window.require || function() {};

        this.keyboardInteractions = KeyboardInteractions.create(this.public, this.getFirstVisibleElement.bind(this));
        this.touchInteractions = TouchInteractions.create(this.public, this.keyboardInteractions);

        this.keyboardInteractions.modelProxy = this.touchInteractions.modelProxy = this.wrappedDataModelProxy.bind(this);

        this.interactionMode = new InteractionMode();
        this.scrollVal = this.lastScrollVal = 0;
        this.listItemPool = Pool.create();
        this.templateAttributeLookup = {};
        this.dirtyLookup = {};
        this.nodeList = [];
        this.selectedIndices = [];
        this.touchedNodes = [];

        this.templater = Templater.create({
            sourcepath: this.sourcepath,
            require: this.require,
            list: this.public
        });

        this.swipeStartHandler = partial(this.processSwipeStartEvent, this, Events.SWIPE_START);
        this.swipeMoveHandler = partial(this.processSwipeMoveEvent, this, Events.SWIPE_MOVE);
        this.swipeEndHandler = partial(this.processSwipeEndEvent, this, Events.SWIPE_END);

        this.railDetector = RailDetector.create();

        this.swipeDelegate = SwipeActionDelegate.create(this.public, this.contentEl);

        this.swipeDetector = SwipeGestureDetector.create();
        this.swipeDetector.subscribe('start', this.swipeStartHandler);
        this.swipeDetector.subscribe('move', this.swipeMoveHandler);
        this.swipeDetector.subscribe('end', this.swipeEndHandler);

        this.scrollStartHandler = this.onScrollGestureStart.bind(this);
        this.scrollMoveHandler = this.onScrollGestureMove.bind(this);
        this.scrollEndHandler = this.onScrollGestureEnd.bind(this);

        this.scrollDetector = ScrollGestureDetector.create();
        this.scrollDetector.subscribe('start', this.scrollStartHandler);
        this.scrollDetector.subscribe('move', this.scrollMoveHandler);
        this.scrollDetector.subscribe('end', this.scrollEndHandler);

        this.boundMomentumScroll = this.momentumScroll.bind(this);
        this.boundRepopulate = this.repopulate.bind(this);
        this.boundMouseWheelHandler = this.processScrollWheel.bind(this);
        this.boundProcessResize = this.processResize.bind(this);
        this.boundPageFirstVisible = this.processPageFirstVisible.bind(this);
        this.boundScrollbarScroll = this.scrollbarScroll.bind(this);

        this.overscrollAnimator = OverscrollAnimator.create();
        this.overscrollAnimator.onAnimated = this.boundMomentumScroll;
        this.scrollAnimator = ScrollAnimator.create();
        this.scrollAnimator.onAnimated = this.boundMomentumScroll;

        this.boundTouchStart = this.onTouchStart.bind(this);
        this.boundAddKeyboardEventListeners = this.addKeyboardEventListeners.bind(this);
        this.boundRemoveKeyboardEventListeners = this.removeKeyboardEventListeners.bind(this);

        this.public.addEventListener('touchstart', this.boundTouchStart);
        this.public.addEventListener('mousedown', this.boundTouchStart);

        var scrollbarDiv = document.createElement('div');
        scrollbarDiv.classList.add('scrollbar');
        this.scrollbar = ScrollBar.create(scrollbarDiv, {});
        this.scrollbar.onScroll = this.boundScrollbarScroll;
        this.public.appendChild(this.scrollbar);

        // Swap out methods not suitable for testing with
        // their unit testing equivalents.
        if (this.UNIT_TESTING) {
            this.enableUnitTestMode();
        }

        this.public.templateType = this.public.getAttribute('data-template-type');

        // Don't call public as it relies on orientation also being set. Orientation
        // relies on recycleNodes being set. So just let configureOrientation do the work.
        this.recycleNodes = this.public.getAttribute('data-recycle-nodes') === 'true';
        this.configureRecyclable(this.recycleNodes);

        this.dispatchSwipeEvents = this.public.getAttribute('data-swipe-events') === 'true';

        this.ignoreInvalidation = true;
        this.public.orientation = this.public.getAttribute('data-orientation') || 'vertical';
        this.public.userSelectable = this.public.getAttribute('data-user-selectable') || UserSelectable.NONE;
        this.ignoreInvalidation = false;

        // Only set the templates if there are any present in the DOM at parse time.
        // Otherwise set the default template in repopulate().
        if (templates.length > 0) {
            this.public.itemTemplate = templates;
        }

        this.configurePageVisibilityListeners(params ? params.parentControl : null);
    },

    /**
     * Destroyes the list. Once the list has been destroyed its
     * el cannot be added to the DOM and calling methods on the control
     * will result in unpredictable behaviour.
     */
    destroy: function() {
        window.removeEventListener('resize', this.boundProcessResize);

        window.cancelAnimationFrame(this.momentumScrollAnimationId);
        window.cancelAnimationFrame(this.invalidateTimeoutId);
        window.cancelAnimationFrame(this.domAdditionTimeout);
        window.cancelAnimationFrame(this.touchMoveAnimationId);
        window.cancelAnimationFrame(this.scrollWheelAnim);

        clearTimeout(this.setActiveItemTimeout);
        clearTimeout(this.resizeDebounceTimeout);

        this.public.removeEventListener('touchstart', this.boundTouchStart);
        this.public.removeEventListener('mousedown', this.boundTouchStart);

        this.boundTouchStart = undefined;

        document.body.removeEventListener('touchmove', this.onListItemTouchMove);
        document.body.removeEventListener('touchend', this.onListItemTouchEnd);
        document.body.removeEventListener('touchcancel', this.onListItemTouchEnd);
        document.body.removeEventListener('mousemove', this.onListItemTouchMove);
        document.body.removeEventListener('mouseup', this.onListItemTouchEnd);
        document.body.removeEventListener('mouseleave', this.onListItemTouchEnd);
        this.onListItemTouchEnd = this.onListItemTouchMove = null;

        this.cleanNodes();
        this.emptyPool();

        // Release the Kracken!... uh, no, the DOM!
        this.contentEl = this.activeListItem = null;

        if (this.collectionAdapter) {
            this.collectionAdapter.unsubscribe('change', this.onChangeHandler);
            this.collectionAdapter.unsubscribe('add', this.boundAddedHandler);
            this.collectionAdapter.unsubscribe('remove', this.boundRemovedHandler);

            this.collectionAdapter.destroy();
            this.collectionAdapter = null;
        }

        this.interactionMode.destroy();
        this.interactionMode = undefined;

        this.listItemPool.destroy();
        this.listItemPool = undefined;

        this.railDetector.destroy();
        this.railDetector = undefined;

        this.swipeDelegate.destroy();
        this.swipeDelegate = undefined;

        this.swipeDetector.unsubscribe('start', this.swipeStartHandler);
        this.swipeDetector.unsubscribe('move', this.swipeMoveHandler);
        this.swipeDetector.unsubscribe('end', this.swipeEndHandler);

        this.swipeStartHandler = undefined;
        this.swipeMoveHandler = undefined;
        this.swipeEndHandler = undefined;

        this.swipeDetector.destroy();
        this.swipeDetector = undefined;

        this.scrollDetector.unsubscribe('start', this.scrollStartHandler);
        this.scrollDetector.unsubscribe('move', this.scrollMoveHandler);
        this.scrollDetector.unsubscribe('end', this.scrollEndHandler);

        this.scrollStartHandler = undefined;
        this.scrollMoveHandler = undefined;
        this.scrollEndHandler = undefined;

        this.scrollDetector.destroy();
        this.scrollDetector = undefined;

        // compiler may have destroyed this already.
        if (this.scrollbar.destroy) {
            this.scrollbar.onScroll = undefined;
            this.scrollbar.destroy();
        }
        this.scrollbar = undefined;

        if (this.scrollAnimator) {
            this.scrollAnimator.destroy();
            this.scrollAnimator = undefined;
        }

        if (this.overscrollAnimator) {
            this.overscrollAnimator.destroy();
            this.overscrollAnimator = undefined;
        }

        if (this.scrollToAnimator) {
            this.scrollToAnimator.destroy();
            this.scrollToAnimator = undefined;
        }

        this.templater.destroy();

        if (this.parentPage) {
            this.parentPage.removeEventListener('visible', this.boundProcessResize);
            this.parentPage.removeEventListener('visible', this.boundAddKeyboardEventListeners);
            this.removeKeyboardEventListeners();
            this.parentPage.removeEventListener('invisible', this.boundRemoveKeyboardEventListeners);
        }

        this.keyboardInteractions.destroy();
        this.keyboardInteractions = undefined;

        this.touchInteractions.destroy();
        this.touchInteractions = undefined;

        this.boundMomentumScroll = undefined;
        this.boundRepopulate = undefined;
        this.boundMouseWheelHandler = undefined;
        this.boundProcessResize = undefined;
        this.boundScrollbarScroll = undefined;
        this.boundAddKeyboardEventListeners = undefined;
        this.boundRemoveKeyboardEventListeners = undefined;

        this.parentPage = undefined;
        this.swipeTarget = undefined;
        this.scrollStyle = undefined;
        this.templateAttributeLookup = undefined;
        this.dirtyLookup = undefined;
        this.nodeList = undefined;
        this.listItemTemplates = undefined;
        this.itemTemplate = undefined;
        this.modelTransform = undefined;
        this.collection = undefined;
        this.selectedIndices = undefined;
        this.touchedNodes = undefined;
        this.templater = undefined;
        this.touchStartEvent = undefined;
        this.templateType = undefined;
    }
};

},{"../../shared/events.js":115,"../../shared/interactionMode.js":116,"../common/easing.js":13,"../common/pool.js":15,"./adapter.js":24,"./animation/cumulativeDelta.js":27,"./animation/overscrollAnimator.js":29,"./animation/scrollAnimator.js":30,"./animation/scrollToAnimator.js":31,"./controller/keyboardInteractions.js":32,"./controller/touchInteraction.js":33,"./gestures/railDetector.js":34,"./gestures/scrollGestureDetector.js":35,"./gestures/swipeGestureDetector.js":36,"./scrollbar/scrollbar.js":38,"./standardListItem.html":41,"./swipe/swipeDelegate.js":43,"./template.html":44,"./templates/templater.js":49}],38:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var styles = window.elsa.utils.styles;

var MovingAverage = require('../animation/movingAverage.js');
var utils = require('../../../shared/utils.js');
var easing = require('../../common/easing.js');
var template = require('./template.html');
var SizeAnimator = require('./sizeAnimator.js');

var constrain = function(min, max, val) {
    return Math.min(Math.max(val, min), max);
};

module.exports = {
    name: 'scrollbar',

    extend: window.HTMLElement,

    public: {
        orientation: {
            set: function(value) {
                if (this.orientation !== value) {
                    this.orientation = value;
                    this.configureOrientation(this.orientation);
                }
            }
        },

        onScroll: undefined,

        scrollableArea: 0,

        collectionSize: 0,

        scroll: function(scrollPosition, showBar) {
            var estimatedArea = this.areaAnimator.tick(this.averageItemSize, showBar) * this.collectionSize;
            var estimatedSize = estimatedArea - this.scrollableArea;

            // Scrollable area is smaller than the size of the list.
            if (estimatedSize < 0) {
                return;
            }

            this.size = this.sizeBar(showBar);
            if (showBar) {
                this.showBar();
            }

            var scrollPercent = (scrollPosition + this.offsetPosition) / estimatedSize;
            this.positionBar(scrollPercent);
        },

        scrollToIndex: function(index) {
            var pos = index * this.averageItemSize;
            this.public.scroll(pos, false);
            this.offsetPosition = pos;
        },

        itemShown: function(size, index) {
            if (!this.itemLookup[index]) {
                this.itemLookup[index] = true;
                this.averageItemSize = this.movingAverage.push(size);
            }
        },

        reset: function() {
            this.itemLookup = {};
            this.movingAverage.reset();
            this.offsetPosition = 0;
        }
    },

    private: {
        minSize: 20,

        size: 40,

        padding: 5,

        hideTimeoutDuration: 300,

        hideTimeoutId: 0,

        offsetPosition: 0,

        sizeInterpolationMaxTicks: 20,

        sizeInterpolationCtr: 0,

        estimatedScrollArea: {
            get: function() {
                return this.averageItemSize * this.collectionSize;
            }
        },

        configureOrientation: function(orientation) {
            // Calculate the property names required depending
            // on the orientation.
            if (orientation === 'vertical') {
                this.translateProp = 'Y';
                this.dimensionProp = 'height';
                this.girthProp = 'width';
                this.translateItem = this.translateItemY;
                this.getInteractionPosition = utils.getInteractionPositionMethod('y');
            } else {
                this.translateProp = 'X';
                this.dimensionProp = 'width';
                this.girthProp = 'height';
                this.translateItem = this.translateItemX;
                this.getInteractionPosition = utils.getInteractionPositionMethod('x');
            }

            this.onDeviceResize(window.elsa.App.device.type);
        },

        sizeBar: function(animate) {
            var newSize = this.sizeAnimator.tick(this.calculateSize(), animate);
            if (newSize !== this.size) {
                this.size = newSize;
                this.barStyle[this.dimensionProp] = (newSize | 0) + 'px';
            }
            return newSize;
        },

        calculateSize: function() {
            var sizePerc = this.scrollableArea / this.estimatedScrollArea;
            var size = sizePerc * this.scrollableArea;
            return constrain(this.minSize, this.scrollableArea, size);
        },

        showBar: function() {
            this.lastShownTime = Date.now();
            if (!this.hideTimeoutId) {
                window.elsa.App.cancelAnimationFrame(this);
                window.elsa.App.requestAnimationFrame(this, function() {
                    this.barEl.classList.remove('hidden');

                    this.hideTimeoutId = setTimeout(this.hideBar, this.hideTimeoutDuration);
                });
            }
        },

        hideBar: function() {
            if (Date.now() - this.lastShownTime > this.hideTimeoutDuration - 50) {
                window.elsa.App.cancelAnimationFrame(this);
                window.elsa.App.requestAnimationFrame(this, function() {
                    this.barEl.classList.add('hidden');
                    this.hideTimeoutId = undefined;
                });
            } else {
                this.hideTimeoutId = setTimeout(this.hideBar, this.hideTimeoutDuration);
            }
        },

        positionBar: function(scrollPercent) {
            var scrollArea = this.scrollableArea - (this.padding * 2);
            var pos = Math.round((scrollPercent * scrollArea) - (this.sizeAnimator.currentSize() * scrollPercent));
            var constrainedPos = this.padding + constrain(0, scrollArea - this.sizeAnimator.currentSize(), pos);

            this.position = constrainedPos;
            this.translateItem(this.translateStyle, constrainedPos);
        },

        getInteractionPosition: function(event) {
            // This method is redefined by configureOrientation depending on the current orientation.
        },

        translateItem: function(item, val) {
            // This method is redefined by configureOrientation depending on the current orientation.
        },

        translateItemX: function(item, val) {
            item[styles.transform] = 'translate3d(' + val + 'px,0,0)';
        },

        translateItemY: function(item, val) {
            item[styles.transform] = 'translate3d(0,' + val + 'px,0)';
        },

        onMouseDown: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.touchStartPos = this.getInteractionPosition(e) + this.position;

            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousecancel', this.onMouseUp);

            this.barEl.classList.add('scrolling');
        },

        onMouseMove: function(e) {
            //TODO: window.requestAnimationFrame.
            var pos = this.getInteractionPosition(e) - this.touchStartPos;
            var perc = constrain(0, 1, pos / this.scrollableArea);

            this.positionBar(perc);

            if (this.public.onScroll) {
                this.public.onScroll(perc * (this.estimatedScrollArea - this.scrollableArea));
            }
        },

        onMouseUp: function(e) {
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousecancel', this.onMouseUp);

            this.barEl.classList.remove('scrolling');
        },

        onDeviceResize: function(size) {
            var girth = (size === 'narrow') ? 4 : 8;
            this.barEl.style[this.girthProp] = girth + 'px';
        }
    },

    init: function(params) {
        this.public.innerHTML = template;
        this.barEl = this.public.querySelector('.bar');
        this.translateStyle = this.public.style;
        this.barStyle = this.barEl.style;
        this.movingAverage = MovingAverage.create();
        this.sizeAnimator = SizeAnimator(this.size, this.sizeInterpolationMaxTicks);
        this.areaAnimator = SizeAnimator(0, this.sizeInterpolationMaxTicks);

        // keep track of all the items, making this really just a regular average.
        this.movingAverage.size = undefined;
        this.public.reset();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.hideBar = this.hideBar.bind(this);
        this.onDeviceResize = this.onDeviceResize.bind(this);

        window.elsa.App.device.addListener(this.onDeviceResize);

        // this.public.addEventListener('mousedown', this.onMouseDown);
    },

    destroy: function() {
        window.elsa.App.cancelAnimationFrame(this);

        this.movingAverage.destroy();
        this.movingAverage = undefined;

        this.barEl = undefined;
        this.barStyle = undefined;
        this.itemLookup = undefined;
        this.translateStyle = undefined;
        this.sizeAnimator = undefined;
        this.areaAnimator = undefined;

        this.public.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousecancel', this.onMouseUp);
        window.elsa.App.device.removeListener(this.onDeviceResize);

        clearTimeout(this.hideTimeoutId);
    }
};

},{"../../../shared/utils.js":118,"../../common/easing.js":13,"../animation/movingAverage.js":28,"./sizeAnimator.js":39,"./template.html":40}],39:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var easing = require('../../common/easing.js');

// Simple little object that animates a value over a fixed number of
// ticks, or snaps it to the new size and resets the tick counter.
var SizeAnimator = function(currentSize, maxTicks) {
    var startSize = currentSize,
        endSize, interpolator, animating = false;

    var reset = function(size) {
        currentSize = size;
        interpolator = 0;
        animating = false;
    };

    var configure = function(size) {
        startSize = currentSize;
        endSize = size;
        interpolator = 0;
        animating = true;
    };

    return {
        tick: function(size, animate) {
            if (size !== endSize) {
                configure(size);
            }

            if (animate && animating) {
                interpolator += 1;
                if (interpolator < maxTicks) {
                    size = easing.linear(interpolator, startSize, endSize - startSize, maxTicks);
                } else {
                    reset(size);
                }
            } else {
                reset(size);
            }

            currentSize = size;

            return size;
        },
        currentSize: function() {
            return currentSize;
        }
    };
};

module.exports = SizeAnimator;

},{"../../common/easing.js":13}],40:[function(require,module,exports){
module.exports = "<div class=\"bar hidden\"></div>";

},{}],41:[function(require,module,exports){
module.exports = "<div class=el-listitem data-template-type=legacy data-itemsize=54px><img class=el-listitem-image data-src=\"image\"><div class=el-listitem-textcontent><div class=el-listitem-subtextcontent><div class=el-listitem-title data-content=title></div><div class=el-listitem-subtitle data-content=subtitle></div></div><div class=el-listitem-description data-content=description></div></div></div>";

},{}],42:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var actionType = window.elsa.action;
var styles = window.elsa.utils.styles;

var utils = require('../../../shared/utils.js');
var events = require('../../../shared/events.js');

var clonableProps = {};

/*
 * Pulls properties off of the actionType prototype that have both
 * a getter and setter. This can be used to transfer values over
 * from one action to another.
 */
var clonableActionProps = function() {
    // memoized for performance.
    if (clonableProps.p) {
        return clonableProps.p;
    }

    var walkProtoChain = function walkProtoChain(proto, arr) {
        var props = Object.getOwnPropertyNames(proto);
        for (var i in props) {
            // filters those properties down so only clonable properties are kept.
            var desc = Object.getOwnPropertyDescriptor(proto, props[i]);
            if (desc.hasOwnProperty('get') && desc.hasOwnProperty('set')) {
                arr.push(props[i]);
            }
        }

        var parentProto = Object.getPrototypeOf(proto);
        if (parentProto !== HTMLElement.prototype) {
            return walkProtoChain(parentProto, arr);
        }
        return arr;
    };

    // lazily fetching the type means the definition of action is deferred.
    var actionType = compiler.elements.action;

    clonableProps.p = [];
    return walkProtoChain(actionType.prototype, clonableProps.p);
};

module.exports = Extend.createType({
    name: 'swipeui',

    extend: window.HTMLElement,

    actiontrigger: events.createEventType('actiontrigger', {
        bubbles: true,
        cancelable: true
    }),

    public: {

        listItem: {
            writable: false
        },

        /**
         * Resets the swipe ui so that the list item that covers it is closed. Emits a
         * `reset` event when the transition closed is complete.
         */
        reset: function() {
            if (this.isReset) {
                return;
            }
            this.isReset = true;

            // If the user moved back to the start position the transition
            // end callback wont get called.
            this.listItem.removeEventListener(styles.transitionend, this.transitionEnd);

            if (!this.swipePos) {
                this.resetTransitionEnd();
            } else {
                this.listItem.addEventListener(styles.transitionend, this.resetTransitionEnd);
                this.listItem.classList.add(this.transitioningClassName);
                this.translateItem(0);
            }
        },

        swipeEnd: function(e) {
            var size = this.childrenSize,
                swipeDistance,
                didSwipe = false;

            // If velocity was calculated and attached to the event, take it into consideration
            if (e && e.velocity) {
                swipeDistance = this.direction > 0 ? Math.max(this.swipePos, e.velocity.x) : Math.min(this.swipePos, e.velocity.x);
            } else {
                swipeDistance = this.swipePos;
            }

            // The RAF to calculate childrenSize means it may be unset.
            if (!size || (this.direction > 0 && swipeDistance < size * 0.5) || (this.direction < 0 && swipeDistance > -size * 0.5)) {
                this.public.reset();
                return didSwipe;
            } else {
                var fullSwipe = size * this.direction;

                // Call reset if a full swipe would cause div to be completely offscreen
                if (typeof this.listItem.transformValX !== "undefined" &&
                   (this.listItem.transformValX + fullSwipe <= -this.listItem.scrollWidth || this.listItem.transformValX + fullSwipe >= this.listItem.clientWidth)) {
                    this.public.reset();
                    return didSwipe;
                } else {
                    this.positionSwipe(fullSwipe, true);
                    didSwipe = true;
                }
            }
            this.firstTouchPosition = undefined;

            //update transformVals to reflect new values after latest transition, unless actionContainer is a separate container
            if (this.listItem && this.listItem.transformValX !== "undefined" && this.actionContainer === this.listItem) {
                this.listItem.transformValX = this.transformValX;
            }

            if (this.listItem && this.listItem.transformValY !== "undefined" && this.actionContainer === this.listItem) {
                this.listItem.transformValY = this.transformValY;
            }

            return didSwipe;
        },

        swipeMove: function(e) {
            this.isReset = false;

            var pos = (this.listItem.transformValX || 0) + this.getSwipeInteractionPosition(e);
            if (!this.firstTouchPosition) {
                this.firstTouchPosition = pos - (this.swipePos || 0);
            }
            this.positionSwipe(pos - this.firstTouchPosition);
        },

        resetDOM: function() {
            this.listItem.classList.remove(this.swipeContainerClassName);
            this.listItem.classList.remove(this.swipeDirectionClasses[this.direction]);

            this.listItem.removeEventListener(styles.transitionend, this.transitionEnd);
            this.listItem.removeEventListener(styles.transitionend, this.resetTransitionEnd);
        }
    },

    private: {
        swipeContainerClassName: 'el-swipe-container',

        transitioningClassName: 'transitioning',

        swipeDirectionClasses: {
            '1': 'swipe-right',
            '-1': 'swipe-left'
        },

        swipeActionClasses: {
            '1': 'action-right',
            '-1': 'action-left'
        },

        /**
         * Returns a cloned action, grabbing all its clonable properties
         * and copying them over to the newly created action.
         */
        cloneAction: function(action) {
            var actionType = compiler.elements.action;
            var props = clonableActionProps();
            var clonedAction = actionType.create();

            for (var i in props) {
                clonedAction[props[i]] = action[props[i]];
            }

            var attributes = Array.prototype.slice.call(action.attributes);
            attributes.forEach(function(attr) {
                clonedAction.setAttribute(attr.name, attr.value);
            });
            return clonedAction;
        },

        /**
         * Creates and returns a div that contains cloned actions.
         */
        createActions: function(actions) {
            var container = this.public;
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                var clonedAction = this.cloneAction(action);

                clonedAction = compiler.compile(clonedAction, this.listItem);

                clonedAction.originalAction = action;
                container.appendChild(clonedAction);
                clonedAction.addEventListener('trigger', this.actionTriggered);

                if (i !== actions.length - 1) {
                    var bar = document.createElement("div");
                    bar.classList.add("el-pipe");
                    container.appendChild(bar);
                }
            }
            return container;
        },

        actionTriggered: function(e) {
            // kill this event before it escapes into the wild and replace
            // it with a duplicate that has the proper type and detail.
            e.preventDefault();
            e.stopPropagation();

            // Because we're going to destroy our dom we want to reference the
            // `originalAction` parsed out of the template. Otherwise the user
            // gets back an action that is slated for destruction.
            var event = module.exports.actiontrigger({
                action: e.action,
                index: parseInt(this.listItem.getAttribute('data-index'))
            });

            this.public.dispatchEvent(event);
            this.public.reset();
        },

        /**
         * Reset transition end handler
         */
        resetTransitionEnd: function() {
            this.public.resetDOM();

            this.swipePos = undefined;
            this.translateItem(0);
            this.public.publish('reset', this.public);
        },

        transitionEnd: function() {
            this.listItem.classList.remove(this.transitioningClassName);
            this.listItem.removeEventListener(styles.transitionend, this.resetTransitionEnd);
        },

        /**
         * Positions the swipe container, constraining to only valid values
         */
        positionSwipe: function(pos, animate) {
            if (pos === this.swipePos || !this.childrenSize) {
                return;
            }

            if (animate) {
                this.listItem.addEventListener(styles.transitionend, this.transitionEnd);
                this.listItem.removeEventListener(styles.transitionend, this.resetTransitionEnd);

                this.listItem.classList.add(this.transitioningClassName);
            } else {
                this.listItem.removeEventListener(styles.transitionend, this.transitionEnd);
                this.listItem.removeEventListener(styles.transitionend, this.resetTransitionEnd);

                this.listItem.classList.remove(this.transitioningClassName);
            }

            this.translateItem(this.constrainSwipePosition(pos));
        },

        /**
         * Constrains the swipe position so it doesn't leave the bounds of the swipe ui.
         */
        constrainSwipePosition: function(pos) {
            return this.direction > 0 ? Math.max(0, Math.min(this.childrenSize, pos)) : Math.min(0, Math.max(-this.childrenSize, pos));
        },

        /**
         * Responsible for translating the supplied item to the supplied value. This method acts as a
         * placeholder which is replaced by either translateItemX or Y depending on the list's orientation.
         * @param {HTMLElement} item - The item to translate.
         * @param {int} val - The amount to translate the item.
         */
        translateItem: function(val) {
            // This method is redefined by configureOrientation depending on the current orientation.
        },

        translateItemX: function(val) {
            this.transformValX = this.getListItemTransformX(val);
            this.listItem.style[styles.transform] = 'translate3d(' + this.transformValX + 'px,' + this.getListItemTransform() + 'px,0)';
            this.swipePos = val;
        },

        translateItemY: function(val) {
            this.transformValY = this.getListItemTransformY(val);
            this.listItem.style[styles.transform] = 'translate3d(' + this.getListItemTransform() + ',' + this.transformValY + 'px,0)';
            this.swipePos = val;
        },

        getSwipeInteractionPosition: function(event) {
            // do nothing, replaced in orientation setter.
        },

        getListItemTransformX: function(val) {
            return (this.listItem.transformValX || 0) + (val || 0);
        },

        getListItemTransformY: function(val) {
            return (this.listItem.transformValY || 0) + (val || 0);
        },


        getListItemTransform: function() {
            return this.recycledNodes ? this.listItem.transformVal : 0;
        }
    },

    init: function(actions, listItem, direction, orientation, recycledNodes) {
        this.listItem = listItem;
        this.direction = direction;
        this.orientation = orientation;
        this.recycledNodes = recycledNodes;
        this.getSwipeInteractionPosition = utils.getInteractionPositionMethod(orientation === 'vertical' ? 'x' : 'y');
        this.resetTransitionEnd = this.resetTransitionEnd.bind(this);
        this.transitionEnd = this.transitionEnd.bind(this);
        this.translateItem = orientation === 'vertical' ? this.translateItemX : this.translateItemY;

        this.public.classList.add('el-swipe-ui');

        if (listItem.nodeName.toLowerCase() === "li") {
            this.actionTriggered = this.actionTriggered.bind(this);

            // Create the action container and populate it.
            this.createActions(actions);
            this.actionContainer = this.public;
        } else {
           // swipeItem is not a list and does not use a separate container for content
            this.actionContainer = listItem;
        }

        // Wrap the listitem contents in a div that we can use as the swipe container.
        this.listItem.classList.add(this.swipeContainerClassName, this.swipeDirectionClasses[direction]);
        this.public.classList.add(this.swipeActionClasses[direction]); // TODO: Take in to account orientation

        var clientSizeProp = orientation === 'vertical' ? 'clientWidth' : 'clientHeight';
        var self = this;

        // Prevents jank not forcing a repaint when querying the clientSize.
        this.sizeAnimationId = window.requestAnimationFrame(function() {
            self.childrenSize = self.actionContainer[clientSizeProp];
        });
    },

    destroy: function() {
        window.cancelAnimationFrame(this.sizeAnimationId);

        compiler.destroy(this.actionContainer.children);

        this.listItem = undefined;
        this.actionContainer = undefined;
        this.transitionEnd = undefined;
    }
});

},{"../../../shared/events.js":115,"../../../shared/utils.js":118}],43:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var styles = window.elsa.utils.styles;

var SwipeAction = require('./swipeActions.js');
var utils = require('../../../shared/utils.js');

/**
 * Factory function that returns a method that can calculate the swipe delta
 * over successive events.
 * @param  {String} orientation
 * @return {Function} Takes an event, returns the swipe delta.
 */
var swipeDeltaCalculator = function(orientation) {
    var startPos;
    var getSwipeInteractionPosition = utils.getInteractionPositionMethod(orientation === 'vertical' ? 'x' : 'y');
    return function calculate(e) {
        if(startPos === undefined) {
            startPos = getSwipeInteractionPosition(e);
            return 0;
        } else {
            return getSwipeInteractionPosition(e) - startPos;
        }
    };
};

module.exports = Extend.createType({

    name: 'SwipeDelegate',

    public: {
        /**
         * The list's orientation.
         */
        orientation: {
            set: function(orientation) {
                this.orientation = orientation;
            }
        },

        /**
         * Shows swipe UI for the supplied `actions` and `listItem`. If another swipe interface is
         * open then it is closed and cleaned up.
         * @param {Array} actions An array of actions to show
         * @param {HTMLElement} listItem The list item these actions are for.
         * @param {int} direction The direction of the swipe.
         * @param {boolean} recycledNodes If the list recycles its nodes.
         */
        show: function(actions, listItem, direction, recycledNodes) {
            // double swipe on the same item, or re-swipe on a closing item.
            var activeItem = this.findItemByListItem(listItem);
            if (activeItem) {
                this.activeItem = activeItem;
                return;
            }

            this.public.clear();

            var item = SwipeAction.create(actions, listItem, direction, this.orientation, recycledNodes);
            item.subscribe('reset', this.resetItem);
            this.sizeItem(item, listItem, this.orientation);
            this.positionItem(item, listItem, this.orientation, recycledNodes);
            this.insertItem(item);

            this.activeItem = item;

            return item;
        },

        /**
         * Clears active swipe UI, if there is any.
         */
        clear: function() {
            this.items.forEach(this.clearItem);
        },

        /**
         * Returns true if the supplied `listItem` corresponds to the active swipe UI's list item.
         * @param {HTMLElement} listItem The list item to check.
         */
        isActiveItem: function(listItem) {
            if (this.activeItem) {
                return this.activeItem.listItem === listItem;
            }

            return false;
        },

        hasActiveItem: function() {
            return !!this.activeItem;
        },

        swipeStart: function(e) {
            this.swipeDeltaCalculator = swipeDeltaCalculator(this.orientation);
            e.swipeDelta = this.swipeDeltaCalculator(e);
        },

        swipeMove: function(e) {
            if (this.activeItem) {
                this.activeItem.swipeMove(e);
            }

            // Calculate swipe delta regardless of whether or not there is an active item
            // so that you can still track swipe delta on a listitem with no actions.
            e.swipeDelta = this.swipeDeltaCalculator(e);
        },

        swipeEnd: function(e) {
            var open = false;
            if (this.activeItem) {
                open = this.activeItem.swipeEnd(e);
            }
            e.swipeDelta = this.swipeDeltaCalculator(e);
            e.open = open;
        },

        resetDOM: function(listItem) {
            var item = this.findItemByListItem(listItem);
            if (item) {
                this.cleanItem(item);
            }
        },

        resetAll: function() {
            for (var i = this.items.length - 1; i >= 0; i--) {
                this.resetItem(this.items[i]);
            }
            this.items = [];
        }
    },

    private: {
        items: undefined,

        activeItem: undefined,

        cleanItem: function(item) {
            item.resetDOM();
            this.resetItem(item);
        },

        getDimensionProp: function(orientation) {
            return orientation === 'vertical' ? 'height' : 'width';
        },

        getBoundingProp: function(orientation) {
            return orientation === 'vertical' ? 'top' : 'left';
        },

        sizeItem: function(item, listItem, orientation) {
            var dimension = this.getDimensionProp(orientation);
            item.style[dimension] = utils.getElementSize(listItem, dimension) + 'px';
        },

        positionItem: function(item, listItem, orientation, recycleNodes) {
            var transformVal;
            if (!recycleNodes) {
                var listBounds = this.list.getBoundingClientRect();
                var itemBounds = listItem.getBoundingClientRect();
                var boundingProp = this.getBoundingProp(orientation);
                transformVal = itemBounds[boundingProp] - listBounds[boundingProp];
            } else {
                transformVal = listItem.transformVal;
            }

            var translateItem = orientation === 'vertical' ? this.translateItemY : this.translateItemX;
            translateItem(item.style, transformVal);
        },

        translateItemX: function(item, val) {
            item[styles.transform] = 'translate3d(' + (val | 0) + 'px,0,0)';
        },

        translateItemY: function(item, val) {
            item[styles.transform] = 'translate3d(0,' + (val | 0) + 'px,0)';
        },

        insertItem: function(item) {
            this.container.insertBefore(item, this.container.firstChild);
            this.items.push(item);
        },

        clearItem: function(item) {
            item.reset();
        },

        resetItem: function(item) {
            var index = this.items.indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
            }

            if (item === this.activeItem) {
                this.activeItem = undefined;
            }

            this.container.removeChild(item);
            item.unsubscribe('reset', this.resetItem);
            window.elsa.destroy(item);
            if (typeof item.destroy === "function") {
                item.destroy();
            }
        },

        findItemByListItem: function(listItem) {
            var len = this.items.length;
            if (len === 0) {
                return null;
            }

            for (var i = 0; i < len; i++) {
                var item = this.items[i];
                if (item.listItem === listItem) {
                    return item;
                }
            }
            return null;
        }
    },

    init: function(list, container) {
        this.list = list;
        this.container = container;
        this.resetItem = this.resetItem.bind(this);
        this.items = [];
    },

    destroy: function() {
        this.public.resetAll();
        this.list = undefined;
        this.container = undefined;
        this.items = undefined;
        this.activeItem = undefined;
        this.swipeDeltaCalculator = undefined;
    }
});

},{"../../../shared/utils.js":118,"./swipeActions.js":42}],44:[function(require,module,exports){
module.exports = "<ul class=el-list-ul></ul>";

},{}],45:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Angular = window.angular;

module.exports = function() {
    return {
        bind: function(listItem, data, key, index) {
            var $el = Angular.element(listItem);
            $el.scope().$apply(function($scope) {
                // Relies on the listValueIdentifier being set by the
                // angular plugin at list compile time.
                $scope[$scope.listValueIdentifier] = data;

                // TODO: Inject all ng-repeat values?
                // https://docs.angularjs.org/api/ng/directive/ngRepeat
                $scope.$index = index;
            });
        },

        create: function(templateString) {
            var container = document.createElement('div');
            container.innerHTML = templateString;
            return container.firstElementChild;
        },

        initializeDOM: function(list, dom) {
            var $list = Angular.element(list);
            var listScope = $list.scope();
            var listItemScope = listScope.$new();
            listItemScope.listValueIdentifier = listScope.listValueIdentifier;
            var injector = elsa.compiler.plugins.get("angular").controller.injector;
            injector.invoke(function($compile) {
                $compile(dom)(listItemScope);
            });
        },

        parse: function(expression, attribute, dom) {
            // deliberately return null because angular does all the templating work, not render()
            return null;
        },

        render: function(expression, data) {}
    };
};

},{}],46:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var mustacheEngine = require('./mustache.js');
var supportedProperties = ['data-content', 'data-src', 'data-class'];

var wrap = function(expr) {
    return '{{{' + expr + '}}}';
};

module.exports = {

    /**
     * The legacy engine converts from the old data-x style annotations
     * over to using Mustache templates.
     */
    parse: function(expression, attribute, dom) {
        if (attribute && supportedProperties.indexOf(attribute.name) !== -1) {
            if (attribute.name === 'data-content') {
                return {
                    property: '.textContent',
                    value: wrap(attribute.value)
                };
            } else {
                var prop = attribute.name.replace('data-', '');
                var existing = dom.getAttribute(prop);
                if (attribute.name === 'data-class' && existing) {
                    return {
                        property: prop,
                        value: existing + ' ' + wrap(attribute.value)
                    };
                }
                return {
                    property: prop,
                    value: wrap(attribute.value)
                };
            }
        }
        return null;
    },

    render: function(expression, data) {
        return mustacheEngine.render(expression, data);
    }
};

},{"./mustache.js":47}],47:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var expressionRegEx = /\{\{(.*?)\}\}/;
var errStr = "Mustache not found on window. Please load the library via script tag.";

module.exports = {
    parse: function(expression, attribute) {
        if (expressionRegEx.test(expression)) {
            if (!window.Mustache) {
                throw new Error(errStr);
            }
            // Speeds up renders by pre-computing offsets.
            window.Mustache.parse(expression);

            var prop = attribute ? attribute.name : '.textContent';
            return {
                property: prop,
                value: expression
            };
        }
    },

    render: function(expression, data) {
        if (!window.Mustache) {
            throw new Error(errStr);
        }
        return window.Mustache.render(expression, data);
    }
};

},{}],48:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var expressionRegEx = new RegExp("<%.*?%>");
var templateCache = {};

module.exports = {
    parse: function(expression, attribute) {
        if (expressionRegEx.test(expression)) {
            if (!window._) {
                throw new Error("Underscore not found on window. Please load the library via script tag.");
            }

            templateCache[expression] = window._.template(expression);

            var prop = attribute ? attribute.name : '.textContent';
            return {
                property: prop,
                value: expression
            };
        }
    },

    render: function(expression, data) {
        return templateCache[expression](data);
    }
};

},{}],49:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;

var Utils = require('./templaterUtils.js');

var templateTypeRegEx = /data-template-type\s*=\s*['"]([A-Za-z]+)['"]/;

/**
 * Responsible for creating the DOM nodes that the list requires.
 *
 * The templater fulfills four tasks:
 * * `create()`: Creating the template DOM node from a string that is processed by the list
 * and then fed back into `parse()` to be used as the clone source for list items of that type.
 * * `parse()`: Extracting templatable attributes and text nodes from the DOM node created above and saving them for binding.
 * * `fetch()`: Cloning the template DOM node each time the list reqests a new one.
 * * `bind()`: Binding data to the extracted template attributes and text nodes each time a list item is populated.
 */
module.exports = Extend.createType({
    name: 'templater',

    extend: Object,

    public: {
        /**
         * Creates a DOM node from a template string, delegating to the engine
         * if it has a create method. Otherwise it uses Elsa's compiler to create
         * the DOM nodes.
         */
        instantiate: function(template) {
            var templateString = Utils.stringify(template);
            var match = templateTypeRegEx.exec(templateString);
            var engine = this.getEngine(this.getType(match ? match[1] : null));

            var dom = Utils.normalize(templateString, engine.create, this.list);

            // TODO: This is list specific and should be refactored out
            var listItem = document.createElement('li');
            listItem.classList.add('el-list-li');
            listItem.appendChild(dom);
            listItem.templateType = dom.templateType;

            Utils.mapAttributes(dom, listItem);

            return listItem;
        },

        /**
         * Parses and registers a template for future binding.
         * In order to be parsed the supplied template must
         * not be pre-compiled.
         *
         * Returns the DOM element returned by the template. The created
         * DOM is saved and can be retrieved with `fetch()`.
         *
         * @param {string|function} input - Either a string or
         * a template function that reutrns a string. The template
         * must not be pre-compiled.
         */
        parse: function(templateDOM, key) {
            var templateKey = key || templateDOM.templateType;
            var templatedNodes = this.extractTemplatedNodes(this.getEngine(templateDOM), templateDOM);

            this.cachedTemplates[templateKey] = templatedNodes;
            this.cachedTemplateDOM[templateKey] = templateDOM;

            return templateDOM;
        },

        /**
         * Binds data to the DOM. A template that produces the
         * supplied DOM node must have been registered with `parse()`.
         *
         * @param {HTMLElement} dom - An empty DOM node to bind data to.
         * @param {object} data - Data to bind to the DOM.
         * @param {string} key - An optional lookup key that was passed to `parse()`.
         * If no key is provided the outerHTML of the dom node is used.
         * @param {number} index - The index of the data
         */
        bind: function(dom, data, key, index) {
            var engine = this.getEngine(dom);
            if (engine.bind) {
                return engine.bind(dom, data, key, index);
            }

            key = key !== undefined ? key : dom.templateType || dom.outerHTML;
            var templatedNodes = this.cachedTemplates[key];
            if (!templatedNodes) {
                throw new Error('Template must be registered with Templater.parse() first.');
            }
            return this.bindNodes(engine, dom, templatedNodes, data);
        },

        /**
         * Clears templates registered through `parse()`.
         */
        clear: function() {
            this.guid = 0;
            this.engines = {};
            this.cachedTemplates = {};
            this.cachedTemplateDOM = {};
        },

        /**
         * Replaces the key used in `parse()` with a new one.
         * @param {string} A key used with `parse()`
         * @param {string} A new key to use for the template.
         */
        replaceKey: function(oldKey, newKey) {
            this.cachedTemplates[newKey] = this.cachedTemplates[oldKey];
            delete this.cachedTemplates[oldKey];
        },

        /**
         * Fetches a unique, cloned DOM node. Use this to pull nodes
         * to be inserted into the list.
         */
        fetch: function(key) {
            var dom = this.cachedTemplateDOM[key].cloneNode(true);

            // This invokes the angular compiler which encounters errors parsing
            // {{variables}} because they aren't defined anywhere yet.
            // dom = compiler.compile(dom, {}, {
            //     parentControl : this.list,
            //     require : this.require,
            //     sourcepath : this.sourcepath
            // });

            var engine = this.getEngine(dom);
            if (engine.initializeDOM) {
                engine.initializeDOM(this.list, dom);
            }

            // To support elsa controls inside templates the dom tree needs to be parsed.
            // But using intiializeDOMTree mucks with the routes.
            return dom;
        },

        /**
         * Copies cached templates over from the source to target key.
         */
        copyCache: function(sourceKey, targetKey) {
            this.cachedTemplates[targetKey] = this.cachedTemplates[sourceKey];
        }
    },

    private: {
        templateAttribute: 'data-template-guid',

        cachedTemplates: null,

        engines: null,

        guid: 0,

        extractTemplatedNodes: function(engine, dom, nodes) {
            nodes = nodes || {};

            // It's a text node, no attributes for us.
            if (dom.nodeType === 3) {
                var parsed = engine.parse(dom.textContent);
                if (parsed) {
                    if (!dom.parentNode.hasAttribute(this.templateAttribute)) {
                        this.guid += 1;
                        dom.parentNode.setAttribute(this.templateAttribute, this.guid);
                    }
                    this.addProperty(nodes, this.guid, {
                        property: '.textContent',
                        value: parsed.value
                    });
                    return nodes;
                }
            }

            this.extractAttributes(engine, dom, nodes);
            this.extractChildren(engine, dom, nodes);

            return nodes;
        },

        extractChildren: function(engine, dom, nodes) {
            var children = Array.prototype.slice.call(dom.childNodes);
            if (children.length) {
                for (var i = 0; i < children.length; i++) {
                    this.extractTemplatedNodes(engine, children[i], nodes);
                }
            }
        },

        extractAttributes: function(engine, dom, nodes) {
            var attributes = dom.attributes;
            if (attributes) {
                var initialGUID = this.guid;
                for (var i = 0; i < attributes.length; i++) {
                    var attribute = attributes[i];
                    var parsed = engine.parse(attribute.value, attribute, dom);
                    if (parsed) {
                        // Ensure we only increment the GUID once even if there are
                        // multiple templatable attributes on this node.
                        if (this.guid === initialGUID) {
                            this.guid += 1;
                        }
                        dom.setAttribute(this.templateAttribute, this.guid);
                        this.addProperty(nodes, this.guid, parsed);
                    }
                }
            }
        },

        addProperty: function(nodes, id, parsed) {
            nodes[id] = nodes[id] || [];
            nodes[id].push({
                prop: parsed.property,
                value: parsed.value
            });
        },

        bindNodes: function(engine, dom, nodes, data) {
            for (var guid in nodes) {
                var node = dom.getAttribute(this.templateAttribute) === guid.toString() ? dom : dom.querySelector('[' + this.templateAttribute + '="' + guid + '"]');
                var templates = nodes[guid];
                if (node) {
                    this.bindNode(engine, templates, node, data);
                }
            }

            return dom;
        },

        bindNode: function(engine, templates, node, data) {
            for (var i = 0; i < templates.length; i++) {
                var template = templates[i];
                if (template.prop === '.textContent') {
                    node.textContent = engine.render(template.value, data);
                } else {
                    var rendered = engine.render(template.value, data);
                    if (rendered) {
                        node.setAttribute(template.prop, rendered);
                    }
                }
            }
        },

        parseEngine: function(engine) {
            if (typeof(engine) === 'string') {
                if (engine === 'legacy') {
                    return require('./engines/legacy.js');
                } else if (engine === 'mustache') {
                    return require('./engines/mustache.js');
                } else if (engine === 'underscore') {
                    return require('./engines/underscore.js');
                } else if (engine === 'angular') {
                    return require('./engines/angular.js')();
                } else {
                    throw new Error('Invalid template engine');
                }
            }
            return engine || require('./engines/legacy.js');
        },

        /**
         * Returns an engine of the given type.
         */
        getEngine: function(domOrString) {
            var type = this.getType(domOrString);
            if (this.engines[type] === undefined) {
                this.engines[type] = this.parseEngine(type);
            }
            return this.engines[type];
        },

        getType: function(domOrString) {
            var type = typeof(domOrString) === 'string' ? domOrString : (domOrString && domOrString.getAttribute ? domOrString.getAttribute('data-template-type') : null);
            type = type || this.list.templateType;
            type = type || (compiler.templateCompiler ? compiler.templateCompiler.defaultTemplateType : 'legacy');
            return type;
        }
    },

    init: function(params) {
        params = params || {};
        this.engines = {};

        this.public.clear();
        this.sourcepath = params.sourcepath;
        this.require = params.require;
        this.list = params.list || {};
    },

    destroy: function() {
        this.sourcepath = undefined;
        this.require = undefined;
        this.list = undefined;
        this.engines = undefined;
        this.cachedTemplates = undefined;
        this.cachedTemplateDOM = undefined;
    }
});

},{"./engines/angular.js":45,"./engines/legacy.js":46,"./engines/mustache.js":47,"./engines/underscore.js":48,"./templaterUtils.js":50}],50:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = window.elsa.compiler;

var fnDefRegEx = /function\s?\((.*)\)\s?{([\s\S]+.*)}/;

/**
 * Given a template string, converts it to a DOM node.
 * Note the template string should only have one root element.
 *
 * @param {string} str - A DOM string.
 * @param {function} instantiator - An optional function to create DOM from the string.
 * If it isn't provided elsa's compiler will create the DOM.
 */
var stringToDOMElement = function(str, instantiator, list) {
    if (instantiator) {
        return instantiator(str);
    }
    /*var el = document.createElement("div");
    el.innerHTML = str;
    return compiler.precompileTemplate(el);*/
    return compiler.compile(str, list);
};

/**
 * Maps the attributes from the `source` DOM element to
 * the `target` element. Elements with a name of 'type' are ignored.
 */
var mapAttributes = function(source, target) {
    if (!source.hasAttributes()) {
        return target;
    }

    var len = source.attributes.length;
    for (var i = 0; i < len; i++) {
        var attribute = source.attributes[i];
        if (attribute.name.indexOf('data-') === 0) {
            target.setAttribute(attribute.name, attribute.value);
        }
    }

    return target;
};

// Hack to define createTemplateDOM before it's used to satisfy JSHint.
var createTemplateDOM;

/**
 * If the supplied DOM element is a script tag, extracts
 * the DOM string from within it and maps the script tag's
 * attributes on to it.
 */
var extractDOM = function(dom, instantiator, list) {
    if (dom.tagName === 'SCRIPT') {
        var extractedDOM = createTemplateDOM(dom.innerHTML, instantiator, list);
        return mapAttributes(dom, extractedDOM);
    }
    return dom;
};

/**
 * Template can either be a DOM node, a string, a function that returns a dom fragment
 * or a function that returns a string.
 */
var createTemplateDOM = function(template, instantiator, list) {
    // TODO: handle compiler properly here
    template = typeof(template) === 'function' ? template() : template;
    template = typeof(template) === 'string' ? stringToDOMElement(template, instantiator, list) : template;
    template = template instanceof window.DocumentFragment ? template.firstElementChild : template;
    return extractDOM(template, instantiator, list);
};


var createTemplateFromTemplateFunctionString = function(original, body) {
    var res = fnDefRegEx.exec(original);
    var args = [res[1].replace(/\s+/g, '')];
    var Factory = Function.bind.apply(Function, [null].concat(args).concat(body));
    return (new Factory())();
};

var createTemplateStringFromPrecompiledTemplate = function(template) {
    // Reverse engineers an Underscore template from its compiled function version
    // back to the marked up HTML that was used to generate it.
    // Here be dragons.
    var brackets = {};
    var bracketRegExp = /\/(.*?)\(\[\\s\\S\]\+\?\)(.*?)\/g/;

    // Grab the template settings off of underscore if it exists, otherwise assume
    // that the template was compiled with the default settings.
    // TODO: Support configuring these templateSettings via global static if _ doesn't exist.
    var templateSettings = window._ ? window._.templateSettings : {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    for (var i in templateSettings) {
        var bracketRes = bracketRegExp.exec(templateSettings[i]);
        brackets[i] = {
            open: bracketRes[1],
            close: bracketRes[2]
        };
    }

    var templateStr = template.toString();
    var statementRegEx = /=\((.*)\)\)==/;
    var escapedRegEx = /_\.escape\(/;

    // Workaround for a very peculiar bug. Previously this was defined once,
    // with regex literal syntax and only used with exec(). While exec() is *supposed*
    // to be idempotent, if the regex found an escaped tag (<%- ... %>) the next tag
    // would not be found. The behaviour dissapears when you redeclare the regexp each
    // time before you use it.
    var compiledUnderscoreTag = "'\\+[\\s\\S].*[\\s\\S]'";
    var res = new RegExp(compiledUnderscoreTag, 'gm').exec(templateStr);
    while (res) {
        var segment = res[0];
        var statement = statementRegEx.exec(segment);
        if (statement) {
            var bracket = escapedRegEx.test(segment) ? brackets.escape : brackets.interpolate;
            var inject = bracket.open + statementRegEx.exec(segment)[1] + bracket.close;
            templateStr = templateStr.replace(res[0], inject);
        }
        res = new RegExp(compiledUnderscoreTag).exec(templateStr);
    }

    return createTemplateFromTemplateFunctionString(templateStr, fnDefRegEx.exec(templateStr)[2]);
};

/**
 * Given a function or a DOM node, returns the string of that DOM node.
 */
var createTemplateStr = function(template) {
    try {
        template = typeof(template) === 'function' ? template() : template;
    } catch (e) {
        template = createTemplateStringFromPrecompiledTemplate(template);
    }
    template = typeof(template) === 'object' ? template.outerHTML : template;
    return template;
};

module.exports = {
    /**
     * Utility that takes a template function or string and returns
     * the DOM nodes that it produces.
     */
    normalize: function(input, instantiator, list) {
        var templateString = createTemplateStr(input);
        var templateDOM = createTemplateDOM(templateString, instantiator, list);
        templateDOM.templateType = templateString;
        return templateDOM;
    },

    stringify: createTemplateStr,
    mapAttributes: mapAttributes
};

},{}],51:[function(require,module,exports){
/* Copyright (C) 2014 BlackBerry Limited. Proprietary and confidential. */
var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;

compiler.registerElement(require("./draweritem"));
compiler.registerElement(require("./action"));
compiler.registerElement(require("./expandable-action"));
compiler.registerElement(require("./dialog"));
compiler.registerElement(require("./toast"));
compiler.registerElement(require("./tabs/tab.js"));
compiler.registerElement(require("./tabs"));
compiler.registerElement(require("./bar"));
compiler.registerElement(require("./list"));
compiler.registerElement(require("./refresher/"));
compiler.registerElement(require("./activityindicator"));
compiler.registerElement(require("./toggle"));
compiler.registerElement(require("./header"));
compiler.registerElement(require("./overflow-menu"));
compiler.registerElement(require("./common/collection"));


},{"./action":5,"./activityindicator":8,"./bar":10,"./common/collection":12,"./dialog":16,"./draweritem":17,"./expandable-action":21,"./header":22,"./list":37,"./overflow-menu":52,"./refresher/":54,"./tabs":57,"./tabs/tab.js":58,"./toast":61,"./toggle":63}],52:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var transformPolyfill = window.elsa.utils.styles;

var OverlayTouch = require("../../shared/overlayTouch.js");
var events = require('../../shared/events.js');
var template = require("./template.html");
/**
 * Provides a overflow-menu filled with overflowing actions from el-bar. Works by explicitly specifying actions which overflow, as well as el-bar automatically deciding when actions can no longer fit.
 *
 * @class bar.overflow-menu
 * @extends HTMLElement
 * @el service
 *
 * @demo
 * <caption>Overflow menu with 3 explicit actions</caption>
 * <template name="overflow-menu.html">
 * <el-page>
 *      <el-bar>
 *          <el-action data-overflow="true" data-label="Edit" data-iconclass="fa fa-edit"></el-action>
 *          <el-action data-overflow="true" data-label="Copy" data-iconclass="fa fa-copy"></el-action>
 *          <el-action data-overflow="true" data-label="Paste" data-iconclass="fa fa-paste"></el-action>
 *      </el-bar>
 *      <el-page-content>
 *          <p>Click on the overflow button to see the menu in action</p>
 *      </el-page-content>
 * </el-page>
 * </template>
 *
 * @demo
 * <caption>Overflow menu showing automatic overflow of actions that don't fit</caption>
 * <template name="overflow-menu.html">
 * <el-page>
 *      <el-page-content>
 *          <p>Click on the overflow button to see the menu in action</p>
 *      </el-page-content>
 *      <el-bar data-drawerbutton="stack">
 *          <el-action data-label="Edit" data-iconclass="fa fa-edit"></el-action>
 *          <el-action data-label="Copy" data-iconclass="fa fa-copy"></el-action>
 *          <el-action data-label="Paste" data-iconclass="fa fa-paste"></el-action>
 *          <el-action data-label="Edit" data-iconclass="fa fa-edit"></el-action>
 *          <el-action data-label="Copy" data-iconclass="fa fa-copy"></el-action>
 *          <el-action data-label="Paste" data-iconclass="fa fa-paste"></el-action>
 *      </el-bar>
 * </el-page>
 * </template>
 */

/**
 * Fired after the overflow-menu is closed
 * @event bar#close-overflow
 * @type {DOMEvent}
 */

/**
 * Fired when the overflow-menu is opened
 * @event bar#open-overflow
 * @type {DOMEvent}
 */

var stopPropagation = function stopPropagation(e) {
    e.stopPropagation();
};

module.exports = {

    name: "overflow-menu",

    extend: window.HTMLElement,

    "open-overflow": events.createEventType('open-overflow', {
        bubbles: true
    }),

    "close-overflow": events.createEventType('close-overflow', {
        bubbles: true,
        cancelable: true
    }),

    /** @lends bar.overflow-menu# */
    public: {
        /**
         * Open the overflow-menu.
         *
         * @fires bar#open-overflow
         *
         */
        open: function() {
            if (this.opened) {
                return;
            }
            if (this.closedFrameId) {
                window.elsa.App.cancelAnimationFrame(this.closedFrameId);
                this.closedFrameId = undefined;
            }
            var page = this.bar.parentElement;
            if (!page || page.tagName !== "EL-PAGE") {
                console.warn("invalid page", page);
                return;
            }

            var isBottomBar = Array.prototype.slice.call(page.querySelectorAll("el-page > el-page-content ~ el-bar")).indexOf(this.bar) !== -1;
            var clone = this.bar.cloneNode(true);
            var overflowActions;
            if (isBottomBar) {
                overflowActions = clone.querySelectorAll("el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow)");
                this.public.classList.add("origin-bottom");
            } else {
                overflowActions = clone.querySelectorAll("el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow) ~ el-action:not(.el-action-placement-overflow)");
                this.public.classList.remove("origin-bottom");
            }
            overflowActions = Array.prototype.slice.call(overflowActions);
            var cursor = 0;
            for (var el = clone.firstElementChild; el; el = clone.firstElementChild) {
                if (el && el.tagName === "EL-ACTION" && (el.classList.contains("el-action-placement-overflow") || overflowActions.indexOf(el) !== -1)) {
                    Object.defineProperty(el, "__originalAction", {
                        value: this.bar.children[cursor]
                    });
                    el.classList.add("horizontal");
                    this.container.appendChild(el);
                } else {
                    clone.removeChild(el);
                }
                cursor++;
            }

            page.appendChild(this.public);
            var self = this;
            window.elsa.App.requestAnimationFrame(self, function() {
                // now public has been inserted into the
                window.elsa.App.requestAnimationFrame(self, function() {
                    window.elsa.App.scene.classList.add("fade-in");
                    self.public.classList.add("fade-in");
                    self.overlayTouch.enableOverlayTouch(window.elsa.App.scene, this.container);
                });
                self.public.classList.add("open");
                window.elsa.App.scene.classList.add("el-overlay");
            });

            var event = module.exports['open-overflow']();
            this.bar.dispatchEvent(event);
            this.opened = true;
        },
        /**
         * Close the overflow-menu. Optionally, pass in data, which is proxied to the event
         *
         * @fires bar#close-overflow
         */
        close: function(result) {
            if (!this.opened) {
                return;
            }
            var event = module.exports['close-overflow']({
                result: result
            });
            this.overlayTouch.disableOverlayTouch(window.elsa.App.scene);
            this.public.addEventListener(transformPolyfill.transitionend, this.closed);
            this.public.classList.remove("fade-in");
            window.elsa.App.scene.classList.remove("fade-in");
            this.bar.dispatchEvent(event);
            this.opened = false;
        }
    },

    private: {

        lock: true,

        closed: function(e) {
            if (e.propertyName === "opacity") {
                return false;
            }
            this.public.removeEventListener(transformPolyfill.transitionend, this.closed);

            this.closedFrameId = window.elsa.App.requestAnimationFrame(this, function() {
                this.closedFrameId = undefined;
                this.public.parentNode.removeChild(this.public);
                this.container.innerHTML = "";
            });
            window.elsa.App.scene.classList.remove("el-overlay");
            this.public.classList.remove("open");
        }

    },

    protected: {

        trigger: function(e) {
            if (e.target.__originalAction) {
                var event = events.trigger({
                    action: e.target.__originalAction,
                    cancelable: true
                });
                e.target.__originalAction.dispatchEvent(event);
                this.public.close();
            }
        }

    },

    init: function(params) {
        this.bar = params.bar;
        this.closed = this.closed.bind(this);
        this.overlayTouch = new OverlayTouch(undefined, function() {
            this.public.close();
        }.bind(this), function(e) {
            this.protected.trigger(e);
        }.bind(this));

        this.public.innerHTML = template;
        this.container = this.public.querySelector(".el-overflow-menu-container");
    },

    destroy: function() {
        this.bar = undefined;
        this.overlayTouch = this.overlayTouch.destroy();
        window.elsa.App.cancelAnimationFrame(this);
        this.public.removeEventListener(transformPolyfill.transitionend, this.closed);
        this.closed = undefined;
        this.container = undefined;
    }

};

},{"../../shared/events.js":115,"../../shared/overlayTouch.js":117,"./template.html":53}],53:[function(require,module,exports){
module.exports = "<div class=el-overflow-menu-positioner-left></div><div class=el-overflow-menu-wrapper><div class=el-overflow-menu-container></div></div><div class=el-overflow-menu-positioner-right></div>";

},{}],54:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var styles = window.elsa.utils.styles;

var template = require("./template.html");
var PullDetector = require("./pullGestureDetector.js");
var OverscrollAnimator = require("../list/animation/overscrollAnimator.js");
var templateUtils = require('../list/templates/templaterUtils.js');
var utils = require('../../shared/utils.js');
var events = require('../../shared/events.js');

var partial = function(fn, ctx) {
    var aps = Array.prototype.slice;
    var args = aps.call(arguments, 2);
    return function() {
        return fn.apply(ctx, args.concat(aps.call(arguments)));
    };
};

var Events = {
    PULLING: 'pull',
    REFRESH: 'refresh'
};

module.exports = {
    /**
     * Dispatched when a pull has begun on the target container.
     *
     * A pull begins when user scrolls the container past its uppermost boundary.
     *
     * @event refresher#pull
     * @type {DOMEvent}
     */

    /**
     * Dispatched when the user releases a pull and they have pulled more than 3/4ths the height of the refresher.
     *
     * Use `preventDefault()` on this event to keep the refresher in the open position. Then, when data has loaded
     * call `refresher.close()` to hide the refresher.
     *
     * @event refresher#refresh
     * @type {DOMEvent}
     */

    /**
     * The Refresher control adds pull to refresh functionality to a container placed within it.
     *
     * By dragging the content area down, the user reveals the pull to refresh UI. `pull` and
     * `refresh` events are emitted to indicate when to refresh.
     *
     * Custom pull to refresh UI can be used by including a `script` tag with type `text/template`
     * inside the refresher tag. The contents of the script tag are instantiated and used as the
     * refresher interface.
     *
     * @el control
     * <el-refresher></el-refresher>
     * @example
     * <!-- A refresher with custom ui -->
     * <el-refresher>
     *     <script type="text/template">
     *         <h1>Custom Loader UI</h1>
     *     </script>
     *     <div style="background: blue; height: 1200px;">Content</div>
     * </el-refresher>
     * @fires refresher#refresh
     * @fires refresher#pull
     * @class refresher
     * @extends HTMLElement
     *
     * @demo backbone
     * <caption>A refresher with a simple list inside of it</caption>
     * <template name="refresher.html">
     * <el-page data-controller="backbone:./refresher.js">
     *     <el-page-content>
     *         <el-refresher>
     *             <el-list>
     *             </el-list>
     *         </el-refresher>
     *     </el-page-content>
     * </el-page>
     * </template>
     *
     * <template name="refresher.js">
     * module.exports = Backbone.View.extend({
     *     events: {
     *         "refresh el-refresher": "fetchMore"
     *     },
     *     initialize: function() {
     *         this.refresher = this.el.querySelector("el-refresher");
     *         this.list = this.el.querySelector("el-list");
     *         this.collection = [this.createItem(1)];
     *         this.list.collection = this.collection;
     *     },
     *     fetchMore: function(event) {
     *         // Keep the refresher from closing right away
     *         event.preventDefault();
     *         // Wait 1 second to simulate loading data
     *         var self = this;
     *         setTimeout(function() {
     *             var loadedItem = self.createItem(self.collection.length + 1);
     *             self.collection.push(loadedItem);
     *             self.list.collection = self.collection;
     *             // Now close the refresher
     *             self.refresher.close();
     *         }, 1000);
     *     },
     *     createItem: function(i) {
     *         return {
     *             title: 'Item ' + i
     *         };
     *     }
     * });
     * </template>
     */
    name: "refresher",

    extend: HTMLElement,

    Events: {
        writable: false,
        value: Events
    },

    pull: events.createEventType('pull', {
        bubbles: true,
        cancelable: true
    }),

    refresh: events.createEventType('refresh', {
        bubbles: true,
        cancelable: true
    }),

    /** @lends refresher# */
    public: {

        /**
         * Closes the refresher if it is open.
         *
         * Use `preventDefault()` on the `refresh` event to keep the refresher open, and once
         * data is loaded call `close()` to hide the refresher.
         */
        close: function() {
            this.animateTo(0);
        }
    },

    private: {
        loaderClass: 'refresher-loader',

        pullTargetClass: 'pull-target',

        visibleClass: 'visible',

        /**
         * Handles touch moves.
         *
         * If a drag goes back in to the containers scrollable area
         * the scroll hijacking done here is relinquished and the container resumes scrolling.
         */
        onTouchMove: function(e) {
            var scrollPositionAtTop = false;

            if (this.refreshUI.nextElementSibling) {
                this.configurePullTarget(this.refreshUI.nextElementSibling);
            }

            if (this.pullTarget && this.pullTarget.tagName === 'EL-LIST') {
                scrollPositionAtTop = this.pullTarget.isScrollPositionAtTop();
            } else {
                scrollPositionAtTop = this.pageContentEl.scrollTop <= 0;
            }

            if (scrollPositionAtTop && !this.pulling) {
                this.startPull(e);

            } else if (this.delta < 0 && this.pulling) {
                this.releasePull(false);
                this.translate(0);

            } else if (scrollPositionAtTop && this.pulling) {
                e.preventDefault();
                this.currentY = e.touches[0].pageY;
                this.delta = this.currentY - this.startY;
            }
        },

        /**
         * Handles touch end.
         *
         * If the refresher has been dragged open it is either opened fully or closed depending
         * on how much it has been dragged.
         */
        onTouchEnd: function() {
            this.releasePull(true);
        },

        /**
         * Starts the pull by configuring touch events.
         */
        startPull: function(e) {
            this.pulling = true;
            this.animateClosed = true;
            this.pullValue = this.delta = 0;
            this.startY = this.currentY = e.touches[0].pageY;

            document.body.addEventListener('touchend', this.boundTouchEnd);

            if (this.pullTarget) {
                this.size = utils.getElementSize(this.refreshUI, 'height'); // TODO: Support other orientations?
                this.overscrollAnimator.maxOverscroll = this.pullDetector.maxOverscroll = this.size;

                this.refreshUI.classList.add(this.visibleClass);

                this.pullAnimationId = window.requestAnimationFrame(this.boundPull);
            }
        },

        /**
         * Configures & sets the pull target by decorating it with css and setting scrollable css
         * properties on its parent if need be.
         */
        configurePullTarget: function(target) {
            target.classList.add(this.pullTargetClass);
            this.disablePageOverflow();

            this.pullTarget = target;

            if (this.pullTarget.tagName === 'EL-LIST') {
                this.pullTarget.overscrollEnabled = false;
            }
        },

        /**
         * Animates the ui to the users touch while their finger is down. Runs each tick unless
         * cancelled explicitly or the pullValue becomes 0.
         */
        pull: function(e) {
            this.pullValue = this.overscrollAnimator.dragOverscroll((this.currentY - this.startY) * 0.5);
            this.pullDetector.track(this.pullValue);

            if (this.pullValue >= 0) {
                this.translate(this.pullValue);
                this.pullAnimationId = window.requestAnimationFrame(this.boundPull);
            }
        },

        /**
         * Yeilds control back to the browser for scrolling.
         * @param {boolean} pullComplete - If the pull is complete (i.e. the finger has been released)
         * then the refresher will animate closed.
         */
        releasePull: function(pullComplete) {
            window.cancelAnimationFrame(this.pullAnimationId);
            document.body.removeEventListener('touchend', this.boundTouchEnd);

            // If we've pulled a non-zero number of pixels, notify.
            if (this.pulling && this.pullValue !== 0 && pullComplete) {
                this.pullDetector.end();
            }

            this.pulling = false;
        },

        /**
         * Animates the refresher to the open position.
         */
        open: function() {
            this.animateTo(this.size);
        },

        /**
         * Apply the pull to the target and the pull UI itself. Do it all again
         * next tick if the animation isn't complete.
         */
        animate: function(timestamp) {
            this.pullValue = this.overscrollAnimator.tick(timestamp);
            this.translate(this.pullValue);

            if (!this.overscrollAnimator.complete) {
                this.resetAnimationId = window.requestAnimationFrame(this.boundAnimate);
            }
        },

        /**
         * Animates the refresher to the target value.
         */
        animateTo: function(target) {
            if (this.overscrollAnimator.configureResetScroll(target, this.pullValue)) {
                this.resetAnimationId = window.requestAnimationFrame(this.boundAnimate);
            }
        },

        /**
         * Fires a `refresh` event if the user has pulled far enough.
         */
        onPullReleased: function() {
            if (this.pullDetector.state === PullDetector.States.PULLED) {
                if (this.forwardEvent(Events.REFRESH)) {
                    this.public.close();
                } else {
                    this.open();
                }
            } else {
                this.public.close();
            }
        },

        /**
         * Dispatches an event of the supplied type and with the supplie details. The event
         * will always bubble.
         */
        forwardEvent: function(type, detail) {
            var event = module.exports[type](detail);
            return this.public.dispatchEvent(event);
        },

        /**
         * Translates the refresher to the target value immediately.
         */
        translate: function(val) {
            val = val | 0;

            this.translateItemY(this.pullTarget.style, val);
            this.translateItemY(this.refreshUI.style, val - this.size);
        },

        translateItemY: function(item, val) {
            item[styles.transform] = 'translateY(' + val + 'px)';
        },

        /**
         * We need to remove -webkit-overflow-scrolling on relevent platforms otherwise
         * we get overflow scrolling on the parent container.
         */
        disablePageOverflow: function() {
            this.pageContentEl.style['-webkit-overflow-scrolling'] = 'auto';
        },

        /**
         * Creates the loader UI. If a script tag exists inside the refresher it is taken as the custom
         * loader UI, otherwise the default is used.
         */
        createRefresherUI: function() {
            var customLoaderUITemplate = this.public.querySelector('script[type="text/template"]');
            if (customLoaderUITemplate) {
                customLoaderUITemplate.parentNode.removeChild(customLoaderUITemplate);
                var customUI = templateUtils.normalize(customLoaderUITemplate);
                customUI.classList.add(this.loaderClass);
                return customUI;
            } else {
                return compiler.compile(template, this.parentControl).firstElementChild;
            }
        }
    },

    init: function(params) {
        this.parentControl = params.parentControl;
        this.refreshUI = this.createRefresherUI();

        // Get page content ancestor
        var ancestor = this.public;
        while (ancestor && ancestor.tagName !== 'EL-PAGE-CONTENT') {
            ancestor = ancestor.parentNode;
        }
        this.pageContentEl = ancestor;

        this.public.insertBefore(this.refreshUI, this.public.firstChild);

        this.boundTouchMove = this.onTouchMove.bind(this);
        this.boundTouchEnd = this.onTouchEnd.bind(this);
        this.boundPull = this.pull.bind(this);
        this.boundAnimate = this.animate.bind(this);

        this.overscrollAnimator = OverscrollAnimator.create();

        this.boundProcessPullStartEvent = partial(this.forwardEvent, this, Events.PULLING);
        this.boundProcessPullReleasedEvent = partial(this.onPullReleased, this, Events.REFRESH);

        this.pullDetector = PullDetector.create();
        this.pullDetector.subscribe(PullDetector.Events.START, this.boundProcessPullStartEvent);
        this.pullDetector.subscribe(PullDetector.Events.RELEASED, this.boundProcessPullReleasedEvent);

        document.body.addEventListener('touchmove', this.boundTouchMove);
    },

    destroy: function() {
        this.pullDetector.unsubscribe(PullDetector.Events.START, this.boundProcessPullStartEvent);
        this.pullDetector.unsubscribe(PullDetector.Events.RELEASED, this.boundProcessPullReleasedEvent);

        document.body.removeEventListener('touchmove', this.boundTouchMove);
        document.body.removeEventListener('touchend', this.boundTouchEnd);

        window.cancelAnimationFrame(this.pullAnimationId);
        window.cancelAnimationFrame(this.resetAnimationId);

        this.boundTouchMove = undefined;
        this.boundTouchEnd = undefined;
        this.boundPull = undefined;
        this.pageContentEl = undefined;

        this.boundProcessPullStartEvent = undefined;
        this.boundProcessPullPulledEvent = undefined;
        this.boundProcessPullReleasedEvent = undefined;
        this.boundProcessPullingEvent = undefined;

        this.overscrollAnimator.destroy();
        this.overscrollAnimator = undefined;

        this.pullDetector.destroy();
        this.pullDetector = undefined;

        this.refreshUI = undefined;
        this.pullTarget = undefined;
        this.parentControl = undefined;
        this.pageContentEl = undefined;
    }
};

},{"../../shared/events.js":115,"../../shared/utils.js":118,"../list/animation/overscrollAnimator.js":29,"../list/templates/templaterUtils.js":50,"./pullGestureDetector.js":55,"./template.html":56}],55:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var GestureState = {
    IDLE: 'idle',
    DETECTING: 'detecting',
    PULLED: 'pulled'
};

var Events = {
    START: 'start',
    PULLING: 'pulling',
    PULLED: 'pulled',
    RELEASED: 'released'
};

module.exports = Extend.createType({
    name: 'PullGestureDetector',

    Events: {
        writable: false,
        value: Events
    },

    States: {
        writable: false,
        value: GestureState
    },

    public: {
        maxOverscroll: 0,

        state: {
            writable: false,
            value: GestureState.IDLE
        },

        track: function(overscrollAmt) {
            // If you pull 3/4ths of the way, you're refreshing.
            if (overscrollAmt >= this.maxOverscroll * 0.75) {
                this.state = GestureState.PULLED;

            } else if (overscrollAmt > 0 && this.state === GestureState.IDLE) {
                this.state = GestureState.DETECTING;
                this.protected.publish(Events.START);

            } else if (overscrollAmt > 0) {
                this.state = GestureState.DETECTING;

            }
        },

        end: function() {
            this.protected.publish(Events.RELEASED);
            this.state = GestureState.IDLE;
        }
    },

    private: {
        state: null
    },

    init: function() {
        this.state = GestureState.IDLE;
    }
});

},{}],56:[function(require,module,exports){
module.exports = "<el-activityindicator class=\"pull-activity-indicator small refresher-loader\"></el-activityindicator>";

},{}],57:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var typeregistry = window.elsa;

var FastTouch = require('../common/fastTouch.js');
var utils = require("../../shared/utils");
var styles = require('../../core/polyfill/styles.js');
var SwipeAction = require('../list/swipe/swipeActions.js');
var SwipeGestureDetector = require('../list/gestures/swipeGestureDetector.js');
var RailDetector = require('../list/gestures/railDetector.js');
var Events = {
    SWIPE_START : 'swipestart',
    SWIPE_MOVE : 'swipemove',
    SWIPE_END : 'swipeend'
};

function createNavItem(el) {
    var navItem = document.createElement("div");
    navItem.classList.add("el-tabs-nav-item");
    var label = document.createElement("div");
    label.classList.add("el-tabs-nav-item-label");
    label.textContent = el.label ? el.label : el.getAttribute("data-label");
    navItem.appendChild(label);
    return navItem;
}

function first(arr, predicate) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return arr[i];
        }
    }
}

function partial(fn, ctx) {
    var aps = Array.prototype.slice;
    var args = aps.call(arguments, 2);
    return function() {
        return fn.apply(ctx, args.concat(aps.call(arguments)));
    };
}

// TODO: support custom selectors inplace of trailng *
var querySelectorItems = 'el-tabs > nav > *, el-tabs > :not(.el-tabs-content) nav > *';
var querySelectorTab = "el-tabs > .el-tabs-content > el-tab";

module.exports = {

    /**
     * Provides a tabbed element that can hold multiple {@link tab tabs}
     * @el control
     * <el-tabs>
     *      <el-tab></el-tab>
     * <el-tabs>
     * @class tabs
     * @extends HTMLElement
     *
     * @demo
     * <template name="tabs.html">
     * <el-page>
     *      <el-page-content>
     *          <el-tabs>
     *              <el-tab data-label="Artists">
     *                  <p>List of songs by Artist</p>
     *              </el-tab>
     *              <el-tab data-label="Albums">
     *                  <p>List of songs by Album</p>
     *              </el-tab>
     *              <el-tab data-label="Genres">
     *                  <p>List of songs by Genre</p>
     *              </el-tab>
     *          </el-tabs>
     *      </el-page-content>
     *  </el-page>
     * </template>
     */

    name: "tabs",

    extend: HTMLElement,

    /** @lends tabs# */
    public: {
        /** getter for individual tabs inside the tabs control */
        tabs: {
            get: function() {
                return this.contentEl.children;
            }
        },
        /** getter for number of tabs */
        count: {
            get: function() {
                return this.contentEl.childElementCount;
            }
        },
        /** append new tab
         *@param {tab} tab tab to be appended to tabs
         */
        appendChild: function(child) {
            var index = this.contentEl.children.length;
            this.contentEl.appendChild(child);
            this.nav.appendChild(createNavItem(child));
            this.protected.publishChange('add', index);
            if (index === 0) {
                this.setActiveTab(child, false, true);
            }
        },
        /** remove tab
         *@param {tab} tab tab to be removed to tabs
         */
        removeChild: function(child) {
            var index = Array.prototype.indexOf.call(this.contentEl.children, child);
            this.contentEl.removeChild(child);
            this.nav.removeChild(this.nav.children[index]);
            if (child === this.activeTab) {
                this.setActiveTab(child.previousElementSibling || child.nextElementSibling, false, true);
            }
            this.protected.publishChange('remove', index);
        },
        /** replace tab
         *@param {tab} newTab new tab
         *@param {tab} oldTab old tab
         */
        replaceChild: function(newChild, oldChild) {
            var index = Array.prototype.indexOf.call(this.contentEl.children, oldChild);
            var oldNavItem = this.nav.children[index];
            if (this.activeTab === oldChild) {
                newChild.classList.add("active-item");
            }
            this.contentEl.replaceChild(newChild, oldChild);
            this.nav.replaceChild(createNavItem(newChild), oldNavItem);
            this.protected.publishChange('update', index);
        },
        /** insertBefore tab
         *@param {tab} newTab new tab
         *@param {tab} refTab reference tab
         */
        insertBefore: function(newChild, refChild) {
            if (!refChild) {
                return this.public.appendChild(newChild);
            }
            var index = Array.prototype.indexOf.call(this.contentEl.children, refChild);
            this.contentEl.insertBefore(newChild, refChild);
            this.nav.insertBefore(createNavItem(newChild), this.nav.children[index]);
            this.protected.publishChange('add', index);
        },
        /** subscribe to events on tabs control
         *@param {string} name
         *@param {function} callback
         */
        subscribe: function(name, callback) {
            // TODO: ensure we destroy these if unsubscribe is not called
            this.public.addEventListener(name, callback);
        },
        /** unsubscribe to events on tabs control
         *@param {string} name
         *@param {function} callback
         */
        unsubscribe: function(name, callback) {
            this.public.removeEventListener(name, callback);
        },
        /** subscribe to events on tabs control
         *@param {tab} activeTab
         */
        activeTab: {
            set: function(activeTab) {
                this.setActiveTab(activeTab, false, true);
            }
        }
    },

    private: {
        getActiveTabIndex: function(activeTab) {
            var tabs = Array.prototype.slice.call(this.contentEl.children);
            return tabs.indexOf(activeTab);
        },
        setActiveTab: function(activeTab, silent, animate) {
            var activeIndex = this.getActiveTabIndex(activeTab),
                activeNavItem = this.nav.children[activeIndex],
                self = this;

            //Activate new tab nav right away
            this.deActivateNav(self.activeNavItem);
            this.activateNav(activeNavItem);

            var setTab = function() {
                if (animate && !self.isFixedPages) {
                    if ((self.activeTab && self.activeTab !== activeTab)) {//not already on this tab
                        self.translate(activeTab, self.activeTab);
                    }
                }

                if (animate && !self.transitioning) {
                    //activate/deactivate tabs if not transitioning, otherwise wait
                    self.deactivateTab(self.activeTab, self.activeNavItem);
                    self.activateTab(activeTab, activeNavItem);

                    //If this is the first tab opened, update transform here
                    //since we don't animate the first tab
                    if (self.activeTab === undefined) {
                        self.resetTransformVal(activeTab);
                    }
                }

                self.prevActiveTab = self.activeTab;
                self.prevActiveNavItem = self.activeNavItem;
                self.activeTab = activeTab;
                self.activeNavItem = activeNavItem;
                self.protected.publishChange("active", activeIndex);

                if (!self.silent && self.page) {
                    var tabRoute = activeTab ? activeTab.stateid : null;
                    self.page.updateState({
                        "tab": tabRoute
                    });
                }
            };

            //If fixed pages, no need to requestAnimationFrame
            if (this.isFixedPages) {
                setTab();
            } else {
                this.setTabAnimationId = window.elsa.App.requestAnimationFrame(this, setTab);
            }

        },

        setTransformVal: function(activeTab, transformVal, animate) {
            activeTab.parentElement.transformValX = transformVal;
            activeTab.parentElement.style[styles.transform] = "translate(" + transformVal + "px)";
            activeTab.parentElement.style.transitionDuration = (animate ? "0.5s" : "0s");
        },

        resetTransformVal: function(tab) {
            var activeTab = tab || this.activeTab;
            if (this.getActiveTabIndex(activeTab) !== 0) {
                //All tab positions except for the first default to middle selection
                this.setTransformVal(activeTab, -(activeTab.parentElement.clientWidth * 1), false);
            }
        },

        transitionEndCb: function() {
            this.deactivateTab(this.prevActiveTab, this.prevActiveNavItem);
            this.activateTab(this.activeTab, this.activeNavItem);
            this.resetTransformVal();
            this.transitioning = false;
        },

        translate: function(activeTab, prevActiveTab) {
            var self = this,
                activeIndex = this.getActiveTabIndex(activeTab),
                activeNavItem = this.nav.children[activeIndex],
                prevActiveIndex = this.getActiveTabIndex(prevActiveTab);

            this.transitioning = true;

            if(Math.abs(prevActiveIndex - activeIndex) > 1) {
                //simulate a jumpto transition, activate new tab right away
                var tabs = Array.prototype.slice.call(this.contentEl.children);
                tabs[prevActiveIndex + (activeIndex > prevActiveIndex ? 1 : -1)].classList.remove('active-item');
                activeTab.classList.add('active-item');
            }

            if (prevActiveIndex === 0) {
                //forward transition only option available
                this.setTransformVal(activeTab, -(activeTab.parentElement.clientWidth * 1), true);
            } else if (activeIndex > prevActiveIndex) {
                //forward transition
                this.setTransformVal(activeTab, -(activeTab.parentElement.clientWidth * 2), true);
            } else {
                //back transition
                this.setTransformVal(activeTab, 0, true);
            }
        },

        activateTab: function(tab, navItem) {
            if (tab) {
                tab.classList.add('active-item');
                if (!this.isFixedPages) {
                    //for performance purposes, only make neighboring tabs active
                    var tabs = Array.prototype.slice.call(this.contentEl.children);
                    var activeIndex = tabs.indexOf(tab);

                    if (tabs[activeIndex - 1]) {
                        tabs[activeIndex - 1].classList.add('active-item');
                    }
                    if (tabs[activeIndex + 1]) {
                        tabs[activeIndex + 1].classList.add('active-item');
                    }
                }
                this.activateNav(navItem);
            }
        },

        activateNav: function(navItem) {
            if (navItem) {
                navItem.classList.add('active-item');
            }
        },

        deActivateNav: function(navItem) {
            if (navItem) {
                navItem.classList.remove('active-item');
            }
        },

        deactivateTab: function(tab, navItem) {
            if (tab) {
                tab.classList.remove('active-item');
                if (!this.isFixedPages) {
                    var tabs = Array.prototype.slice.call(this.contentEl.children);
                    var activeIndex = tabs.indexOf(tab);

                    if (tabs[activeIndex - 1]) {
                        tabs[activeIndex - 1].classList.remove('active-item');
                    }
                    if (tabs[activeIndex + 1]) {
                        tabs[activeIndex + 1].classList.remove('active-item');
                    }
                }
                this.deActivateNav(navItem);
            }
        },

        resolveTab: function(tabroute) {
            var resolvedTab, tabs, index;
            tabs = this.public.querySelectorAll(querySelectorTab);
            if (tabroute) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].stateid === tabroute) {
                        resolvedTab = tabs[i];
                    }
                }
                if (!resolvedTab) {
                    resolvedTab = tabs[0];
                }
            } else {
                resolvedTab = tabs[0];
            }
            return resolvedTab;
        },

        configureRouting: function() {
            if (this.page) {
                this.boundPageStateChanged = this.onPageStateChanged.bind(this);
                this.page.addEventListener("statechange", this.boundPageStateChanged);
            } else if (this.contentEl.firstElementChild) {
                this.setActiveTab(this.contentEl.firstElementChild, false, true);
            }
        },

        onNavClicked: function(nav, event) {
            var target = event.target;
            if (target === nav || this.transitioning) {
                return;
            }

            var idx = Array.prototype.slice.call(this.nav.children).indexOf(target);
            var tab = this.contentEl.children[idx];
            if (tab) {
                this.setActiveTab(tab, false, true);
            }
        },

        onPageStateChanged: function(e) {
            var tabroute = e.state.tab;
            var tab = this.resolveTab(tabroute);
            if (tab !== this.activeTab) {
                if (this.public.constructor.debug) {
                    console.log("tab.state.changed (from parent page):", tabroute);
                }
                this.setActiveTab(tab || this.contentEl.firstElementChild, true, true);
            }
            e.state.tab = this.activeTab ? this.activeTab.stateid : null;
        },

        onActive: function(e) {
            var tab = e.target;
            if (tab.classList.contains("el-tabs-nav-item-label")) {
                tab = tab.parentElement;
            }
            if (tab.classList.contains('el-tabs-nav-item')) {
                tab.classList.add("pressed");
            }
        },

        onInactive: function(e) {
            var tab = e.target;
            if (tab.classList.contains("el-tabs-nav-item-label")) {
                tab = tab.parentElement;
            }
            if (tab.classList.contains('el-tabs-nav-item')) {
                tab.classList.remove("pressed");
            }
        },

        processSwipeStartEvent: function(type, detail) {
            this.swipeAction = SwipeAction.create(undefined, this.activeTab.parentElement, detail.direction, 'vertical', false);
        },

        processSwipeMoveEvent: function(type, detail) {
            this.swipeAction.swipeMove(detail.originalEvent);
            this.processSwipeEvent(type, detail);
        },

        processSwipeEndEvent: function(type, detail) {
            var result = this.swipeAction.swipeEnd(detail.originalEvent);

            //if swipe wasn't reset update active tab based on swipe direction
            if (result !== -1) {
                this.transitioning = true;
                var prevIdx = Array.prototype.slice.call(this.nav.children).indexOf(this.activeNavItem),
                    newIdx = prevIdx - detail.direction,
                    tab = this.contentEl.children[newIdx];
                if (tab) {
                    this.setActiveTab(tab, false, false);
                }
            }

            this.processSwipeEvent(type, detail);
        },

        /**
         * Takes the simple data passed back from the `SwipeGestureDetector` and transforms
         * it into data that can be broadcast to the world.
         */
        processSwipeEvent: function(type, detail) {
            if(this.dispatchSwipeEvents) {
                detail.target = this.swipeTarget;
                detail.index = this.index;

                if(!this.forwardEvent(type, detail)) {
                    this.swipeDetector.cancel();
                }
            }
        },

        onTouchStart: function(e) {
            this.tabItemTouchStart(e);
        },
/**
         * Handles drag start by configuring scrolling variables.
         * @param {object} event - Scroll event
         * @param {object} tabItem - The tab item that was touched
         */
        tabItemTouchStart: function(event, tabItem) {
            if (this.transitioning) {
                return;
            }

            var touchInfo = {trackingID: -1, maxDy: 0, maxDx: 0};

            //Setup touchInfo to calculate velocity
            if (event.type === 'touchstart') {
                touchInfo.trackingID = event.changedTouches[0].identifier;
                touchInfo.x = event.changedTouches[0].pageX;
                touchInfo.y = event.changedTouches[0].pageY;
            } else {
                touchInfo.trackingID = 'mouse';
                touchInfo.x = event.screenX;
                touchInfo.y = event.screenY;
            }
            touchInfo.maxDx = 0;
            touchInfo.maxDy = 0;
            touchInfo.historyX = [0];
            touchInfo.historyY = [0];
            touchInfo.historyTime = [event.timeStamp];

            this.findDelta = function(e) {
                if (e.type === 'touchmove' || e.type === 'touchend') {
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === touchInfo.trackingID) {
                            return {x: e.changedTouches[i].pageX - touchInfo.x, y: e.changedTouches[i].pageY - touchInfo.y};
                        }
                    }
                } else {
                    return {x: e.screenX - touchInfo.x, y: e.screenY - touchInfo.y};
                }
                return null;
            };

            var _this = this;
            var evtPointer = {e : event};
            this.onTabItemTouchMove = function(e) {
                // Lock the movement on to rails if applicable.
                _this.railDetector.track(e);

                if (_this.railDetector.horizontalRailState === RailDetector.States.ON_RAIL) {
                    //User is swiping, prevent browser from scrolling
                    e.preventDefault();
                } else {
                    return;
                }

                //Update touchInfo for velocity calculation
                var delta = _this.findDelta(e);
                if (!delta) {return;}

                touchInfo.maxDy = Math.max(touchInfo.maxDy, Math.abs(delta.y));
                touchInfo.maxDx = Math.max(touchInfo.maxDx, Math.abs(delta.x));

                touchInfo.historyX.push(delta.x);
                touchInfo.historyY.push(delta.y);
                touchInfo.historyTime.push(e.timeStamp);
                while (touchInfo.historyTime.length > 10) {
                    touchInfo.historyTime.shift();
                    touchInfo.historyX.shift();
                    touchInfo.historyY.shift();
                }


                // Throttle the touch move so that we only process one event a frame. By maintaining
                // a reference to the last event we can avoid requesting a new animation frame and creating
                // an anonymous function for each touch move event.
                evtPointer.e = e;

            };

            this.onTabItemTouchEnd = function(e) {
                var delta = _this.findDelta(e);
                if (!delta) {return;}

                // Walk backwards until we find a sample that's 30ms away from our initial sample.
                // If the samples are too distant (nothing between 30 and 50ms away then blow it off
                // and declare zero velocity. Same if there are no samples.
                var sampleCount = touchInfo.historyTime.length;
                var velocity = {x: 0, y: 0};
                if (sampleCount > 2) {
                    var idx = touchInfo.historyTime.length - 1;
                    var lastTime = touchInfo.historyTime[idx];
                    var lastX = touchInfo.historyX[idx];
                    var lastY = touchInfo.historyY[idx];
                    var found = false;
                    while (idx > 0) {
                        idx--;
                        var t = touchInfo.historyTime[idx];
                        var dt = lastTime - t;
                        if (dt > 30 && dt < 50) {
                            // Ok, go with this one.
                            velocity.x = (lastX - touchInfo.historyX[idx]) / (dt / 1000);
                            velocity.y = (lastY - touchInfo.historyY[idx]) / (dt / 1000);
                            break;
                        }
                    }
                }
                touchInfo.historyTime = [];
                touchInfo.historyX = [];
                touchInfo.historyY = [];

                //store velocity in event
                e.velocity = velocity;

                if (Object.getPrototypeOf(_this.public).constructor.debug > 1) {
                    console.log("tab.events.touchend");
                }

                window.elsa.App.cancelAnimationFrame(_this.touchMoveAnimationId);
                _this.scrolling = false;
                _this.tabItemTouchEnd(e, tabItem);
            };

            //set transition to 0s while moving for smoother swiping
            this.activeTab.parentElement.style.transitionDuration = "0s";

            document.body.addEventListener("touchend", this.onTabItemTouchEnd);
            document.body.addEventListener("touchcancel", this.onTabItemTouchEnd);
            document.body.addEventListener("touchmove", this.onTabItemTouchMove);
            document.body.addEventListener("mouseup", this.onTabItemTouchEnd);
            document.body.addEventListener("mouseleave", this.onTabItemTouchEnd);
            document.body.addEventListener("mousemove", this.onTabItemTouchMove);

            this.scrolling = true;

            this.railDetector.start(event);
            this.swipeDetector.start(event);

            this.dragStartPos = this.scrollVal;


            // Keeps the swipe animations bound to the framerate, not the frequency of touchmove events.
            window.elsa.App.cancelAnimationFrame(this.touchMoveAnimationId);
            var touchRenderFn = function touchRenderFn() {
                _this.tabItemTouchMove(evtPointer.e, tabItem);

                // Prevents a race condition apparent on iOS where this code may get called after
                // onTabItemTouchEnd when a touch is ended. This keeps the 'move' loop going after
                // the gesture is over, and results in the tab freezing up.
                if(_this.scrolling) {
                    _this.touchMoveAnimationId = window.elsa.App.requestAnimationFrame(this, touchRenderFn);
                }
            };

            // Kick it off.
            this.touchMoveAnimationId = window.elsa.App.requestAnimationFrame(this, touchRenderFn);

            if(Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("tab.events.touchstart");
            }
        },

        /**
         * Handles a drag event triggered every time the finger moves.
         * @param {object} e - Touch or mouse event
         */
        tabItemTouchMove: function(event) {
            event = event || window.event;
            this.swipeDetector.track(event);
        },

        /**
         * Handles a drag end.
         * @param {object} e - Touch or mouse event
         * @param {object} tabItem - The tab item that was touched
         */
        tabItemTouchEnd: function(event, tabItem) {
            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("tab touch end", event.type);
            }

            //set transition back to 1s before finishing swipe
            this.activeTab.parentElement.style.transitionDuration = "0.5s";

            document.body.removeEventListener("touchend", this.onTabItemTouchEnd);
            document.body.removeEventListener("touchcancel", this.onTabItemTouchEnd);
            document.body.removeEventListener("touchmove", this.onTabItemTouchMove);
            document.body.removeEventListener("mouseup", this.onTabItemTouchEnd);
            document.body.removeEventListener("mouseleave", this.onTabItemTouchEnd);
            document.body.removeEventListener("mousemove", this.onTabItemTouchMove);

            this.onTabItemTouchEnd = this.onTabItemTouchMove = null;
            this.railDetector.end(event);
            this.swipeDetector.end(event);
        },
    },

    protected: {
        publishChange: function(name, value) {
            if (typeof this.protected[name] === "function") {
                this.protected[name](value);
            }
        },

        publish: function(name, value) {
            if (typeof this.protected[name] === "function") {
                this.protected[name](value);
            }

            var event = new CustomEvent(name, {
                detail: value,
                bubbles: true
            });
            this.public.dispatchEvent(event);
            event = undefined;
        },
    },

    init: function(params) {
        var tempContainer = document.createDocumentFragment(),
            tempNavContainer = document.createDocumentFragment(),
            isFixedPages = this.public.classList.contains("fixed-pages");

        for (var el = this.public.firstElementChild; el; el = this.public.firstElementChild) {
            var navItem = createNavItem(el);
            el.tabIndex = 0;
            tempNavContainer.appendChild(navItem);
            tempContainer.appendChild(el);
        }

        // TODO: insertAdjacentHTML
        this.public.innerHTML = require("./template.html");

        this.contentEl = this.public.querySelector(".el-tabs-content");
        this.contentEl.appendChild(tempContainer);

        this.nav = this.public.querySelector("nav");
        this.nav.appendChild(tempNavContainer);

        this.isFixedPages = isFixedPages;

        if (!isFixedPages) {
            this.swipeStartHandler = partial(this.processSwipeStartEvent, this, Events.SWIPE_START);
            this.swipeMoveHandler = partial(this.processSwipeMoveEvent, this, Events.SWIPE_MOVE);
            this.swipeEndHandler = partial(this.processSwipeEndEvent, this, Events.SWIPE_END);

            this.railDetector = RailDetector.create();

            this.swipeDetector = SwipeGestureDetector.create(10);
            this.swipeDetector.subscribe('start', this.swipeStartHandler);
            this.swipeDetector.subscribe('move', this.swipeMoveHandler);
            this.swipeDetector.subscribe('end', this.swipeEndHandler);

            this.boundTouchStart = this.onTouchStart.bind(this);

            this.public.addEventListener('touchstart', this.boundTouchStart);
            this.public.addEventListener('mousedown', this.boundTouchStart);

            this.transitionEndHandler = this.transitionEndCb.bind(this);
            this.contentEl.addEventListener(styles.transitionend, this.transitionEndHandler, false);

            this.contentEl.transformValX = 0;
        }

        this.fastTouch = FastTouch.create(this.nav, this.onNavClicked.bind(this));

        if (params.parentControl && typeregistry.page.prototype.isPrototypeOf(params.parentControl)) {
            if (this.public.constructor.debug) {
                console.log("tabs.init", params.parentControl.tagName + "." + params.parentControl.routename);
            }
            this.page = params.parentControl;
        } else if (this.contentEl.children.length > 0) {
            this.setActiveTab(this.contentEl.firstElementChild, false, true);
        }

        this.configureRouting();
    },

    destroy: function() {
        if (!this.isFixedPages) {
            this.contentEl.removeEventListener(styles.transitionend, this.transitionEndHandler, false);
            this.transitionEndHandler = undefined;

            this.public.removeEventListener('touchstart', this.boundTouchStart);
            this.public.removeEventListener('mousedown', this.boundTouchStart);

            this.boundTouchStart = undefined;

            this.railDetector.destroy();
            this.railDetector = undefined;

            this.swipeDetector.unsubscribe('start', this.swipeStartHandler);
            this.swipeDetector.unsubscribe('move', this.swipeMoveHandler);
            this.swipeDetector.unsubscribe('end', this.swipeEndHandler);

            this.swipeDetector.destroy();
            this.swipeDetector = undefined;

            this.swipeStartHandler = undefined;
            this.swipeMoveHandler = undefined;
            this.swipeEndHandler = undefined;
        }

        this.isFixedPages = undefined;

        if (this.page) {
            if (this.boundPageStateChanged) {
                this.page.removeEventListener("statechange", this.boundPageStateChanged);
                this.boundPageStateChanged = undefined;
            }
            this.page = undefined;
        }

        window.elsa.App.cancelAnimationFrame(this);
        this.touchMoveAnimationId = undefined;
        this.setTabAnimationId = undefined;
        this.nav.removeEventListener("click", this.boundNavClicked);
        this.boundPageStateChanged = undefined;
        this.fastTouch = this.fastTouch.destroy();
        this.contentEl = undefined;
        this.nav = undefined;
        this.activeNavItem = undefined;
        this.activeTab = undefined;
        this.prevActiveNavItem = undefined;
        this.prevActiveTab = undefined;
    }
};

},{"../../core/polyfill/styles.js":76,"../../shared/utils":118,"../common/fastTouch.js":14,"../list/gestures/railDetector.js":34,"../list/gestures/swipeGestureDetector.js":36,"../list/swipe/swipeActions.js":42,"./template.html":59}],58:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

var utils = require("../../shared/utils");

module.exports = {

    /**
     * Defines a tab that goes into the {@link tabs tabs} element.
     * @el control
     * <el-tab></el-tab>
     * @class tab
     * @extends control
     */

    name: "tab",

    extend: window.elsa.control,

    mixinExtended: [require("../../shared/content")],

    attributes: ["label", "stateid"],

    /** @lends tab# */
    public: {
        /** label setter/getter
         * @example <el-tab data-label="Tab 1"></el-tab>
         * @example tab.label = "Tab 1"
         */
        label: {
            set: function(newLabel) {
                this.public.setAttribute('data-label', newLabel);
            },
            get: function() {
                return this.public.getAttribute('data-label');
            }
        },

        /**
         * The value that represents the current draweritem in the URL segment when triggered, following `item=`. The {@link tabs tabs} control listens for this value and makes changes necessarry for navigation.
         * If undefined, will default to:
         * 1. slugified value of {@link tab#label label}
         * 2. Elsa __id
         *
         * @readonly
         * @type {string}
         * @example
         *  <el-tab data-stateid="tab-1">
         *  </el-tab>
         *
         */
        stateid: {
            writable: false
        },
    },

    init: function(params) {
        this.label = this.public.getAttribute('data-label');
        this.stateid = this.stateid || (this.public.label ? utils.slugify(this.public.label) : false);
        if (!this.stateid) {
            throw new Error("tab expects label or stateid", this.public, this.sourcepath);
        }
    },

    destroy: function() {

    }
};

},{"../../shared/content":113,"../../shared/utils":118}],59:[function(require,module,exports){
module.exports = "<nav class=el-tabs-nav></nav><div class=el-tabs-content></div>";

},{}],60:[function(require,module,exports){
module.exports = "<div class=el-toast-content></div><div class=el-toast-pipe></div><button class=el-toast-button></button>";

},{}],61:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var transformPolyfill = window.elsa.utils.styles;

var simpleTemplate = require("./simple.html");
var buttonTemplate = require("./button.html");
var FastTouch = require("../common/fastTouch.js");

/**
 * Provides a toast with optional button. Default timeout for a toast is one second and five seconds for a toast with a button.
 * Timeout resets if toast is hovered over. API exposed on page. See {@link page#toast page}
 *
 * @class page.toast
 * @extends HTMLElement
 * @el service
 *
 * @demo backbone
 * <caption>Showing a toast using Backbone.js</caption>
 * <template name="toast.html">
 * <el-page data-controller="backbone:./toast.js">
 *     <el-page-content>
 *          <p>Toast with undo button.</p>
 *          <p id="status"></p>
 *     </el-page-content>
 *     <el-bar>
 *          <el-action id="delete-action" data-label="Delete" data-iconclass="fa fa-close"></el-action>
 *     </el-bar>
 * </el-page>
 * </template>
 * <template name="toast.js">
 * module.exports = Backbone.View.extend({
 *     events :{
 *         "trigger #delete-action": function() {
 *             var self = this;
 *             this.el.toast({
 *                 label: "This is a toast with a button",
 *                 buttonLabel: "Undo",
 *                 buttonPressedCallback: function() {
 *                     self.el.querySelector("#status").textContent = "Button pressed!";
 *                 }
 *             });
 *         }
 *     }
 * });
 * </template>
 *
 * @demo angular
 * <caption>Showing a toast using Angular.js</caption>
 * <template name="toast.html">
 * <el-page ng-controller="toastCtrl">
 *     <el-page-content>
 *          <p>Toast with undo button.</p>
 *          <p>{{status}}</p>
 *     </el-page-content>
 *     <el-bar>
 *          <el-action el-on="{trigger:'openToast()'}" data-label="Delete" data-iconclass="fa fa-close"></el-action>
 *     </el-bar>
 * </el-page>
 * </template>
 *
 * <template name="toastCtrl.js">
 * angular.module("demo").controller("toastCtrl", function($scope){
 *     $scope.openToast = function(){
 *         $scope.toast({
 *             label: "This is a toast with a button",
 *             buttonLabel: "Undo",
 *             buttonPressedCallback: function() {
 *                 $scope.$apply(function() {
 *                     $scope.status = "Button pressed!";
 *                 });
 *             }
 *         });
 *     };
 * });
 * </template>
 */

module.exports = {

    name: "toast",

    extend: HTMLElement,

    /** @lends page.toast# */
    public: {
        open: function() {
            var self = this;

            window.elsa.App.requestAnimationFrame(this, function() {
                self.public.classList.add("open");
                window.elsa.App.requestAnimationFrame(self, function() {
                    window.elsa.App.scene.classList.add("fade-in");
                    self.public.classList.add("fade-in");
                });
            });

            this.startAutoCloseTimeout();
        },
        close: function() {
            var self = this;
            this.cancelAutoCloseTimeout();

            this.public.addEventListener(transformPolyfill.transitionend, this.hideToast);
            window.elsa.App.scene.classList.remove("fade-in");
            self.public.classList.remove("fade-in");
        }
    },

    private: {

        autoCloseTimeout: undefined,

        startAutoCloseTimeout: function() {
            var self = this;
            self.autoCloseTimeout = setTimeout(function() {
                self.public.close();
            }, this.options.timeout);
        },

        cancelAutoCloseTimeout: function() {
            if (this.autoCloseTimeout) {
                clearTimeout(this.autoCloseTimeout);
                this.autoCloseTimeout = undefined;
            }
        },

        touchStart: function() {
            this.cancelAutoCloseTimeout();

            document.body.addEventListener('touchend', this.touchEnd);
            document.body.addEventListener('touchcancel', this.touchEnd);
        },

        touchEnd: function() {
            this.startAutoCloseTimeout();

            document.body.removeEventListener('touchend', this.touchEnd);
            document.body.removeEventListener('touchcancel', this.touchEnd);
        },

        hideToast: function() {
            this.public.removeEventListener(transformPolyfill.transitionend, this.hideToast);
            this.public.classList.remove("open");

            var self = this;
            window.elsa.App.requestAnimationFrame(this, function() {
                self.public.parentNode.removeChild(self.public);
                self.public.destroy();
            });
        }

    },

    protected: {

        trigger: function() {
            this.public.close();
            if (this.options.buttonPressedCallback) {
                this.options.buttonPressedCallback();
            }
        }

    },

    init: function(options) {
        var self = this,
            button;

        if (!options) {
            options = {};
        }

        if (!options.timeout) {
            if (options.buttonLabel) {
                //5 second timeout by default for toasts with buttons, unless timeout set
                options.timeout = 5000;
            } else {
                //one second timeout by default
                options.timeout = 1000;
            }
        }

        if (options.buttonLabel) {
            this.public.innerHTML = buttonTemplate;

            button = this.public.getElementsByClassName("el-toast-button")[0];
            button.innerHTML = options.buttonLabel;
            this.fastTouch = new FastTouch(button, this.protected.trigger.bind(this.protected));

            if (options.label) {
                this.public.getElementsByClassName("el-toast-content")[0].innerHTML = options.label;
            }
        } else {
            this.public.innerHTML = simpleTemplate;

            if (options.label) {
                this.public.getElementsByClassName("el-toast-content")[0].innerHTML = options.label;
            }
        }

        this.options = options;
        this.hideToast = this.hideToast.bind(this);

        this.startAutoCloseTimeout = this.startAutoCloseTimeout.bind(this);
        this.cancelAutoCloseTimeout = this.cancelAutoCloseTimeout.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this.public.addEventListener('mouseenter', this.cancelAutoCloseTimeout);
        this.public.addEventListener('mouseleave', this.startAutoCloseTimeout);
        this.public.addEventListener('touchstart', this.touchStart);
    },

    destroy: function() {
        this.cancelAutoCloseTimeout();

        if (this.options.buttonLabel) {
            this.fastTouch = this.fastTouch.destroy();
        }

        window.elsa.App.cancelAnimationFrame(this);
        this.public.removeEventListener(transformPolyfill.transitionend, this.hideToast);
        this.public.removeEventListener('mouseenter', this.cancelAutoCloseTimeout);
        this.public.removeEventListener('mouseleave', this.startAutoCloseTimeout);
        this.public.removeEventListener('touchstart', this.touchStart);
        document.body.removeEventListener('touchend', this.touchEnd);
        document.body.removeEventListener('touchcancel', this.touchEnd);

        this.options = undefined;
        this.hideToast = undefined;
        this.startAutoCloseTimeout = undefined;
        this.cancelAutoCloseTimeout = undefined;
        this.touchStart = undefined;
        this.touchEnd = undefined;
    }

};

},{"../common/fastTouch.js":14,"./button.html":60,"./simple.html":62}],62:[function(require,module,exports){
module.exports = "<div class=el-toast-content style=\"text-align: center\"></div>";

},{}],63:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = window.elsa.compiler;
var types = window.elsa;

var applyAttributes = require("../../shared/utils.js").applyAttributes;
var FastTouch = require("../common/fastTouch.js");
var events = require('../../shared/events.js');

module.exports = {

    /**
     * Provides Toggle control
     *
     * @el control
     * <el-toggle></el-toggle>
     *
     * @fires toggle#trigger
     * @class toggle
     * @extends HTMLElement
     *
     * @demo angular
     * <template name="toggle.html">
     * <el-page>
     *      <el-page-content>
     *          <label>Toggle:ON</label><el-toggle data-checked="true" el-on="{trigger: 'toast({label: \'Toggled!\'})'}"></el-toggle>
     *      </el-page-content>
     * </el-page>
     * </template>
     */

    /**
     * Dispatched when the toggle control is toggled, either by using touch/mouse or by setting the checked property.
     *
     * ##### Detail:
     * __`toggle`__ The toggle control itself
     *
     * @event toggle#trigger
     * @type {DOMEvent}
     */

    name: "toggle",

    extend: window.HTMLElement,

    mixinExtended: [FastTouch.mixin],

    attributes: ["checked", "value", "disabled"],

    events: ["trigger"],

    modelDrivenAttribute: {
        event: "trigger",
        attr: "checked"
    },

    /** @lends toggle# */
    public: {

        /**
         * checked specifies whether the toggle is checked or not
         * @example <el-toggle data-checked="true"></el-toggle>
         * @example toggle.checked = true
         * @fires toggle#trigger
         */

        checked: {
            set: function(value) {
                if (value === this.checked || this.disabled) {
                    return;
                }
                this.checked = value;
                this.public.setAttribute("aria-checked", this.checked);
                this.public.setAttribute("checked", this.checked);
                this.public.dispatchEvent(events.trigger());
            }
        },

        /**
         * disabled disables the toggle control
         * @example <el-toggle disabled="true"></el-toggle>
         * @example toggle.disabled = true
         * @fires toggle#trigger
         */

        disabled: {
            set: function(value) {
                if (value === this.disabled) {
                    return;
                }
                this.disabled = value;
                if (!this.disabled) {
                    this.public.removeAttribute("disabled");
                    this.public.removeAttribute("aria-disabled");
                } else {
                    this.public.setAttribute("disabled", "");
                    this.public.setAttribute("aria-disabled", this.disabled);
                }
                this.protected.publish("disabledChanged", this.disabled);
            },
            get: function() {
                return this.disabled;
            }
        },

        /**
         * value allows developers to set the toggle to a value, regardless of checked state
         * @example <el-toggle data-value="Airplane Mode"></el-toggle>
         * @example toggle.value = "Airplane Mode"
         */

        value: {
            set: function(value) {
                if (value === this.value) {
                    this.value = value;
                }
            },
            get: function() {
                return this.value;
            }
        }

    },

    private: {

        checked: false,

        value: undefined
    },

    protected: {
        trigger: function() {
            if (!this.disabled) {
                this.public.checked = this.checked ? false : true;
            }
        }
    },

    init: function() {
        this.public.innerHTML = require("./template.html");
        this.public.setAttribute("role", "checkbox");
        this.enableFastTouch(this.public);
        this.disabled = false;
        applyAttributes(this.public, module.exports.attributes);
    },

    destroy: function() {
        this.handleEvent = undefined;
    }
};

},{"../../shared/events.js":115,"../../shared/utils.js":118,"../common/fastTouch.js":14,"./template.html":64}],64:[function(require,module,exports){
module.exports = "<span class=el-toggle-switch></span>";

},{}],65:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

/*global Control:false*/
var Extend = require("ecma5-extend");
var path = require("path");

var elements = require("./elements");
var errorUtils = require('../shared/error-utils.js');
var plugins = require("./control/plugins");

var compiler;
var templateCompiler;

var declareDeferredType = function(tag, definition) {
    return {
        configurable: true,
        enumerable: false,
        get: function() {
            var type = Extend.createType(definition);
            Object.defineProperty(this, tag, {
                enumerable: true,
                configurable: true,
                writable: false,
                value: type
            });
            type.debug = (window.elsa.App || {}).debug;
            return type;
        }
    };
};

var XPATH_QUERY = ".//*[starts-with(local-name(), 'el-')]";
var creationQueryAll = function(frag, callback) {
    var xpath = document.evaluate(XPATH_QUERY, frag, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < xpath.snapshotLength; i++) {
        callback(xpath.snapshotItem(i));
    }
    xpath = undefined;
};


var destructionQueryAll = function(frag, callback) {
    var xpath = document.evaluate(XPATH_QUERY, frag, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var iMax = xpath.snapshotLength - 1;
    for (var i = iMax; i >= 0; i--) {
        var el = xpath.snapshotItem(i);
        callback(el);
    }
    if (frag.tagName.substring(0, 3) === 'EL-') {
        callback(frag);
    }
    xpath = undefined;
};

compiler = module.exports = {
    /*
     * compiler provides methods to parse definitions trees into elsa controls
     * WARNING: consider compiler to be an INTERNAL API
     */
    public: {},

    parsing: false,

    creationCompletedQueue: [],

    destructionQueue: [],

    destructionList: [],

    ignoreTypes: ['page-content'],

    packageJSON: require('../../package.json'),

    registerElementType: function(type) {
        var tag = type.name.toLowerCase();
        if (typeof elements[tag] !== "undefined") {
            //throw new Error(tag + " is already registered as a custom element type");
            return;
        }

        if (!Extend.isType(type)) {
            Object.defineProperty(elements, tag, declareDeferredType(tag, type));
        } else {
            Object.defineProperty(elements, tag, {
                configurable: true,
                writable: false,
                enumerable: true,
                value: type
            });
        }
    },

    compileDocumentFragment: function(source, parentControl, state) {
        var Control = require('../core/control/index.js');
        source = source || {};
        // TODO: how to do this
        parentControl = parentControl || window.elsa.App;

        var params = {
            parentControl: parentControl,
            require: source.require,
            sourcepath: source.sourcepath,
            routename: source.routename
        };
        return compiler._compileDocumentFragment(source, state, params);
    },

    _compileDocumentFragment: function(source, state, params) {
        var el = document.createElement("div");
        var frag = document.createDocumentFragment();
        state = state || {};

        if (typeof source === "string") {
            el.innerHTML = source;
        } else if (typeof source === "function") {
            try {
                el.innerHTML = source(state);
            } catch (e) {
                errorUtils.log(e);
            }
        } else if (source instanceof window.Node) {
            el = source;
        } else {
            throw Error("elsa.compiler: Unable to compile unsupported parameter type " + (typeof source) + ": " + source);
        }

        var subparse = compiler.parsing;
        var initialize = true;
        compiler.parsing = true;

        if (templateCompiler) {
            initialize = !templateCompiler.create(el.childElementCount === 1 ? el.firstElementChild : el, state, params);
        }
        if (initialize) {
            compiler.compileDOMTree(el, state, params);
        }
        compiler.creationCompleted(subparse, el);

        if (el === source) {
            return el;
        }
        for (var child = el.firstChild; child; child = el.firstChild) {
            frag.appendChild(child);
        }
        return frag;
    },

    destroyDOMNode: function(el) {
        if (!el || compiler.destructionList.indexOf(el) !== -1) {
            return;
        }
        compiler.destructionList.unshift(el);
        if (templateCompiler && templateCompiler.destroy) {
            if (templateCompiler.destroy(el)) {
                return;
            }
        }
        compiler.destroyDOMTree(el);
    },

    destroyDocumentFragment: function(parentEl) {
        var first = compiler.destructionList.length === 0;
        var parentNode;
        if (parentEl instanceof window.HTMLCollection || parentEl instanceof window.NodeList || Array.isArray(parentEl)) {
            for (var i = parentEl.length - 1; i >= 0; i--) {
                var el = parentEl[i];
                parentNode = el.parentNode;
                if (parentNode) {
                    parentNode.removeChild(el);
                }
            }
            for (i = 0; i < parentEl.length; i++) {
                compiler.destroyDOMNode(parentEl[i]);
            }
            return;
        } else if (parentEl) {
            parentNode = parentEl.parentNode;
            if (parentNode) {
                parentNode.removeChild(parentEl);
            }
            compiler.destroyDOMNode(parentEl);
        }
        if (first) {
            compiler.destructionList = [];
        }
    },

    replaceDocumentFragment: function(parentEl, src, parentControl) {
        compiler.destroyDocumentFragment(parentEl.children);

        var frag = compiler.compileDocumentFragment(src, parentControl || parentEl);
        var child;
        parentEl.appendChild(frag);
    },

    precompileTemplate: function(frag) {
        creationQueryAll(frag, function(el) {
            var typeName = el.tagName.toLowerCase().substring(3);
            var type = elements[typeName];
            if (type && type.precompile) {
                type.precompile(el);
            }
        });
        return frag;
    },

    compileDOMTree: function compileDOMTree(frag, rootState, rootParams) {
        var item, rootControl, controlIds = {};

        var dirname = path.dirname(rootParams.sourcepath);
        if (dirname === '') {
            dirname = '/';
        }
        var parentParse = !compiler.parsing;
        compiler.parsing = true;

        var rootElement = frag.childElementCount === 1 ? frag.firstElementChild : undefined;
        var ignoreTypes = this.ignoreTypes;

        creationQueryAll(frag, function(el) {
            var typeName = el.tagName.toLowerCase().substring(3);
            var type = elements[typeName];

            if (!type) {
                if (ignoreTypes.indexOf(typeName) === -1) {
                    console.warn("No known type " + typeName);
                }
                return;
            }

            var params = {};
            var isControlType = type === elements.control || elements.control.prototype.isPrototypeOf(type.prototype);

            if (rootElement === el && isControlType) {
                rootControl = el;
                params = rootParams;
                params.state = rootState;
            }
            params.require = rootParams.require;
            params.sourcepath = rootParams.sourcepath;

            if (rootControl && el !== rootControl) {
                params.parentControl = rootControl;
            } else if (el === rootElement && rootParams && rootParams.parentControl) {
                params.parentControl = rootParams.parentControl;
            }

            item = type.create(el, params);
            if (el === frag) {
                frag = item;
            }
            if (el === rootControl) {
                rootControl = item;
            }
            if (typeName !== "import") {
                compiler.creationCompletedQueue.push(item);
            }
        });

        return frag;
    },

    creationCompleted: function(subparse) {
        if (!subparse) {
            while (compiler.creationCompletedQueue.length > 0) {
                var item = compiler.creationCompletedQueue.shift();
                // TODO: push down to plugin wrapper
                try {
                    item.publish("creationCompleted");
                } catch (e) {
                    errorUtils.log(e);
                }
            }
            compiler.parsing = false;
        }
    },

    destroyDOMTree: function destroyDOMTree(el) {
        var concurrent = compiler.destructionQueue.length > 0;
        var item;

        destructionQueryAll(el, function(item) {
            if (typeof item.destroy === "function" && compiler.destructionQueue.indexOf(item) === -1) {
                compiler.destructionQueue.unshift(item);
            }
        });

        if (concurrent) {
            return;
        }

        while ((item = compiler.destructionQueue.shift()) !== undefined) {
            if (typeof item.destroy === "function") {
                // TODO: push down to plugin wrapper
                item.destroy();
            }
        }
        compiler.destructionList = [];
    }
};

/**
 * The elsa compiler. Responsible for elsa custom-element loading/unloading.
 * @class compiler
 * @memberOf elsa
 */
Object.defineProperties(compiler.public, {
    /**
     * @property {Object|undefined} templateCompiler A custom template compiler to support compiled frameworks (or undefined to unset)
     * @property {function({Object})} templateCompiler.initialize An initialize function called when the compiler is registered
     * @type {{a: number}}
     * @memberOf elsa.compiler#
     */
    templateCompiler: {
        get: function() {
            return templateCompiler;
        },
        set: function(value) {
            templateCompiler = value;
            if (templateCompiler) {
                templateCompiler.initialize({
                    creationCompletedQueue: compiler.creationCompletedQueue,
                    destructionQueue: compiler.destructionQueue
                });
            }
        }
    },

    /**
     * The default template type to use throught the framework when none is specified.
     * @type {string}
     */
    defaultTemplateType: {
        get: function() {
            return compiler.defaultTemplateType;
        },
        set: function(value) {
            compiler.defaultTemplateType = value;
        }
    },

    /**
     * Elsa compiler plugin registry.
     * Used to support additional MVC frameworks within elsa.
     *
     * @type {elsa.compiler.plugins}
     * @memberOf elsa.compiler#
     */
    plugins: {
        value: plugins
    },

    /**
     * Registers a custom element type with the elsa compiler, and makes the type available globally
     * on the elsa object. The compiler will make the custom element available to any future compilations.
     * @method registerElement
     * @memberOf elsa.compiler#
     * @param {Type|Definition} type - An ecma5-extend type definition or constructed type
     */
    registerElement: {
        value: compiler.registerElementType
    },

    elements: {
        enumerable: true,
        value: elements
    },

    /**
     * Compile a source string/template/DOM node.
     *
     * Every DOM fragment with elsa controls must be run through the elsa compiler
     * to instantiate the controls therin.
     *
     * It is the responsibility of the developer to call elsa.compile for any DOM
     * fragments they dynamically create, and to call elsa.destroy for any DOM fragments
     * they remove.
     *
     * @method compile
     * @memberOf elsa.compiler#
     * @param {string|function|HTMLElement} source - The source to compile
     * @param {control} parentControl - The parent elsa control
     * @returns {document-fragment} - The compiled nodes in a document-fragment
     */
    compile: {
        value: compiler.compileDocumentFragment
    },

    /**
     * Destroy a elsa-compiled dom node (and all of its children).
     *
     * Every DOM fragment with elsa controls that is dynamically removed
     * must be destoryed with elsa.destroy. Element(s) passed to destroy() are
     * removed from their parent node before being destroyed.
     *
     * It is the responsibility of the developer to call elsa.destroy for any DOM
     * fragments that they dynamically remove.
     *
     * @method destroy
     * @memberOf elsa.compiler#
     * @param {string|function|HTMLElement|NodeList} element - The element to destroy
     */
    destroy: {
        value: function(el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
            return compiler.destroyDocumentFragment(el);
        }
    }

});

},{"../../package.json":4,"../core/control/index.js":66,"../shared/error-utils.js":114,"./control/plugins":67,"./elements":68,"ecma5-extend":1,"path":3}],66:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = require("../compiler.js");
var typeregistry = require("../elements");
var plugins = require("./plugins");
var errorUtils = require("../../shared/error-utils.js");
var path = require('path');

var globalId = 0;
var anonymousId = 0;

var parseUri = function(uri) {
    var split = uri.split(":");
    return [split[0], split.slice(1).join(":")];
};

/** Provides a base-type for all controls, elements that inherit from control can point at a controller file (.js), which they are bound to during creation
 * @el control
 * <el-control data-controller="backbone:index.js"></el-control>
 * @class control
 * @extends HTMLElement
 *
 * @demo backbone
 * <caption>el-control can be used to segment your pages into multiple views, similar to Angular's ng-controller. This demo shows how to segment your Backbone page into segments each backed by a Backbone view.<br/>
 *This example also shows using elsa flex-based CSS styles. (see CSS-styles class)
 </caption>
 * <template name="control.html">
 * <el-page data-controller="backbone:./control.js">
 * <style type="text/css">
 * .segment {
 *      min-height: 50px;
 *      margin: 5px;
 *      border: 1px solid #EEE;
 *      border-radius: 5px;
 *      line-height: 50px;
 *      text-align: center;
 * }
 * </style>
 *      <el-bar>
 *          <div class="title">Multiple Backbone Views</div>
 *      </el-bar>
 *      <el-page-content>
 *          <el-control class="segment" data-controller="backbone:./segment1.js">
 *          </el-control>
 *          <el-control class="segment el-flex el-grow el-align-items-center el-justify-content-center" data-controller="backbone:./segment2.js">
 *          </el-control>
 *          <el-control class="segment" data-controller="backbone:./segment3.js">
 *          </el-control>
 *      </el-page-content>
 * </el-page>
 * </template>
 * <template name="control.js">
 * module.exports = Backbone.View.extend({
 *      events: {
 *          "statechange": "statechange"
 *      },
 *      statechange: function() {
 *          // when statechange fires, all child controllers have initialized and DOM populated
 *      }
 * });
 * </template>
 * <template name="segment1.js">
 * module.exports = Backbone.View.extend({
 *      initialize: function() {
 *          this.el.innerHTML = "Segment 1";
 *      }
 * });
 * </template>
 * <template name="segment2.js">
 * module.exports = Backbone.View.extend({
 *      initialize: function() {
 *          this.el.innerHTML = "Segment 2";
 *      }
 * });
 * </template>
 * <template name="segment3.js">
 * module.exports = Backbone.View.extend({
 *      initialize: function() {
 *          this.el.innerHTML = "Segment 3";
 *      }
 * });
 * </template>
 *
 * @demo angular
 * <caption>Multi-controller sample with angular</caption>
 * <template name="control.html">
 * <el-page ng-controller="controlCtrl" el-on="{statechange: 'statechange()'}">
 * <style type="text/css">
 * .segment {
 *      min-height: 50px;
 *      margin: 5px;
 *      border: 1px solid #EEE;
 *      border-radius: 5px;
 *      line-height: 50px;
 *      text-align: center;
 * }
 * </style>
 *      <el-bar>
 *          <div class="title">Multiple Backbone Views</div>
 *      </el-bar>
 *      <el-page-content>
 *          <el-control class="segment" ng-controller="segment1Ctrl">
 *              {{text}}
 *          </el-control>
 *          <el-control class="segment el-flex el-grow el-align-items-center el-justify-content-center" ng-controller="segment2Ctrl">
 *              {{text}}
 *          </el-control>
 *          <el-control class="segment" ng-controller="segment3Ctrl">
 *              {{text}}
 *          </el-control>
 *      </el-page-content>
 * </el-page>
 * </template>
 * <template name="controlCtrl.js">
 * angular.module("demo").controller("controlCtrl", function($scope, $element) {
 *      $scope.statechange = function(){
 *          // when statechange fires that all child controllers have initialized and DOM populated
 *      }
 * });
 * </template>
 * <template name="segment1Ctrl.js">
 * angular.module("demo").controller("segment1Ctrl", function($scope) {
 *       $scope.text = "Segment 1";
 * });
 * </template>
 * <template name="segment2Ctrl.js">
 * angular.module("demo").controller("segment2Ctrl", function($scope) {
 *       $scope.text = "Segment 2";
 * });
 * </template>
 * <template name="segment3Ctrl.js">
 * angular.module("demo").controller("segment3Ctrl", function($scope) {
 *       $scope.text = "Segment 3";
 * });
 * </template>
 */
module.exports = {

    name: "control",

    extend: HTMLElement,

    /** @lends control# */
    public: {

        /**
         * Bind current element and its DOM to a controller file, or controller instance. Typically, pass a string that is made up of an adaptor and relative path, in Angular, use ng-controller the Angular way instead.
         * @readonly
         * @example
         * <caption>Binding to an Elsa controller</caption>
         * <el-<%= name %> data-controller="elsa:./index.js"></el-control>
         * @example
         * <caption>Binding to a Backbone view</caption>
         * <el-<%= name %> data-controller="backbone:./index.js"></el-control>
         * @example
         * <caption>Binding to an Angular controller</caption>
         * <el-<%= name %> ng-controller="someCtrl"></el-control>
         */
        controller: {
            writable: false
        },

        /**
         * Looks up a property in controller chain
         *
         * @param {string} [property] the property name to look up the controller chain
         * @returns {Object|undefined}
         *
         * @example
         * //returns a property called "mymodel" in a controller up the chain, or undefined if not found
         * <%= name %>.get("mymodel");
         */
        get: function(property) {
            var self = this;
            var parent = this.public.parentControl;
            for (; parent && parent !== document.body; parent = parent.parentControl) {
                if (parent.controller) {
                    var value = parent.controller[property];
                    if (value) {
                        return value;
                    }
                }
            }
            return undefined;
        },

        /**
         * Tparent element in controller chain
         *
         * @readonly
         * @type {control}
         *
         * @example
         * //returns the closest parent routeable element (for example the previous page when in a stack)
         * <%= name %>.parentControl;
         */
        parentControl: {
            get: function() {
                return this.protected.parentControl;
            }
        }
    },

    /**
     * @lends control#
     */
    protected: {

        creationCompleted: function(data) {
            /** Send out our state */
            var v;
            var exception;
            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log(Object.getPrototypeOf(this.public).constructor.name + "#" + this.protected.routename + ".creationCompleted");
            }

            this.protected.lifecyclePhase = "created";
            if (this.plugin) {
                var controller = this._controller;
                this._controller = undefined;
                this.protected.require = this.protected.require || window.require;
                if (controller) {
                    /** Call initialize, allowing it to modify the state */
                    var basepath = path.dirname(this.protected.sourcepath);
                    try {
                        controller = this.protected.require(path.normalize(path.join(basepath, controller)));
                        if (!controller) {
                            var notfound = new Error(Object.getPrototypeOf(this.public).constructor.name + "." +
                                this.public.routename + ": Unable to find module " + controller);
                            notfound.code = "MODULE_NOT_FOUND";
                            throw notfound;
                        }
                        this.controller = this.plugin.controller.create(this.public, controller, {
                            scheme: this.scheme,
                            data: data || {}
                        });
                    } catch (e) {
                        if (e.code !== "MODULE_NOT_FOUND") {
                            this.controller = undefined;
                            exception = e;
                        } else {
                            errorUtils.log(e);
                        }
                    }
                }
            }

            if (exception) {
                throw exception;
            }
        }

    },

    init: function(params) {
        params = params || {};
        if (!params.parentControl) {
            params.parentControl = window.elsa.App;
        }

        this.scheme = params.scheme;
        this.protected.parentControl = params.parentControl;
        this.protected.lifecyclePhase = "initialized";
        this.protected.require = params.require;
        this.protected.sourcepath = params.sourcepath;

        var controllerUri = params.controller || this.public.getAttribute("controller") || this.public.getAttribute("data-controller");
        if (controllerUri) {
            var spec = parseUri(controllerUri);
            var plugin = plugins.get(spec[0]);
            if (plugin && plugin.controller) {
                this._controller = spec[1];
                this.scheme = spec[0];
                this.plugin = plugin;
            } else {
                console.warn("unable to load scheme plugin for controller: " + controllerUri);
                this.controller = undefined;
            }
        }

        if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
            console.log("control#" + this.routename + ".init", this.scheme, this._controller);
        }
    },

    destroy: function() {
        if (this.controller) {
            this.plugin.controller.destroy(this.public, this.controller);
        }
        this.plugin = undefined;
        this.controller = undefined;
        this.protected.parentControl = undefined;
    }
};

},{"../../shared/error-utils.js":114,"../compiler.js":65,"../elements":68,"./plugins":67,"path":3}],67:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var plugins = {};

/**
 * Elsa compiler plugin registry
 * @class plugins
 * @memberOf elsa.compiler
 */

/**
 * @lends elsa.compiler.plugins#
 */
module.exports = {

    /**
     * Lookup a registered elsa compiler plugin by scheme
     * @method get
     * @memberOf elsa.compiler.plugins#
     * @param {string} scheme - the scheme (eg: backbone, angular, elsa)
     * @return {core.plugin|undefined}   - an elsa compiler plugin or undefined
     */
    get: function(scheme) {
        return plugins[scheme];
    },

    /**
     * Register an elsa compiler plugin for the specified scheme
     * @method register
     * @memberOf elsa.compiler.plugins#
     * @param {string} scheme - the scheme (eg: backbone, angular, elsa)
     * @param {Object} plugin - the plugin to register for the scheme (or undefined to unregister)
     */
    register: function(scheme, plugin) {
        plugins[scheme] = plugin;
    }
};
},{}],68:[function(require,module,exports){
module.exports = {};
},{}],69:[function(require,module,exports){
var Ecma5Extend = require('ecma5-extend');
var compiler = require('./compiler');
if (!window.Ecma5Extend) {
    window.Ecma5Extend = Ecma5Extend;
}

compiler.public.registerElement(require("./control"));

module.exports = Object.create(require('./elements'), {
    compiler: {
        enumerable: true,
        value: compiler.public
    },
    utils: {
        enumerable: true,
        value: {
            styles: require("./polyfill/styles")
        }
    },
    version: {
        enumerable: true,
        value: compiler.packageJSON.version
    }
});


compiler.public.plugins.register("elsa", require("../plugins/elsa.js"));
compiler.public.plugins.register("jquery", require("../plugins/jquery.js"));
compiler.public.plugins.register("backbone", require("../plugins/backbone.js"));
compiler.public.plugins.register("angular", require("../plugins/angular.js"));
},{"../plugins/angular.js":99,"../plugins/backbone.js":110,"../plugins/elsa.js":111,"../plugins/jquery.js":112,"./compiler":65,"./control":66,"./elements":68,"./polyfill/styles":76,"ecma5-extend":1}],70:[function(require,module,exports){
/* CustomEvent polyfill for stock android browser + IE 9 & 10
 * Inspired by https://developer.mozilla.org/en/docs/Web/API/CustomEvent
 */
if (typeof window.CustomEvent !== 'function') {
    var defaults = {
        bubbles: false,
        cancelable: false,
        detail: undefined
    };
    var customevent = function(eventName, params) {
        params = params || defaults;
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    customevent.prototype = window.CustomEvent ? window.CustomEvent.prototype : window.Event.prototype;
    window.CustomEvent = customevent;
}

},{}],71:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

function polyfillParentNode(prototype, obj) {

    if (!("firstElementChild" in obj)) {
        Object.defineProperty(prototype, 'firstElementChild', {
            get: function() {
                var el = this.firstChild;
                do {
                    if (el.nodeType === 1) {
                        return el;
                    }
                    el = el.nextSibling;
                } while (el);
                return null;
            }
        });
    }
    if (!("lastElementChild" in obj)) {
        Object.defineProperty(prototype, 'lastElementChild', {
            get: function() {
                var el = this.lastChild;
                while (el) {
                    if (el.nodeType === 1) {
                        return el;
                    }
                    el = el.previousSibling;
                }
                return null;
            }
        });
    }
    if (!("nextElementSibling" in obj)) {
        Object.defineProperty(prototype, 'nextElementSibling', {
            get: function() {
                var el = this.nextSibling;
                while (el) {
                    if (el.nodeType === 1) {
                        return el;
                    }
                    el = el.nextSibling;
                }
                return null;
            }
        });
    }
    if (!("previousElementSibling" in obj)) {
        Object.defineProperty(prototype, 'previousElementSibling', {
            get: function() {
                var el = this.previousSibling;
                while (el) {
                    if (el.nodeType === 1) {
                        return el;
                    }
                    el = el.previousSibling;
                }
                return null;
            }
        });
    }
    if (!("childElementCount" in obj)) {
        Object.defineProperty(prototype, 'childElementCount', {
            get: function() {
                var count = 0;
                var el = this.firstElementChild;
                while (el) {
                    count++;
                    el = el.nextElementSibling;
                }
                return count;
            }
        });
    }
    if (!("children" in obj)) {
        Object.defineProperty(prototype, 'children', {
            get: function() {
                var children = [];
                var el = this.firstElementChild;
                while (el) {
                    children.push(el);
                    el = el.nextElementSibling;
                }
                return children;
            }
        });
    }
}

polyfillParentNode(window.Node.prototype, document.createElement("div"));
polyfillParentNode(window.DocumentFragment.prototype, document.createDocumentFragment());

},{}],72:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


require("./CustomEvent.js");
require("./requestAnimationFrame.js")(['webkit', 'moz']);
require("./ParentNode.js");
require("./iosTouch.js");

},{"./CustomEvent.js":70,"./ParentNode.js":71,"./iosTouch.js":73,"./requestAnimationFrame.js":75}],73:[function(require,module,exports){
if (!document.body.hasAttribute('ontouchstart')) {
    // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
    // https://jira.bbqnx.net/browse/MEAPCLIENT-1133
    document.body.setAttribute('ontouchstart', '');
}

},{}],74:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

(function() {
    // prepare base perf object
    if (typeof window.performance === 'undefined') {
        window.performance = {};
    }

    if (!window.performance.now) {
        var nowOffset = Date.now();
        if (window.performance.timing && window.performance.timing.navigationStart) {
            nowOffset = window.performance.timing.navigationStart;
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };

        window.performance.polyfilled = true;
    }
})();

},{}],75:[function(require,module,exports){
(function (global){
/* inspired by https://github.com/chrisdickinson/raf */
require("./performance.now.js");

module.exports = function(vendors) {
    if (vendors === undefined) {
        vendors = ['webkit', 'moz'];
    }
    var suffix = 'AnimationFrame';
    var raf = window['request' + suffix];
    var caf = global['cancel' + suffix] || global['cancelRequest' + suffix];

    for (var i = 0; i < vendors.length && !raf; i++) {
        raf = global[vendors[i] + 'Request' + suffix];
        caf = global[vendors[i] + 'Cancel' + suffix] || global[vendors[i] + 'CancelRequest' + suffix];
    }

    // Some versions of FF have rAF but not cAF
    if (!raf || !caf) {
        var last = 0,
            id = 0,
            queue = [],
            frameDuration = 1000 / 60;

        raf = function(callback) {
            if (queue.length === 0) {
                var _now = window.performance.now(),
                    next = Math.max(0, frameDuration - (_now - last));
                last = next + _now;
                setTimeout(function() {
                    var cp = queue.slice(0);
                    // Clear queue here to prevent
                    // callbacks from appending listeners
                    // to the current frame's queue
                    queue.length = 0;
                    for (var i = 0; i < cp.length; i++) {
                        if (!cp[i].cancelled) {
                            try {
                                cp[i].callback(last);
                            } catch (e) {}
                        }
                    }
                }, next);
            }
            queue.push({
                handle: ++id,
                callback: callback,
                cancelled: false
            });
            return id;
        };
        caf = function(handle) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i].handle === handle) {
                    queue[i].cancelled = true;
                }
            }
        };
    }

    window.requestAnimationFrame = raf;
    window.cancelAnimationFrame = caf;

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./performance.now.js":74}],76:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var prefixes = ["-ms-", "-moz-", "-webkit-"];
var uppercasePrefixes = ["Moz"];
var testStyle = document.createElement("div").style;

/**
 * Cross-Platform styles polyfill API.
 * The styles API resolves the implementation-specific style name from the
 * W3C compliant name.
 * Commonly used styles are included, but more may be resolved using {@link elsa.utils.styles#resolveStyle resolveStyle}.
 *
 * @class styles
 * @memberOf elsa.utils
 */
module.exports = {};

/**
 * Resolve a (possibly) prefixed css style in the current browser,
 * and add an associated entry to the {@link elsa.utils.styles} module.
 *
 * @method resolveStyle
 * @memberOf elsa.utils.styles#
 * @param  {string} compliantName - the WC3 compliant name for the style
 * @return {string}               - the implementation-specific name for the style
 */
var resolveStyle = module.exports.resolveStyle = function(compliantName) {
    var camelCompliantName = compliantName.replace(/-([a-z])/g, function(match, $1, offset, original) {
        return $1.toUpperCase();
    });
    var upperCompliantName = camelCompliantName.substr(0, 1).toUpperCase() + camelCompliantName.substr(1);

    if (compliantName in testStyle) {
        module.exports[camelCompliantName] = compliantName;
        return;
    }

    var checkPrefixes = function(prefixes, name, camelCompliantName) {
        for (var i = prefixes.length - 1; i >= 0; i--) {
            var prefixedName = prefixes[i] + name;
            if (prefixedName in testStyle) {
                module.exports[camelCompliantName] = prefixedName;
                return true;
            }
        }
    };

    var foundPrefix = checkPrefixes(prefixes, camelCompliantName, camelCompliantName) || checkPrefixes(uppercasePrefixes, upperCompliantName, camelCompliantName);
    if (!foundPrefix) {
        throw new Error("Unsupported Browser: no style support for " + compliantName + "/" + camelCompliantName);
    }
};

var transitionEndMap = {
    'transition': 'transitionend',
    'webkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend'
};

/**
 * The name of the transform CSS style property in the current browser
 * @var transform
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transform");

/**
 * The name of the transition CSS style property in the current browser
 * @var transition
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transition");

/**
 * The name of the transition-delay CSS style property in the current browser
 * @var transition-delay
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transition-delay");

/**
 * The name of the transition-duration CSS style property in the current browser
 * @var transition-duration
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transition-duration");

/**
 * The name of the transition-property CSS style property in the current browser
 * @var transition-property
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transition-property");

/**
 * The name of the transition-timing-function CSS style property in the current browser
 * @var transition-timing-function
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
resolveStyle("transition-timing-function");

/**
 * The name of the transitionend event in the current browser
 * @var transitionend
 * @readOnly
 * @memberOf elsa.utils.styles#
 */
module.exports.transitionend = transitionEndMap[module.exports.transition];

testStyle = undefined;

},{}],77:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = require('./core/module');
if (typeof window === 'object') {
    window.elsa = module.exports;
}

require('./navigation/module');
require('./controls/module');

},{"./controls/module":51,"./core/module":69,"./navigation/module":94}],78:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var types = window.elsa.compiler.elements;
var styles = window.elsa.utils.styles;
var control = types.control;

var router = require("../router");
var raf = require("./raf.js");

/**
 * Provides a global application control api, available on the elsa object as `elsa.App`.
 *
 * @class App
 *
 * @example
 * elsa.App
 */

/**
 * Elsa device instance
 * @member {App.device} device
 * @memberOf App#
 */

var routeGetName = function(route) {
    return route.split("?")[0];
};

var routeGetParams = function(route) {
    var parts = route.split("?");
    if (parts.length === 1) {
        return {};
    } else {
        return router.paramsToObject(parts[1]);
    }
};

var decodePartialRoute = function(r) {
    return [routeGetName(r), routeGetParams(r)];
};

var ids = 0;
var initialized;

var Pane;
var getProtectedPane = function(obj) {
    if (!Pane) {
        Pane = require('../controls/pane');
    }
    return Pane.getPrivate(obj).protected;
};

module.scope = {};
Object.defineProperties(module.scope, {
    "device": {
        get: function() {
            if (!this._device) {
                this._device = require("./device-detection").create();
            }
            return this._device;
        }
    },
    "testdevice": {
        value: {
            type: "narrow",
            addListener: function() {},
            removeListener: function() {}
        }
    }
});

var destroyOverride = function() {
    if (this.sceneTransitionListener) {
        document.body.lastElementChild.removeEventListener(styles.transitionend, this.sceneTransitionListener);
        this.sceneTransitionListener = undefined;
    }
    if (this.scene) {
        window.elsa.compiler.destroy(this.scene);
    }
    this.scene = undefined;

    if (initialized) {
        window.removeEventListener("hashchange", this.onhashchange, false);
        window.removeEventListener("popstate", this.onpopstate, false);

        if (module.scope._device) {
            module.scope._device.destroy();
            module.scope._device = undefined;
        }

        initialized = false;
    }
    Object.defineProperty(this.public, "destroy", {
        configurable: true,
        writable: true
    });
};

module.exports = Extend.createType({
    name: "app",

    extend: Extend.createType(control),

    /** @lends App# */
    public: {

        /**
         * The elsa router.
         * @type {elsa.core.router}
         * @property router2
         */
        router: router,

        /**
         * The elsa.App.device instance
         */
        device: {
            writable: false
        },

        /**
         * Alias to {@link App.router#registerRoutes App.router.registerRoutes}
         * @type {function}
         */
        registerRoutes: router.registerRoutes,

        /**
         * The default route of the app, which will be used for default navigation or routing errors.
         *
         * If navigateTo is called with no arguments, the app will navigate to the default route.
         *
         * If elsa.initialize() is called with no parameters and there is a default route set, the app
         * will navigate to that route.
         *
         * If there is a routing error in the app and the previous location cannot be determined,
         * the app will navigate to the default route.
         *
         * Can be set at runtime.
         * @type String
         */
        defaultroute: "",

        /**
         * Controls the debugging mode for all of the elsa controls
         *
         * Setting this value will override the current debugging mode value for all of the
         * elsa controls. Per-class overrides are only supported after this value is set.
         *
         * Supported Values:
         *     false  - debugging disabled
         *     true/1 - debugging level 1
         *     2 .. n - debugging level n
         *
         * @type {boolean|int}
         */
        debug: {
            set: function(debug) {
                this.debug = debug;
                for (var type in types) {
                    types[type].debug = debug;
                }
            }
        },

        /**
         * Testmode is a global setting that puts the framework into a mode designed for testing.
         * Enabling testmode makes the following modifications to the framework:
         *  * no core animations
         *    - pane and children
         *  * synchronous routing
         *  * history.back() is never used
         *
         * @type {Object}
         */
        testmode: {
            set: function(testmode) {
                testmode = !!testmode;
                if (this.testmode === testmode) {
                    return;
                }
                this.testmode = testmode;
                if (!this.testmodeStylesheet) {
                    document.head.insertAdjacentHTML('beforeend',
                        '<style type="text/css" disabled="true">' + require('./testmode.inc') + '</style>');
                    this.testmodeStylesheet = document.head.lastElementChild;
                }
                this.testmodeStylesheet.disabled = !testmode;
                this.updateDevice();
            }
        },

        /**
         * Update the url to reflect the current state of the app. A new history entry will be created
         * for this url, unless `replace` is `true`.
         *
         * @param {boolean} [replace=false] - If `true`, replace the current history entry instead of creating a new one
         */
        updateRoute: function(replace) {
            if (this.navigatingTo) {
                return;
            }
            var stateUrl;
            var stateFn = replace ? "replaceState" : "pushState";
            if (this.scene && this.scene.__id) {
                var compound = getProtectedPane(this.scene).getCompoundRoute();
                this.updateRoute(stateFn, compound, undefined, 'navigation');
            } else {
                stateUrl = window.location.href.substr(0, window.location.href.indexOf('#')) + '#';
                if (window.location.href !== stateUrl) {
                    if (this.public.debug) {
                        console.log("App.updateRoute " + stateFn + " ''");
                    }
                    if (stateFn === "pushState") {
                        this.state = {
                            prev: window.location.hash.slice(1),
                            index: this.state.index + 1
                        };
                    }

                    window.history[stateFn](this.state, 'app:///', stateUrl);
                }
                this.navigatingTo = "";
            }
        },

        /**
         * Navigate to a routable. If designing an adaptive application, use the page's {@link page#navigateTo navigateTo} API instead, as Elsa needs to know which page you navigate from.
         *
         * @example
         *  elsa.App.navigateTo("bar-demo"); // will push the "bar-demo" page on top of "welcome" (relative navigation)
         *  elsa.App.navigateTo("/bar-demo"); // will replace "welcome" with "bar-demo" (absolute navigation)
         *
         * @param {string} [route] - A string representing the user's location within the application
         * @param {boolean} [replace] - If `true`, replace the current history entry instead of creating a new one.
         */
        navigateTo: function(route, replace) {
            /* TODO: make this async, eg:
             * module.exports.requestAnimationFrame(this, function() {}); */
            this.navigateTo(route, undefined, replace, 'navigation');
        },

        /**
         * The top-level control that is the root of the application layout, and is placed direcetly
         * in the `<body>` element.
         *
         * When a new scene is set, the previous scene will be automatically deleted.
         *
         * Once the new scene has been rendered, the active pane will recieve the page#visible event.
         *
         * @type pane
         */
        scene: {
            set: function(scene) {
                if (scene && scene instanceof window.DocumentFragment) {
                    if (scene.childElementCount !== 1) {
                        throw TypeError("scene must be 1 DOM node");
                    } else {
                        scene = scene.firstElementChild;
                    }
                }
                scene = scene || undefined;
                if (scene && !scene.__id) {
                    console.error("Unable to set uninstantiated scene");
                    return;
                }
                if (scene !== this.scene) {
                    if (this.public.debug > 1) {
                        console.log("APP.scene.set begin");
                    }
                    if (scene) {
                        if (types.page.prototype.isPrototypeOf(scene)) {
                            var stack = document.createElement('el-stack');
                            stack.appendChild(scene);
                            stack.setAttribute('default-route', scene.routename);
                            types.stack.create(stack, {
                                require: getProtectedPane(scene).require,
                                sourcepath: getProtectedPane(scene).sourcepath,
                            });
                            stack.publish('creationCompleted');
                            scene = stack;
                        }
                        if (!this.scene) {
                            scene.classList.add("el-fade-out");
                        }
                        if (this.scene && this.scene.parentElement === document.body) {
                            document.body.insertBefore(scene, this.scene);
                        } else {
                            document.body.appendChild(scene);
                        }
                    }


                    var self = this;
                    var transitionScene = (this.scene || scene);
                    this.oldscene = this.scene;
                    this.scene = scene;


                    // fade out old scene
                    var debug = self.public.debug;
                    var oldscene = this.oldscene,
                        oldId;
                    var sceneTransitionListener = function(e) {
                        if (e.propertyName === "opacity") {
                            transitionScene.removeEventListener(styles.transitionend, sceneTransitionListener);
                            if (debug > 1) {
                                console.log("APP.scene.transitionend", "==> " + oldscene.routename);
                            }

                            var idx = self.sceneTransitionListeners.indexOf(sceneTransitionListener);
                            if (idx !== -1) {
                                self.sceneTransitionListeners.splice(idx, 1);
                            }

                            self.sceneTransitionEnd(oldscene);
                            if (idx > 0) {
                                self.sceneTransitionListeners[idx - 1](e);
                            }
                        }
                    };

                    if (oldscene) {
                        this.sceneTransitionListeners.push(sceneTransitionListener);
                        //if (scene === transitionScene && scene.classList.contains("el-fade-out")) {
                        if (oldscene.classList.contains("el-fade-out")) {
                            if (this.public.debug > 2) {
                                console.log("APP.scene.no-transition", oldscene.routename + " ==> " + (scene ? scene.routename : ""));
                            }
                            sceneTransitionListener({
                                propertyName: "opacity"
                            });
                        } else {
                            if (this.public.debug > 2) {
                                console.log("APP.scene.transition", oldscene.routename + " ==> " + (scene ? scene.routename : ""));
                            }
                            transitionScene.addEventListener(styles.transitionend, sceneTransitionListener);
                        }
                        oldscene.classList.add("el-fade-out");
                        /*if (this.sceneTransitionListeners.length > 1) {
                            var self = this;
                            setTimeout(function() {
                                var idx = self.sceneTransitionListeners.indexOf(sceneTransitionListener);
                                if (idx !== -1) {
                                    self.sceneTransitionListeners.shift()({
                                        propertyName : "opacity"
                                    });
                                }
                            });
                        }*/
                    } else if (this.public.debug > 2) {
                        console.log("APP.scene.skiptransition", "==> " + (scene ? scene.routename : ""));
                    }
                    this.sceneRafId = this.public.requestUniqueAnimationFrame(this, "scene", this.sceneNavigationFrame, [scene, oldscene]);

                    if (this.public.debug > 1) {
                        console.log("APP.scene.set end");
                    }
                }
                if (!this.navigatingTo) {
                    this.public.updateRoute();
                }
            }
        },

        /**
         * The currently active page in the application, or undefined if one is not present.
         * For a drawer, this will be the active item. For a stack this will be the top page.
         *
         * @type page
         * @readonly
         */
        activePage: {
            get: function() {
                if (this.scene) {
                    var top;
                    if (this.scene.tagName === "EL-DRAWER") {
                        if (this.scene.activeItem) {
                            return this.scene.activeItem.stack.top;
                        }
                    } else if (this.scene.tagName === "EL-STACK") {
                        return this.scene.top;
                    } else {
                        return this.scene;
                    }
                } else {
                    return undefined;
                }
            }
        },

        /**
         * The current route
         *
         * @type string
         * @readonly
         */
        currentRoute: {
            get: function() {
                if (this.navigatingTo) {
                    var r = this.navigatingTo;
                    if (r[0] !== '/') {
                        r = '/' + r;
                    }
                    return r;
                }
                if (!this.scene || !this.scene.__id) {
                    return "";
                }
                var compound = getProtectedPane(this.scene).getCompoundRoute();
                if (compound.length === 0) {
                    return "";
                }
                return '/' + router.compoundRouteToString(compound);
            }
        },

        /**
         * The previous route at the user's previous location, or an empty string if the previous roue is not known.
         *
         * @type string
         * @readonly
         */
        previousRoute: {
            get: function() {
                if (this.navigatingTo) {
                    if (this.scene && this.scene.__id) {
                        var compound = getProtectedPane(this.scene).getCompoundRoute();
                        if (compound.length !== 0) {
                            return '/' + router.compoundRouteToString(compound);
                        }
                    }
                    return "";
                }
                return this.state ? this.state.prev : "";
            }
        },

        /**
         * Add an event listener to the App's event bus
         *
         * @param {string} type - The event type
         * @param {function} listener - The listener to be called when the specified event is fired
         * @param {boolean} useCapture - If `true`, events from child nodes should be captured
         */
        addEventListener: function(type, listener, useCapture) {
            return document.body.addEventListener(type, listener, useCapture);
        },

        /**
         * Remove an event listener from the App's event bus
         *
         * @param {string} type - The event type
         * @param {function} listener - The listener to be called when the specified event is fired
         * @param {boolean} useCapture - If `true`, events from child nodes should be captured
         */
        removeEventListener: function(type, listener, useCapture) {
            return document.body.removeEventListener(type, listener, useCapture);
        },

        /**
         * Initializes the elsa application framework.
         * The defaultroute will be used when the app is first loaded or if fatal routing errors occur.
         *
         * @param {String} route - a route to set as the defaultroute for the application
         */
        initialize: function() {
            var startTime = window.performance && window.performance.now && window.performance.timing ?
                (window.performance.now() + window.performance.timing.navigationStart) :
                Date.now(),
                endTime;

            if (module.exports.debug) {
                console.log("elsa.start", startTime); //signal for start time metrics
            }

            if (!initialized) {
                window.addEventListener("hashchange", this.onhashchange, false);
                window.addEventListener("popstate", this.onpopstate, false);

                this.updateDevice();
                if (initialized === undefined) {
                    require("../../core/polyfill");
                    require("./viewport")();
                }
                if (!this.testmodeStylesheet) {
                    document.head.insertAdjacentHTML('beforeend',
                        '<style disabled="true">' + require('./testmode.inc') + '</style>');
                    this.testmodeStylesheet = document.head.lastElementChild;
                    this.testmodeStylesheet.disabled = !this.testmode;
                }
                initialized = true;
            }
            var callArguments = arguments;
            var rootModules = [],
                args = {},
                mod;
            if (typeof callArguments[0] === "undefined" && module.exports.defaultroute === "") {
                throw new Error("App.defaultroute hasn't been set, and no route passed to elsa.initialize()");
            } else if (typeof callArguments[0] === "string") {
                module.exports.defaultroute = callArguments[0];
                callArguments = Array.prototype.slice.call(callArguments, 1);
            }

            if (Array.isArray(callArguments[0] === true)) {
                rootModules = callArguments[0];
                args = callArguments[1];
            } else if (typeof callArguments[0] === "function") {
                rootModules.push(callArguments[0]);
            } else {
                var map = callArguments[0];
                var idMap = {};
                for (var name in map) {
                    mod = map[name];
                    map[name] = {
                        path: mod.sourcepath,
                        href: name,
                        name: name
                    };
                    idMap[name] = mod;
                    rootModules.push(mod);
                }
                router.registerRoutes(map, function(id) {
                    return idMap[id];
                });
            }

            var routesByName = {},
                modulesById = {};
            rootModules.forEach(function(item) {
                var route = router.getRouteForPath(item.sourcepath);
                if (!route) {
                    var href = 'scene' + ids++;
                    route = {
                        name: href,
                        path: item.sourcepath,
                        href: href
                    };
                    routesByName[route.name] = route;
                    modulesById[route.path] = item;
                }
            });

            router.registerRoutes(routesByName, function(id) {
                return modulesById[id];
            });

            if (callArguments.length > 1) {
                module.exports.defaultroute = module.exports.defaultroute || callArguments[1];
            } else if (rootModules.length > 0) {
                module.exports.defaultroute = module.exports.defaultroute || router.getRouteForPath(rootModules[0].sourcepath).name;
            }

            if (module.exports.debug > 1) {
                console.log("elsa.App.defaultroute", module.exports.defaultroute);
            }

            if (window.location.hash === "" && rootModules.length > 0) {
                module.exports.navigateTo(undefined, undefined, true, 'hashchange');
            } else {
                module.exports.navigateTo(window.location.hash.replace(/^#/, ""), undefined, false, 'hashchange');
            }

            if (module.exports.debug) {
                endTime = window.performance && window.performance.now && window.performance.timing ?
                    (window.performance.now() + window.performance.timing.navigationStart) :
                    Date.now();
                console.log("elsa.end", endTime); //signal for start time metrics
            }
        }
    },

    private: {

        updateDevice: function() {
            var olddev = this.device;
            this.device = module.scope[this.testmode ? "testdevice" : "device"];
            if (olddev !== this.device && olddev === module.scope._device) {
                olddev.destroy();
                module.scope._device = undefined;
            }
            if (this.testmode) {
                document.body.classList.remove("wide", "wider", "widest");
                document.body.classList.add("narrow");
            } else if (this.device.type !== "narrow") {
                document.body.classList.remove("narrow");
                document.body.classList.add(this.device.type);
            }
        },

        sceneNavigationFrame: function(scene, oldScene) {
            this.sceneRafId = undefined;

            if (!oldScene && scene) {
                scene.classList.remove("el-fade-out");
            }

            if (scene && scene.__id) {
                getProtectedPane(scene).visible();
            }
        },

        sceneTransitionEnd: function(scene) {
            if (scene && scene.parentElement === document.body) {
                // `scene` is the old scene, destroy TODO: support pooling
                document.body.removeChild(scene);
                if (typeof scene.destroy === "function") {
                    window.elsa.compiler.destroy(scene);
                }
                if (scene === this.oldscene) {
                    this.oldscene = undefined;
                }
            }
        },

        navigateTo: function(routeString, referrer, replace, source) {
            /* guard */
            if (this.navigatingTo) {
                return 1;
            }
            var originalRoutes = [];
            routeString = routeString || "";

            if (this.scene && !this.scene.__id) {
                this.scene = undefined;
            }

            if (this.scene) {
                originalRoutes = getProtectedPane(this.scene).getCompoundRoute();
            } else if (referrer) {
                originalRoutes = referrer.split("/").map(decodePartialRoute);
            }

            /* input validation */
            var valid = this.processRouteInput(routeString, replace, originalRoutes);
            replace = valid.replace;
            routeString = valid.routeString;

            //TODO: Fire $routeChangeStart event, allow the route to be manipulated
            // check for empty...
            // do the input validation above again
            var oldroute = router.compoundRouteToString(originalRoutes);
            var event = new CustomEvent('navigation', {
                cancelable: true,
                bubbles: true,
                detail: routeString
            });
            event.oldRoute = oldroute;
            event.newRoute = routeString;
            if (!document.body.dispatchEvent(event)) {
                return 1;
            } else if (event.newRoute !== routeString) {
                valid = this.processRouteInput(routeString, replace, originalRoutes);
                replace = valid.replace;
                routeString = valid.routeString;
            }


            this.navigatingTo = routeString;
            var routes = routeString.split("/");
            var sameScene = false;
            var skipUpdate = false;

            try {
                if (routes[0] === "") {
                    routes.shift();
                }
                var lastRoute = routes[routes.length - 1];
                if (!lastRoute) {
                    routes.pop();
                }

                if (routes.length === 0) {
                    this.public.scene = undefined;
                    return;
                }
                routes = routes.map(decodePartialRoute);

                var sceneRoute = routes[0];
                if (this.scene) {
                    originalRoutes = getProtectedPane(this.scene).getCompoundRoute();
                    if (this.scene.routename === sceneRoute[0]) {
                        sameScene = true;
                    } else {
                        var originalRoute = originalRoutes[0];
                        sameScene = originalRoute && originalRoute[0] === sceneRoute[0];
                    }
                } else if (referrer) {
                    originalRoutes = referrer.split("/").map(decodePartialRoute);
                }

                if (this.public.debug) {
                    console.log("App.navigateTo", "/" + routes.map(function(m) {
                        return Object.getOwnPropertyNames(m[1]).length > 0 ? (m[0] + "?" + router.objectToParams(m[1])) : m[0];
                    }).join("/"), referrer ? "[" + referrer + "]" : "");
                }

                if (sameScene) {
                    // we can re-use the existing scene
                    if (this.public.debug > 1) {
                        console.log("App.navigateTo reusing scene " + this.scene.routename);
                    }
                    var protectedScene = getProtectedPane(this.scene);
                    protectedScene.setCompoundRoute({
                        route: routes,
                        index: 0,
                        source: this.testmode ? 'hashchange' : source
                    });
                } else {
                    // TODO:fix
                    // we need ot lookup a module globally by routename
                    var scene = router.loadModule(sceneRoute[0], sceneRoute[1], this.public, routes);
                    if (!scene) {
                        throw router.RouteErrorEvent.create("routeerror", {
                            cancelable: true,
                            bubbles: true
                        }, {
                            source: document.body,
                            head: "",
                            route: sceneRoute[0],
                            state: sceneRoute[1],
                            message: "Unable to find module for route: " + sceneRoute[0]
                        });
                    }
                    if (scene instanceof window.DocumentFragment) {
                        if (scene.childElementCount !== 1) {
                            throw TypeError("scene must be 1 DOM node");
                        } else {
                            scene = scene.firstElementChild;
                        }
                    }
                    /* automatically put a page in a stack */
                    if (types.page.prototype.isPrototypeOf(scene)) {
                        var defaultroute = routeString && routeString[0] === '/' ? routeString.slice(1) : routeString;
                        var stack = document.createElement('el-stack');
                        stack.setAttribute('data-defaultroute', defaultroute);
                        stack.appendChild(scene);
                        stack = types.stack.create(stack);
                        stack.publish("creationCompleted");
                        stack.defaultroute = module.exports.defaultroute;
                        scene = stack;
                    }
                    this.public.scene = scene;
                    if (module.exports.debug) {
                        console.log("App.sceneCreated");
                    }
                    scene.publish('route', routes);
                }
            } catch (e) {
                if (router.RouteErrorEvent.prototype.isPrototypeOf(e)) {
                    var src = e.source || document.body;
                    var result = src.dispatchEvent(e);
                    if (result) {
                        //window.location.hash = "#";
                        if (this.state && this.state.prev && replace) {
                            window.history.back();
                        } else if (originalRoutes.length > 0) {
                            //window.location.hash = "#" + router.compoundRouteToString(originalRoutes);
                            var r = router.compoundRouteToString(originalRoutes);
                            var stateUrl = window.location.href.substr(0, window.location.href.indexOf('#')) + '#/' + r;
                            window.history.replaceState(this.state, "app://" + r, stateUrl);
                        } else {
                            window.location.hash = "#";
                        }
                        throw e;
                    } else {
                        skipUpdate = true;
                    }
                } else {
                    console.warn(e.stack);
                    throw e;
                }
            } finally {
                if (!skipUpdate) {
                    var pushState = !sameScene;
                    routes = (this.scene && this.scene.__id) ? getProtectedPane(this.scene).getCompoundRoute() : [];
                    if (replace) {
                        pushState = false;
                    } else if (replace === false) {
                        pushState = true;
                    } else if (sameScene && originalRoutes.length === routes.length) {
                        pushState = !routes.every(function(route, index) {
                            return route[0] === originalRoutes[index][0];
                        });
                    }
                    this.updateRoute(pushState ? "pushState" : "replaceState", routes, referrer, source);
                }

                this.navigatingTo = undefined;
                if (this.scene && this.scene.__id && this.scene.tagName === "EL-STACK") {
                    this.scene.publish("visible");
                }
            }
        },

        updateRoute: function(stateFn, compound, referrer, source) {
            var route = router.compoundRouteToString(compound);
            if (route.length > 0) {
                route = "/" + route;
            }
            var hash = window.location.hash.slice(1);

            if (referrer === route) {
                if (hash === route) {
                    return;
                } else {
                    stateFn = "replaceState";
                }
            }

            var stateUrl = window.location.href.substr(0, window.location.href.indexOf('#')) + '#' + route;
            var urlchanged = window.location.href !== stateUrl;
            if (urlchanged) {
                if (this.public.debug) {
                    console.log("App.updateRoute " + stateFn, route);
                }

                if (stateFn === "pushState") {
                    this.state = {
                        prev: hash,
                        index: this.state.index + 1
                    };
                }

                /* TODO: is this needed */
                window.history[stateFn](this.state, 'app://' + route, stateUrl);
            }

            if (urlchanged || source === "hashchange") {
                var event = new CustomEvent('urlchange', {
                    cancelable: false,
                    bubbles: true,
                    detail: route
                });
                event.oldRoute = hash;
                event.currentRoute = route;
                document.body.dispatchEvent(event);
            }
        },

        processRouteInput: function(routeString, replace, originalRoutes) {
            if (!routeString) {

            } else if (routeString[0] !== "/") {
                replace = (window.location.hash === "#" + routeString);

                var currentRouteString = router.compoundRouteToString(originalRoutes);
                routeString = currentRouteString + '/' + routeString;
            } else {
                replace = (window.location.hash === "#" + routeString);
            }

            if (!routeString || routeString === "/") {
                replace = window.location.hash === "#" + routeString;
                routeString = this.defaultroute || "";
            }
            return {
                replace: replace,
                routeString: routeString
            };
        },

        hashchange: function(e) {
            var referrer;
            var idx = e.newURL.indexOf("#") + 1;
            if (idx > 0 && e.oldURL.slice(0, idx) === e.newURL.slice(0, idx)) {
                referrer = e.oldURL.slice(idx);
            } else {
                idx = e.oldURL.indexOf("#");
                referrer = idx === -1 ? "" : e.oldURL.slice(idx);
            }

            if (!this.popstate) {
                this.state = {
                    prev: referrer,
                    index: 0
                };
            }
            this.popstate = undefined;

            if (this.debug > 1) {
                console.log("App.onhashchange", this.state);
            }
            var route = e.newURL.slice(idx);
            this.navigateTo(route === "/" ? "" : route, referrer, undefined, 'hashchange');
        }
    },

    init: function(scene) {
        this.scene = undefined;
        this.state = {
            prev: "",
            index: 0
        };

        var self = this;
        this.device = module.scope.testdevice;
        this.onhashchange = function(e) {
            return self.hashchange(e);
        };
        this.onpopstate = function(e) {
            if (e.state) {
                self.state = e.state;
                self.popstate = true;
                if (self.public.debug > 1) {
                    console.log("App.onpopstate", self.state);
                }
            }
        };
        this.sceneTransitionListeners = [];

        Object.defineProperty(this.public, "destroy", {
            configurable: true,
            value: destroyOverride.bind(this)
        });
    },

    destroy: function() {
        // we use the destroyOverride instead
    }
}).create();

Object.defineProperties(module.exports, {
    requestAnimationFrame: {
        value: raf.requestAnimationFrame
    },
    cancelAnimationFrame: {
        value: raf.cancelAnimationFrame
    },
    requestUniqueAnimationFrame: {
        value: raf.requestUniqueAnimationFrame
    },
    /**
     * Destroys the currently running elsa application and stops all event processing.
     * You will have to call elsa.initialize() before using elsa agian.
     * @method destroy
     * @memberOf App#
     */
    destroy: {
        configurable: true,
        writable: true
    }
});

},{"../../core/polyfill":72,"../controls/pane":91,"../router":97,"./device-detection":79,"./raf.js":80,"./testmode.inc":81,"./viewport":82}],79:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;

/*var screens = {
    "(max-width: 768px)": "narrow",
    "(max-width: 1199px) and (min-width: 769px)": "wide",
    "(min-width: 1200px)": "wider"
};*/

var screens = {
    "(max-width: 769px), (orientation: portrait)": "narrow",
    "(max-width: 1031px) and (min-width: 770px) and (orientation: landscape)": "wide",
    "(max-width: 1293px) and (min-width: 1032px) and (orientation: landscape)": "wider",
    "(min-width: 1294px) and (orientation: landscape)": "widest"
};

var listeners = [],
    queryListArr = [];

/**
 * Provides device information as well as screen adaptability helpers
 *
 * Uses matchmedia to match media queries to device types and resize events, removing the need for individual controls to listen to resize events
 *
 * Device sizes and layouts
 *
 * 1du = 4.37px
 *
 * d (drawer: min-width) = 55du
 * s (1 page in the stack: min-width) = 60du
 *
 * Narrow (min-width: 1s; closed drawer, 1 pane)
 *  - portrait
 *  - landscape
 *
 *
 * Wide (min-width: d + 2s; open drawer, 2 panes)
 *  - min-width:769px landscape
 *
 *
 * Wider (min-width: d + 3s; open drawer, 3 panes)
 *  - min-width:1031px landscape
 *
 *
 * Widest (min-width: d + 4s; open drawer, 4 panes)
 * - min-width:1293px landscape
 *
 * @class device
 * @memberOf App
 *
 * @example
 * elsa.App.device
 */

var device = {

    name: 'App.device',

    /** @lends App.device# */
    public: {

        /**
         * type - returns device type based on current resolution and settings provided
         * (one of "narrow", "wide", "wider", "widest")
         *
         * @type {string}
         * @memberOf App.device#
         * @readonly
         * @example elsa.App.device.type //returns "narrow", "wide" or "wider" or "widest"
         */
        type: {
            writable: false
        },

        /**
         * addListener adds function to listeners list
         * @example
         * elsa.App.device.addListener(function(type) {
         *     // type
         * });
         * @param {function} callback function - callback function to be called when the device type has changed
         */
        addListener: {
            value: function(fn) {
                listeners.push(fn);
            }
        },

        /**
         * removeListener removes function from listeners list
         * @example
         * elsa.App.device.removeListener(adapt);
         * @param {function} callback function - callback function to be called when the device type has changed
         */
        removeListener: {
            value: function(fn) {
                for (var count = 0; count < listeners.length; count++) {
                    if (fn === listeners[count]) {
                        listeners[count] = undefined;
                    }
                }
            }
        },
    },

    private: {
        setDevice: function(query, matchesOnly) {
            if (query.matches) {
                this.type = screens[query.media];
                document.body.classList.add(this.type);
                console.log("deviceDetection.type", this.type);
            } else {
                document.body.classList.remove(screens[query.media]);
            }

            if (query.matches) {
                this.executeMatches(listeners, this.type);
            }
        },

        executeMatches: function(listeners, type) {
            for (var count = 0; count < listeners.length; count++) {
                if (typeof listeners[count] === "function") {
                    listeners[count](type);
                }
            }
        }
    },

    init: function() {
        this.boundSetDevice = this.setDevice.bind(this);
        for (var screen in screens) {
            var queryList = window.matchMedia(screen);
            screens[queryList.media] = screens[screen];
            this.setDevice(queryList, true);
            queryList.addListener(this.boundSetDevice);
            queryListArr.push(queryList);
        }
        return this;
    },

    destroy: function() {
        for (var count = 0; count < queryListArr.length; count++) {
            queryListArr[count].removeListener(this.boundSetDevice);
        }
        queryListArr = [];
        this.boundSetDevice = undefined;
    }
};

if (typeof module !== "undefined") {
    module.exports = Extend.createType(device);
} else {
    //for testing
    window.device = Extend.createType(device);
}

},{}],80:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


var pendingAnimationFrame;
var pendingCallbacks;

var handleAnimationFrame = function(timeStamp) {
    var callbacks = pendingCallbacks || [];
    pendingAnimationFrame = undefined;
    pendingCallbacks = undefined;

    var len = callbacks.length;
    var args = [timeStamp];
    for (var i = 0; i < len; i++) {
        var cb = callbacks[i];
        cb.callback.apply(cb.self, cb.arguments ? cb.arguments.concat(args) : args);
    }
};

/**
 * @lends App#
 */
module.exports = {

    /**
     * We want to use this over window.requestAnimationFrame for a few reasons
     *
     * 1) synchronize multiple raf calls from multiple classes
     * 2) Stop classes from having to track in-progress raf ids
     * 3) Stop classes from having to create bound funtions for callbacks
     *
     * @param {Object} self
     * @param {Object} callback
     * @param {Object} args
     */
    requestAnimationFrame: function(self, callback, args) {
        if (arguments.length === 1) {
            args = callback;
            callback = self;
            self = window;
        }

        var cb = {
            callback: typeof callback === 'function' ? callback : self[callback],
            self: self,
            arguments: args
        };
        if (pendingAnimationFrame) {
            pendingCallbacks.push(cb);
        } else {
            pendingAnimationFrame = window.requestAnimationFrame(handleAnimationFrame);
            pendingCallbacks = [cb];
        }
        // Currenty we support 64 pending callbacks per frame
        return (pendingAnimationFrame << 6) | (pendingCallbacks.length & 0x3f);
    },

    /**
     * Cancel animation frame callbacks previously registered.
     * Supports either rafId or self parameters exclusively.
     * Passing self will remove all pending animation frame callbacks bound to self.
     *
     * @param  {number|object} param - number (rafId) result of previous calls to requestAnimationFrame or requestUniqueAnimationFrame OR bound object (self) used in previous calls to requestAnimationFrame or requestUniqueAnimationFrame
     */
    cancelAnimationFrame: function(arg) {
        if (!pendingAnimationFrame) {
            return;
        }
        if (typeof arg === "number") {
            var rafId = arg >> 6;
            var index = (arg & 0x3F) - 1;
            if (pendingAnimationFrame === rafId) {
                pendingCallbacks.splice(index, 1);
                if (pendingCallbacks.length === 0) {
                    window.cancelAnimationFrame(pendingAnimationFrame);
                    pendingAnimationFrame = undefined;
                }
            }
        } else {
            for (var i = pendingCallbacks.length - 1; i >= 0; i--) {
                var cb = pendingCallbacks[i];
                if (cb.self === arg) {
                    pendingCallbacks.splice(i, 1);
                }
            }
        }

    },

    /**
     * Utility method that tracks RAF calls. The array of active RAF calls
     * can then be used to clean up properly if the stack is destroyed mid RAF.
     *
     * @param  {object}   self     bound object for callback
     * @param  {string}   name     unique identifier
     * @param  {Function} callback raf callback function
     * @param  {Array}    args     arguments to pass to callback
     * @return {number}            unique id
     */
    requestUniqueAnimationFrame: function(self, name, callback, args) {
        var cb = {
            callback: typeof callback === 'function' ? callback : self[callback],
            self: self,
            arguments: args,
            uid: name
        };
        if (pendingAnimationFrame) {
            for (var i = pendingCallbacks.length - 1; i >= 0; i--) {
                var cbI = pendingCallbacks[i];
                if (cbI.uid === name && cbI.self === self) {
                    pendingCallbacks[i] = cb;
                    return (pendingAnimationFrame << 6) + i + 1;
                }
            }
            pendingCallbacks.push(cb);
        } else {
            pendingAnimationFrame = window.requestAnimationFrame(handleAnimationFrame);
            pendingCallbacks = [cb];
        }

        // Currenty we support 64 pending callbacks per frame
        return (pendingAnimationFrame << 6) + pendingCallbacks.length;
    }
};

},{}],81:[function(require,module,exports){
module.exports = "el-dialog,\nel-drawer, .el-drawer-items, el-drawer::after\nel-page, el-page::after,\nel-stack, el-stack::after,\nel-toast,\nel-toggle, .el-toggle-switch,\n.el-overlay,\n.el-overflow-menu, .el-overflow-menu-container, .el-overflow-menu-wrapper,\n.el-swipe-container,\n.el-tabs-nav-item,\n.el-signature-action-bg, .el-signature-action-wrapper, .el-signature-action-overlay,\nbutton, .btn, .btn-danger, .btn-success, .btn-warning, .btn-primary {\n    transition: 0.001ms linear !important;\n}\n\nel-action, .el-action {\n    transition-duration: 0.001ms !important;\n    transition-delay: 0ms !important;\n}\n\nel-page {\n    background-color: lightgrey !important;\n}\n\nel-page.animate-in, el-page.animate-out,\n.el-modal-container.animate-in, .el-modal-container.animate-out,\n.el-modal-inner-container.animate-in, .el-modal-inner-container.animate-out,\n.el-modal-overlay.animate-in, .el-modal-overlay.animate-out {\n    transition-duration: 0.001ms !important;\n    transition-delay: 0ms !important;\n}";

},{}],82:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = function() {

    var metaString = "";
    var REFERENCE = {
        "width": "device-width",
        "initial-scale": 1.0,
        "maximum-scale": 1.0,
        "user-scalable": "no"
    };

    for (var prop in REFERENCE) {
        var content = REFERENCE[prop];
        metaString += prop + "=" + content + ", ";
    }

    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", metaString.substring(0, metaString.length - 2));
    document.head.appendChild(meta);

};

},{}],83:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var styles = window.elsa.utils.styles;

var App = require("../../app/app.js");
var router = require("../../router");
var path = require("path");
var types = window.elsa.compiler.elements;
var OverlayTouch = require("../../../shared/overlayTouch.js");

var Pane;
var getProtectedPane = function(obj) {
    if (!Pane) {
        Pane = require("../pane");
    }
    return Pane.getPrivate(obj).protected;
};

var getProtectedStackFromItem = function(active) {
    if (active) {
        return getProtectedPane(active.stack);
    }
};

/**
 * Provides a top-level navigation element, with a side-menu. Side menu is revealed using the "drawer button" defined in {@link bar bar}.
 * The drawer maintains a unique navigation stack for each of its {@link draweritem draweritems}.
 *
 * Note: By default, draweritems will not display their icons. To display icons, add "with-icons" class to drawer (see demos below).
 *
 * @el control
 * <el-drawer routename="mydrawer">
 *      <nav>
 *      </nav>
 * </el-drawer>
 *
 * @class drawer
 * @extends pane
 * @fires drawer#statechange
 *
 * @demo
 * <caption>Drawer with two drawer items</caption>
 * <template name="drawer.html">
 * <el-drawer>
 *      <nav>
 *          <el-draweritem data-label="Home" data-defaultroute="home"></el-draweritem>
 *          <el-draweritem data-label="About" data-defaultroute="about"></el-draweritem>
 *      </nav>
 * </el-drawer>
 * </template>
 * <template name="home.html" routename="home">
 * <el-page>
 *      <el-page-content>
 *          <p>Click on the drawer button to open it</p>
 *      </el-page-content>
 *      <el-bar data-drawerbutton="auto">
 *      </el-bar>
 * </el-page>
 * </template>
 * <template name="about.html" routename="about">
 * <el-page>
 *      <el-page-content>
 *          <p>Click on the drawer button to open it</p>
 *      </el-page-content>
 *      <el-bar data-drawerbutton="auto">
 *      </el-bar>
 * </el-page>
 * </template>
 *
 * @demo
 * <caption>Drawer with icons and header (centered)</caption>
 * <template name="drawer.html">
 * <el-drawer class="with-icons">
 *      <nav>
 *          <div class="el-flex el-grow"></div>
 *          <el-header data-label="Categories"></el-header>
 *          <el-draweritem data-iconclass="fa fa-home" data-label="Home" data-defaultroute="home"></el-draweritem>
 *          <el-draweritem data-iconclass="fa fa-info" data-label="About" data-defaultroute="about"></el-draweritem>
 *          <div class="el-flex el-grow"></div>
 *      </nav>
 * </el-drawer>
 * </template>
 * <template name="home.html" routename="home">
 * <el-page>
 *      <el-page-content>
 *          <p>Click on the drawer button to open it</p>
 *      </el-page-content>
 *      <el-bar data-drawerbutton="auto">
 *      </el-bar>
 * </el-page>
 * </template>
 * <template name="about.html" routename="about">
 * <el-page>
 *      <el-page-content>
 *          <p>Click on the drawer button to open it</p>
 *      </el-page-content>
 *      <el-bar data-drawerbutton="auto">
 *      </el-bar>
 * </el-page>
 * </template>
 */

var itemSelectorBase = "el-drawer > :not(.el-drawer-items) ";

module.exports = {

    name: "drawer",

    extend: Extend.createType(require("../pane")),

    tagName: "el-drawer",

    /** @lends drawer# */
    public: {

        itemSelector : "el-draweritem",

        /**
         * The draweritems present in this drawer
         * @readonly
         * @type HTMLCollection
         */
        items: {
            get: function() {
                return this.public.querySelectorAll(itemSelectorBase + this.itemSelector);
            }
        },

        /**
         * The currently active draweritem.
         * @type draweritem
         */
        activeItem: {
            set: function(item) {
                var activeItemRoute;
                if (this.navigating) {
                    console.warn("elsa.drawer: unable to set active item during a routing operation to " + (item && item.routename));
                    return;
                } else if (item === this.activeItem) {
                    return;
                } else if (!item) {
                    var previous = this.activeItem;
                    this.activeItem = undefined;
                    activeItemRoute = undefined;
                    App.requestAnimationFrame(this, function() {
                        previous.stack.classList.add("el-hidden");
                        previous.classList.remove("active-item");
                    });
                } else {
                    var itemIndex = Array.prototype.slice.apply(this.public.items).indexOf(item);
                    if (itemIndex === -1) {
                        this.public.querySelector("nav").appendChild(item);
                    }
                    this.setActiveItem(item, {
                        invisible: !this.public.visible
                    });
                    activeItemRoute = this.activeItem.stateid;
                }

                this.protected.pushState({
                    "item": activeItemRoute
                }, true);
            }
        },

        /**
         * Controls how the drawer adapts to larger/wider screens.
         * Default "auto" is equivalent to open.
         *
         * Allowed Values: "closed", "compact", "open", "auto"
         * @type string
         */
        mode: {
            set: function(value) {
                value = value.toLowerCase();
                if (['closed', 'compact', 'open', 'auto'].indexOf(value) === -1) {
                    return;
                }
                this.items.classList.remove('el-drawer-mode-' + this.mode);
                this.items.classList.add('el-drawer-mode-' + value);
                this.mode = value;
            }
        },

        /**
         * Controls the visible appearance of the drawer (open/closed).
         *
         * Note: When the drawer mode is "compact", "closed" means that the
         * drawer is in the compact state.
         *
         * Allowed Values: "closed", "opened"
         * @type string
         */
        visualState: {
            set: function(value) {
                if (value === "toggle") {
                    value = this.visualState === "open" ? "closed" : "open";
                }
                var self = this;
                if (value === "open") {
                    if (this.opened) {
                        return;
                    }

                    App.requestAnimationFrame(this, function() {
                        this.items.classList.add("el-overlay");
                        this.public.classList.add("pre-open");
                        App.requestAnimationFrame(this, function() {
                            this.overlayTouch.enableOverlayTouch(this.items, this.nav);
                            this.items.classList.add("fade-in");
                            this.public.classList.add("open");
                        });
                    });

                    this.opened = true;
                } else {
                    if (!this.opened) {
                        return;
                    }
                    var te = function(e) {
                        if (e.propertyName !== styles.transform) {
                            return;
                        }
                        this.removeEventListener(styles.transitionend, te);
                        if (!self.public) {
                            return;
                        }

                        self.items.classList.remove("el-overlay");
                        self.public.classList.remove("pre-open");
                    };
                    this.public.addEventListener(styles.transitionend, te);
                    this.items.classList.remove("fade-in");
                    this.public.classList.remove("open");
                    this.overlayTouch.disableOverlayTouch();
                    this.opened = false;
                }
                this.removeFocus();
                this.visualState = value;
            }
        },

        /**
         * Add an item to the drawer. The item will not have an associated stack created until
         * it becomes active.
         *
         * @param {draweritem} item - the item to add
         */
        addItem: function(item) {
            this.nav.appendChild(item);
        },

        /**
         * Remove an item from the drawer. The item's associated stack will also be destroyed.
         */
        removeItem: function(item) {
            this.nav.removeChild(item);
            item.stack.pop(Array.prototype.slice.call(item.stack.children));
        }
    },

    protected: {
        getCompoundRoute: function() {
            var myroute = this.super.protected("getCompoundRoute")[0];
            var active = this.activeItem;
            var route = [];

            var protectedStack = getProtectedStackFromItem(active);
            if (protectedStack) {
                route = protectedStack.getCompoundRoute();
            } else {
                route = [];
            }
            route.unshift(myroute);
            return route;
        },

        setCompoundRoute: function(params) {
            var item, result = true;
            var route = params.route;
            var index = (params.index = params.index || 0);
            var myroute = route[index];
            this.navigating = true;
            if (!myroute) {
                myroute = [this.public.routename, {
                    item: 0
                }];
                route[index] = myroute;
            }

            this.super.protected("setCompoundRoute", params);
            item = this.resolveItem(myroute);

            try {
                result = this.setActiveItem(item, params);
            } catch (e) {
                // TODO: do we need this?
                if (item && item !== this.activeItem) {
                    item.classList.remove("active-item");
                }
                this.navigating = false;
                throw e;
            } finally {
                this.navigating = false;
            }

            if (item) {
                this.public.state.item = item.stateid;
            } else {
                delete this.public.state.item;
            }
            return result;
        },

        stateChange : function(detail, notify) {
            var change = detail.state.item !== (detail.oldstate || {}).item;
            this.super.protected("stateChange", detail, change || notify);
            if ((detail.update && "item" in detail.state) || (detail.oldstate && detail.state.item !== this.activeItem.stateid)) {
                var item = this.resolveItem([undefined, this.public.state]);
                change = item !== this.activeItem;
                if (change && item) {
                    var itemIndex = Array.prototype.slice.apply(this.public.items).indexOf(item);
                    if (itemIndex === -1) {
                        this.public.querySelector("nav").appendChild(item);
                    }

                    this.setActiveItem(item, {});
                    detail.state.item = item.stateid;
                } else if (change) {
                    delete detail.stateitem;
                }
            }
        }
    },

    private: {

        resolveItem: function(route) {
            var stateItem = route[1].item;
            var item, items;

            var stateIndex = parseInt(stateItem);
            if (!stateItem) {
                //
            } else {
                items = this.public.querySelectorAll(itemSelectorBase + this.itemSelector);
                for (var i = items.length - 1; i >= 0; i--) {
                    if (items[i].stateid === stateItem) {
                        item = items[i];
                        break;
                    }
                }
            }
            if (!item) {
                // fallback to any item
                item = this.public.querySelector(itemSelectorBase + this.itemSelector);
                if (!item) {
                    return undefined;
                }
            }
            if (item.stateid !== stateItem && this.public.constructor.debug) {
                console.log("drawer.resolve.redirect");
            }
            return item;
        },

        /**
         * update to item and route, even if item is the active item
         */
        setActiveItem: function(item, params) {
            // TODO : signal active
            var previous = this.activeItem;
            var route = params.route;
            var index = params.index;
            var animate = params.animate;
            if (!route) {
                route = params.route = [
                    [this.public.routename, this.public.state]
                ];
                if (this.public.state) {
                    this.public.state.item = item.stateid;
                }
                index = 0;
            }

            var protectedStack = getProtectedStackFromItem(item);
            var result = true;
            var itemchanged = previous !== item;
            this.activeItem = item;

            // TODO: reset when api is ready
            // TODO: update when stack has stack.pages
            if (item) {
                params.index = index + 1;
                if (itemchanged) {
                    params.source = 'hashchange';
                }
                if (params.route[params.index]) {
                    // Note: this may throw errors, guard if you want to have finally code
                    result = protectedStack.setCompoundRoute(params);
                } else if (itemchanged && item.memoryManagementStrategy === "destroy") {
                    protectedStack.setCompoundRoute(params);
                } else if (item.stack.length === 0) {
                    params.source = 'hashchange';
                    protectedStack.setCompoundRoute(params);
                }
            } else {
                // TODO: add default stack
                route.splice(index + 1, Infinity);
            }

            if (itemchanged) {
                if (this.setActiveItemRafId) {
                    App.cancelAnimationFrame(this.setActiveItemRafId);

                    if (previous && previous.stack && previous.stack.parentNode) {
                        this.runActiveItemFinisher(previous, previous.stack, params);
                        previous.stack.classList.remove("el-fade-out");
                    }
                } else if (this.transitionActiveItem) {}

                protectedStack.public.classList.add("el-fade-out");
                protectedStack.public.classList.remove("el-hidden");

                this.items.insertBefore(protectedStack.public, (previous && previous.stack.parentNode) ? previous.stack : null);

                this.setActiveItemRafId = App.requestAnimationFrame(this, this.setActiveItemRaf, [item, previous, protectedStack, params.invisible]);
            }

            return result;
        },

        setActiveItemRaf: function(item, previous, protectedStack, invisible) {
            //FIXME: PL: this method doesn't clean up after itself very well. The fcn transionend listener is leaking,
            // protectedStack and previous.stack could be destroyed out from under us in the time between the RAF
            // or transitionend method getting triggered. I've added guards but the real solution is to clean up properly
            // as things are destroyed/removed.
            if (previous) {
                var self = this;
                var previousStack = previous.stack;

                this.runActiveItemFinisher(previous, previousStack, invisible);
                previous.stack.classList.add("el-fade-out");
                previous.classList.remove("active-item");
            }

            item.classList.add("active-item");

            if (protectedStack.public) {
                protectedStack.public.classList.remove("el-fade-out");
            }

            if (this.opened) {
                this.public.visualState = "closed";
            }

            if (protectedStack.visible) {
                protectedStack.visible();
            }

            this.setActiveItemRafId = undefined;
        },

        runActiveItemFinisher: function(previous, previousStack, invisible) {
            var self = this;
            if (previousStack.classList.contains("el-hidden")) {
                return;
            }

            var fcn = function(e) {
                if (e.propertyName !== "opacity" || !self.items) {
                    return;
                }
                previousStack.removeEventListener(styles.transitionend, fcn);

                if (previous.memoryManagementStrategy !== "hide") {
                    if (previousStack.parentNode === self.items) {
                        self.items.removeChild(previousStack);
                    }
                }
                previousStack.classList.add("el-hidden");
                previousStack.classList.remove("el-fade-out");

                if (previous.memoryManagementStrategy === "hide") {
                    self.items.insertBefore(previousStack, self.items.firstElementChild);
                }

                var previousProtectedStack = getProtectedPane(previousStack);
                previousProtectedStack.invisible();
                if (previous.memoryManagementStrategy === "destroy") {
                    previousProtectedStack.drawerCompoundRoute = previousProtectedStack.getCompoundRoute();
                    previousProtectedStack.setCompoundRoute({
                        route: [],
                        index: 0,
                        noTransition: true
                    });
                }
                //console.log("drawer.finisher", previous.routename, invisible);
            };
            if (invisible) {
                fcn({
                    propertyName: "opacity"
                });
            } else {
                //console.log("drawer.runFinisher", previous.routename, invisible);
                previousStack.addEventListener(styles.transitionend, fcn);
            }
        },

        removeFocus: function() {
            // https://jira.bbqnx.net/browse/MEAPCLIENT-1331
            if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
            }
        },

        onOverlayTriggered: function() {
            this.public.visualState = "closed";
        },

        onDeviceResize: function(type) {
            if (this.opened && (type === "wider" || type === "widest")) {
                this.public.visualState = "closed";
            }
        }
    },

    init: function(params) {
        this.visualState = "closed";
        this.mode = "auto";
        this.anonItemCount = 0;
        this.animationFrameIds = {};

        this.items = document.createElement("div");
        this.items.classList.add("el-drawer-mode-auto");
        this.overlayTouch = new OverlayTouch(undefined, this.onOverlayTriggered.bind(this));
        this.items.classList.add("el-drawer-items");
        this.nav = this.public.querySelector("nav");
        if (!this.nav) {
            this.nav = document.createElement("nav");
            this.public.appendChild(this.nav);
            Array.prototype.slice.call(this.public.children, 0, -1).forEach(function(child) {
                this.nav.appendChild(child);
            });
        }

        var _this = this;
        this.onNavTriggered = function(e) {
            if (!e.defaultPrevented) {
                var target = e.target || e.currentTarget;
                if (target.tagName === 'EL-DRAWERITEM') {
                    _this.public.activeItem = target;
                    _this.public.visualState = 'closed';
                }
            }
        };
        this.nav.addEventListener('trigger', this.onNavTriggered);

        this.public.appendChild(this.items);
        this.opened = this.items.classList.contains("pre-open") ? true : false;

        //If the drawer is open and the user rotates the device to wider or widest, set visual
        //state to closed to close overlay, since these resolutions remove the toggle button
        //and don't require an overlay.
        this.boundOnDeviceResize = this.onDeviceResize.bind(this);
        App.device.addListener(this.boundOnDeviceResize);
    },

    destroy: function() {
        // Cancel all the active RAFs.
        App.cancelAnimationFrame(this);
        if (this.activeItemRAFTimeout) {
            clearTimeout(this.activeItemRAFTimeout);
        }
        this.overlayTouch = this.overlayTouch.destroy();
        this.overlayTouch = undefined;
        this.nav.removeEventListener('trigger', this.onNavTriggered);
        this.animationFrameIds = undefined;
        this.items = undefined;
        this.nav = undefined;
        this.activeItem = undefined;
        App.device.removeListener(this.boundOnDeviceResize);
    },
};

},{"../../../shared/overlayTouch.js":117,"../../app/app.js":78,"../../router":97,"../pane":91,"path":3}],84:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = window.elsa.compiler;

var path = require('path');
var router = require("../../router");
var errorUtils = require("../../../shared/error-utils.js");

var globalId = 0;

/**
 * Import replaces itself with the contents of the .html file pointed to by its href attribute.
 *
 * The href attribute must point to an existing, local file that can be reached at compile time by
 * browserify. It is not possible to import files created dynamically at runtime.
 *
 * @el control
 * <el-import href="path/to/file_to_be_imported.html"></el-import>
 *
 * @class import
 * @extends HTMLElement
 *
 * @demo backbone
 * <caption>Load some HTML including Elsa controls from another file, specified using a relative path.</caption>
 * <template name="import.html">
 * <el-page>
 *      <el-bar>
 *          <div class="title">Import pieces of HTML</div>
 *      </el-bar>
 *      <el-page-content>
 *          <el-import href="./partial.html"></el-import>
 *      </el-page-content>
 * </el-page>
 * </template>
 * <template name="partial.html">
 * <el-header data-label="Notes"></el-header>
 * <div class="el-row">
 *     <p class="el-grow">Item 1</p>
 *     <i class="fa fa-close" style="margin: 10px"></i>
 * </div>
 * <div class="el-row">
 *     <p class="el-grow">Item 2</p>
 *     <i class="fa fa-close" style="margin: 10px"></i>
 * </div>
 * </template>
 */
module.exports = {

    name: "import",

    extend: HTMLElement,

    /**
     * Returns the module referenced by href
     *
     * @memberOf import
     * @param  {string} base - the base path to resolve href
     * @param  {string} href - an elsa path (unix style)
     * @param  {function} [lookupFn] - an optional require function from the module at sourcepath
     * @return {string} routename
     */
    resolveImport: function(sourcepath, href, req) {
        if (href) {
            var id = href,
                m;
            var basepath = path.dirname(sourcepath || '/');
            if (basepath && href[0] === '.') {
                id = path.normalize(path.join(basepath, href));
            }
            if (!req) {
                var imp = router.getRouteForPath(id);
                req = imp ? imp.require : (window.require || router.xhr.require);
            }
            try {
                m = req(id);
            } catch (e) {
                errorUtils.log(e);
            }
            return m;
        }
    },


    init: function(params) {
        params = params || {};
        var mod;
        var href = params.href || this.public.getAttribute("href");


        try {
            mod = module.exports.resolveImport(params.sourcepath, href, params.require);
        } catch (e) {
            if (router.RouteErrorEvent.prototype.isPrototypeOf(e)) {
                console.error("elsa.import: unable to load module " + href + ": " + e.message);
            } else {
                errorUtils.log(e);
            }
        }
        if (mod) {
            delete params.href;
            params.require = mod.require || params.require;
            params.sourcepath = mod.sourcepath || params.sourcepath;
            var content = compiler.compile(mod, params.parentControl, params.state);
            this.public.parentElement.replaceChild(content, this.public);

            this.public.destroy();
        }
    },

    destroy: function() {}
};

},{"../../../shared/error-utils.js":114,"../../router":97,"path":3}],85:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var typeRegistry = window.elsa.compiler.elements;

var App = require("../../app/app.js");
var stackDefinition = require("../stack/index.js");
var utils = require("../../../shared/utils");

/**
 * Provides a fundamental navigation control that typically fills the whole screen on mobile.
 *
 * @class page
 * @extends pane
 *
 * @fires page#visible
 * @fires page#invisible
 * @fires page#pop
 * @fires page#statechange
 *
 * @el control
 * <el-page><el-page>
 *
 * @demo
 * <caption>Page with top and bottom bars</caption>
 * <template name="page.html">
 * <el-page>
 *      <el-bar></el-bar> <!-- bar on top of page -->
 *      <el-page-content>
 *          <!-- scrollable area -->
 *      </el-page-content>
 *      <el-bar></el-bar> <!-- bar on bottom of page -->
 * </el-page>
 * </template>
 */

/**
 * Fired after the page becomes visible to the user
 * @event page#visible
 * @type {DOMEvent}
 */

/**
 * Fired before the page becomes invisible to the user
 * @event page#invisible
 * @type {DOMEvent}
 */

/**
 * Fired just before a page is popped. __Cancelable__
 * @event page#pop
 * @type {DOMEvent}
 */

var empty = function() {};

var dummyStack = {
    push: empty,
    pop: empty,
    popTo: empty,
    length: 0,
};

var sizes = ["small", "medium", "large"];
var defaultLayout = require("./paneltypes/default");
var layouts = {
    "default": defaultLayout,
    get: function(type) {
        return layouts[type] || defaultLayout;
    }
};
var registerPanelType = function(paneltype, plugin) {
    Object.setPrototypeOf(plugin, defaultLayout);
    layouts[paneltype] = plugin;
};
registerPanelType("fullscreen", require("./paneltypes/fullscreen"));
registerPanelType("anchor", require("./paneltypes/anchor"));
registerPanelType("modal", require("./paneltypes/modal"));

module.exports = {

    name: "page",

    extend: Extend.createType(require("../pane")),

    mixinExtended: [require('../../../shared/content')],

    events: ["pop", "visible", "invisible"],

    registerPanelType: registerPanelType,

    /** @lends page# */
    public: {
        /**
         * Navigation returns the parent stack if one is available, for push and pop
         * @example page.stack.push()
         */
        stack: {
            get: function() {
                var stack = this.public.parentElement;
                if (stack && stack.tagName !== 'EL-STACK') {
                    stack = stack.parentElement;
                    if (stack && stack.tagName !== 'EL-STACK') {
                        stack = stack.parentElement;
                        if (stack && stack.tagName !== 'EL-STACK') {
                            stack = stack.parentElement;
                            if (stack && stack.tagName !== 'EL-STACK') {
                                stack = undefined;
                            }
                        }
                    }
                }
                if (!stack) {
                    stack = dummyStack;
                }
                return stack;
            }
        },
        /**
         * Paneltype defines the navigation style for this page
         *
         * Currently Available Panel types are:
         * * {@link page.paneltypes.default default}
         * * {@link page.paneltypes.fullscreen fullscreen}
         * * {@link page.paneltypes.modal modal}
         * * {@link page.paneltypes.anchor anchor}
         *
         * @example
         *  <el-page data-paneltype="fullscreen"></el-page>
         *
         * @readonly
         */
        paneltype: {
            get: function() {
                return this.public.getAttribute("data-paneltype") ? this.public.getAttribute("data-paneltype") : "large";
            }
        },

        /**
         * Set adaptive to "false" to prohibit page contents from adapting to larger screens, preserving the mobile appearance.
         * Defaults to true.
         *
         * @type {Boolean}
         *
         * @example
         *  <el-page data-adaptive="false"></el-page>
         */
        adaptive: {
            get: function() {
                return (this.public.getAttribute("data-adaptive") !== "false");
            },
            set: function(value) {
                if (value) {
                    this.public.removeAttribute("data-adaptive");
                } else {
                    this.public.setAttribute("data-adaptive", "false");
                }
            }
        },

        /**
         * Navigate to a routable. Alias of the {@link App#navigateTo App.navigateTo} API, and the only way to do relative navigation in adaptive UX mode
         *
         * @example
         *  page.navigateTo("bar-demo"); // will push the "bar-demo" page on top of "welcome" (relative navigation)
         *  page.navigateTo("/bar-demo"); // will replace "welcome" with "bar-demo" (absolute navigation)
         *
         * @param {string} [route] - A string representing the user's location within the application
         * @param {boolean} [replace] - If `true`, replace the current history entry instead of creating a new one.
         */
        navigateTo: function(uri, replace) {
            if (uri[0] === "/") {
                App.navigateTo(uri, replace);
                return;
            }
            if (uri[0] !== ".") {
                uri = "./" + uri;
            }
            var stack = this.public.stack;
            if (!stack) {
                // TODO: fixme when stack is global
                console.warn("Navigation is only available for pages in a stack");
                elsa.App.navigateTo(uri, replace);
                return;
            }
            var stackPriv = stackDefinition.getPrivate(stack);
            if (stackPriv && stackPriv.protected) {
                stackPriv.protected.navigateTo(this.public, uri, replace, 'navigation');
            }
        },

        /**
         * Opens a toast using the given options
         *
         * @param {options} Object containing customization options for the toast<br />
         *   &nbsp;&nbsp;<i>label</i> - text to display in toast<br />
         *   &nbsp;&nbsp;<i>buttonLabel</i> - label for optional button<br />
         *   &nbsp;&nbsp;<i>timeout</i> - how long to keep toast open in milliseconds<br />
         *   &nbsp;&nbsp;<i>buttonPressedCallback</i> - callback for button if buttonLabel provided
         *
         * @example page.toast({
         *   label: window.tr("This is a toast with a button"),
         *   buttonLabel: window.tr("Undo"),
         *   timeout: 5000,
         *   buttonPressedCallback: function() {
         *       console.log("Undo selected!");;
         *   }
         * });
         */
        toast: function(options) {
            var toastObj = elsa.toast.create(options);
            this.public.appendChild(toastObj);
            toastObj.open();
        },

        contentSelector: "el-page-content"

    },

    protected: {
        creationCompleted: function() {
            this.super.protected("creationCompleted");

            var paneltype = this.public.getAttribute('data-paneltype') || this.public.getAttribute('paneltype');
            var layout = Object.create(layouts.get(paneltype));
            layout.page = this.public;
            layout.container = layout.init();
            this.protected.layout = layout;
        }
    },

    init: function() {
        this.public.classList.add("el-stack-item");
    },

    destroy: function() {
        this.protected.layout.container = undefined;
        this.protected.layout.page = undefined;
        this.protected.layout = undefined;
    }

};

},{"../../../shared/content":113,"../../../shared/utils":118,"../../app/app.js":78,"../pane":91,"../stack/index.js":92,"./paneltypes/anchor":86,"./paneltypes/default":87,"./paneltypes/fullscreen":88,"./paneltypes/modal":90}],86:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


/*
 * A paneltype for pages that want to be the master for a stack of pages.
 *
 * The layout anchors the specified page to the left, in a narrow layout.
 * The remaining space is used to stack subsequent pages.
 * The modal paneltype will override the active layout.
 *
 * @class page.paneltypes.anchor
 *
 * @demo
 * <caption>Anchor paneltype</caption>
 * <template name="paneltype-anchor.html">
 * <el-page data-panelsize="anchor">
 * </el-page>
 * </template>
 */
module.exports = {
    insert: function(layout) {
        var page = this.page;

        this.appendChild(layout, this.container);
        layout.parent = this.container;
        layout.nextElementSibling = this.container.firstElementChild;

        this.appendChild(layout, page);
        layout.index += 1;
        layout.parent = this.previewContainer;
        layout.nextElementSibling = layout.parent.firstElementChild;
    },
    remove: function() {
        this.container.parentNode.removeChild(this.container);
        this.page.parentNode.removeChild(this.page);
    },
    getVisibleContainers: function(deviceType) {
        var last = this.container.lastElementChild.lastElementChild;
        if (last && last.classList.contains('animate-out')) {
            last = last.previousElementSibling;
        }
        if (!last) {
            return [this.page];
        } else if (deviceType === "narrow") {
            return [last];
        } else {
            return [this.page, last];
        }
    },
    init: function() {
        var container = document.createElement("div");
        container.classList.add("el-anchor-container", "el-stack-item");

        var previewContainer = document.createElement("div");
        previewContainer.classList.add("el-anchor-preview-container", "el-anchor-placeholder", "el-stack-container");
        container.appendChild(previewContainer);
        this.previewContainer = previewContainer;
        return container;
    }
};
},{}],87:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


/*
 * The default paneltype.
 *
 * The default layout makes panels fullscreen regardless of form-factor.
 * The default paneltype will follow whatever layout previous pages have started.
 *
 *
 * @class page.paneltypes.default
 *
 * @demo
 * <caption>Default paneltype</caption>
 * <template name="paneltype-default.html">
 * <el-page>
 * </el-page>
 * </template>
 */
module.exports = {
    insert: function(layout) {
        this.appendChild(layout, this.page);
        layout.index += 1;
        layout.nextElementSibling = this.page.nextElementSibling;
    },
    remove: function() {
        this.page.parentNode.removeChild(this.page);
    },
    getVisibleContainers: function(deviceType) {
        return [this.container];
    },
    appendChild: function(layout, page) {
        if (layout.nextElementSibling !== page) {
            layout.parent.insertBefore(page, layout.nextElementSibling);
        }
    },
    init: function() {
        return this.page;
    }
};
},{}],88:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


/*
 * A paneltype for pages that want to be always fullscreen.
 *
 * The layout makes panels fullscreen regardless of form-factor, and uses the deafult transitions.
 * The fullscreen paneltype will override the active layout.
 *
 * @class page.paneltypes.fullscreen
 *
 * @demo
 * <caption>Fullscreen paneltype</caption>
 * <template name="paneltype-fullscreen.html">
 * <el-page data-panelsize="fullscreen">
 * </el-page>
 * </template>
 */
module.exports = {
    insert: function(layout) {
        //TODO:container api for this
        while (layout.parent.tagName !== 'EL-STACK' && !layout.parent.classList.contains('el-modal-inner-container')) {
            layout.nextElementSibling = layout.parent.nextElementSibling;
            layout.parent = layout.parent.parentElement;
        }
        this.appendChild(layout, this.page);
        layout.index += 1;
        layout.nextElementSibling = this.page.nextElementSibling;
    }
};

},{}],89:[function(require,module,exports){
module.exports = "<div class=\"el-modal-container el-stack-item\"><div class=el-modal-overlay></div><div class=\"el-modal-inner-container el-stack-container\"></div></div>";

},{}],90:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var modalTemplate = require("./modal.html");

/*
 * A paneltype for pages that want to appear modal.
 *
 * The layout makes panels smaller than the current layout
 * The modal paneltype will override the active layout.
 *
 * @class page.paneltypes.modal
 *
 * @demo
 * <caption>Modal paneltype</caption>
 * <template name="paneltype-modal.html">
 * <el-page data-panelsize="modal">
 * </el-page>
 * </template>
 */
module.exports = {
    insert: function(layout) {
        var page = this.page;
        while (layout.parent.tagName !== 'EL-STACK') {
            layout.nextElementSibling = layout.parent.nextElementSibling;
            layout.parent = layout.parent.parentElement;
        }
        this.appendChild(layout, this.container);
        layout.parent = this.container.lastElementChild;
        layout.nextElementSibling = layout.parent.firstElementChild;
        this.appendChild(layout, page);
        layout.index += 1;
        layout.nextElementSibling = page.nextElementSibling;
    },
    remove: function() {
        this.container.parentNode.removeChild(this.container);
        this.page.parentNode.removeChild(this.page);
    },
    getVisibleContainers: function(deviceType) {
        var topPage = this.container.lastElementChild.lastElementChild;
        if (deviceType === "narrow") {
            return [topPage];
        } else {
            var prev = this.container.previousElementSibling;
            return prev ? [topPage, prev] : [topPage];
        }
    },
    init: function() {
        var c = document.createElement("div");
        c.innerHTML = modalTemplate;
        return c.firstElementChild;
    }
};
},{"./modal.html":89}],91:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var control = window.elsa.control;

var App = require("../../app/app.js");
var router = require("../../router");
var errorUtils = require("../../../shared/error-utils.js");
var utils = require("../../../shared/utils");
var events = require('../../../shared/events.js');

var globalId = 0;
var anonymousId = 0;

var cloneState = function(state) {
    var s = {};
    for (var i in state) {
        var v = state[i];
        if (v === null) {
            s[i] = v;
        } else if (v !== undefined) {
            s[i] = v.toString();
        }
    }
    return s;
};
/** Abstract base type for all <b>routables</b> ({@link drawer drawer}, {@link stack stack}, {@link page page}).
 *
 * ## Elsa Routing concepts
 *
 * Elsa provides a unique approach to URL routing (aka hashbang routing), which differs from traditional routing in other frameworks. There's no concept of an explicit router, or hard-coding the different paths to navigating your application. Instead, developers create a set of <b>routeable elements</b>, and navigate between these as desired, leaving the navigation logic to Elsa.
 *
 * Note: <b>Routeable Elements</b> are all elements that inherit from pane, such as {@link drawer drawer}, {@link stack stack}, {@link page page}. These are essential to Elsa's navigation.
 *
 *
 * Elsa URLs are made up of one or more URL <b>segments</b>, for example `#/customers?id=1/details?viewmode=list/`. Each <b>Segment</b> starts and ends with a slash, for example: `#/customers/` and `/details/`. Each <b>routable element</b> gets a URL segment when part of app's state.
 *
 * Let's say both `customers` and `details` are a {@link page page}. The above URL reads: `Show me the customers page, and select item with id = 1 and show me the details page with viewmode = list`.
 *
 * Because they are both {@link page pages}, Elsa creates a {@link stack stack}, and pushes both pages.
 *
 *
 * ### Segment
 * A <b>Segment</b> consists of the routename, and a state `#/<routename>?<state>/`. Instead of having global parameters in the URL, each segment has its set of params, also known as it's state.
 *
 * The <b>state</b> consists of key value pairs, for example `#/customers?id=1/`, where state has a param `id` with value 1.
 *
 * This design allows pieces of the application to be independent from one another, and also removes the limitation where only a single `active` view is possible at once. Developers are free to push and pop pages as they wish, and pass a set of params, and Elsa will take care of how these are coalesced depending on the type of routable they are in (example {@link drawer drawer} versus {@link stack stack}). This also means multiple active views can live side by side, which allows for some advanced AdaptiveUX.
 *
 * In order to navigate between these segments, they need to bear a name, such as `customers` and `details`. This name is defined using a `routename`.
 *
 * ### Routename
 * Routeable elements each have a name in their URL Segment. (example above: `customers` and `details`).
 * A typical application consists of navigating between such routables.
 *
 * There are two ways to specify a routename for a routeable.
 *
 * 1. If defining routes manually, use {@link App#registerRoutes elsa.App.registerRoutes}.
 *
 *          <!-- file: main.html -->
 *          <el-drawer>
 *          </el-drawer>
 *
 *          <!-- file: about.html -->
 *          <el-page>
 *          </el-page>
 *
 *          //file: app.js
 *          elsa.App.registerRoutes({
 *              "main" : "drawer.html",
 *              "about" : "about.html"
 *          });
 *
 * 2. If using the browserify elsa-loader plugin, use the {@link pane#routename data-routename} property. This process assumes you want to use {@link http://browserify.org browserify} in your Elsa app:
 *
 *          <!-- file: src/main.html -->
 *          <el-drawer data-routename="main">
 *          </el-drawer>
 *
 *          <!-- file: src/about.html -->
 *          <el-page data-routename="about">
 *          </el-page>
 *
 *          // file: Gruntfile.js
 *          browserify : {
 *              options : {
 *                  plugin : [[elsa/loader, {
 *                      routes : ["*.html"],
 *                      extensions: ['html']
 *                  }]]
 *              },
 *              dist : {
 *                  files : {
 *                      'www/app.js' : ['src/app.js']
 *                  }
 *              }
 *      This automates the process from option 1 and is also considered the `high-performance` setup, because all routables are precompiled along with the rest of the source into a single library to consume inside `index.html`.
 *
 *
 * Only one of these two methods is supported at one time.
 * Once the routes are registered, navigation is done using the {@link App#navigateTo navigateTo} APIs or using the URL, but only the former ensures all transitions and history is correctly maintained.
 *
 * @class pane
 * @extends control
 * @el abstract
 * @fires pane#statechange
 */

/**
 * Fired when the pane's state has changed due to an external navigation event. Eg: when a page
 * is recycled to a new state.
 *
 * Note: To redirect/modify the state during this time, modify the state of the event. _Any changes
 * that you make to the state provided in this event will be accepted by the control during the
 * current routing operation._
 * @event pane#statechange
 * @type {DOMEvent}
 * @property {Object} state - The newly set state
 * @property {Object} oldstate - The state that was replaced
 */

module.exports = {

    name: "pane",

    extend: control,

    visible: events.createEventType('visible', {
        bubbles: false,
        cancelable: false
    }),

    invisible: events.createEventType('invisible', {
        bubbles: false,
        cancelable: false
    }),

    statechange: events.createEventType('statechange', {
        bubbles: false,
        cancelable: false
    }),

    /** @lends pane# */
    public: {

        /**
         * True if the current page is visible
         */
        visible: {
            writable: false
        },

        /**
         * The current state of a control. State is used to allow controls to save/restore persistent
         * state identifiers in the url. The state is initially populated with arguments provided to
         * stack.push or as parameters in the route url. Otherwise it is initialized as an empty object.
         *
         * The {@link pane#event:statechange statechange} event will be fired when the state is replaced but *not* when the state
         * is updated.
         *
         * @fires pane#statechage
         * @readonly
         * @type {Object}
         */
        state: {
            writable: false,
        },

        /**
         * Defines the name for the URL segment for the current element. See {@link pane pane} for in-depth explanation.
         *
         * @type {string}
         * @const
         */
        routename: {
            writable: false
        },

        /**
         * Updates the current state of the control, maintaining the current value for
         * unspecified keys. See {@link control.replaceState replaceState} to completely
         * replace the current state.
         * *Updating a key to `undefined` will remove it from the state.*
         *
         * @param {Object} changes - An object to merge with the current state
         */
        updateState: function(changes) {
            var change = false;
            for (var k in changes) {
                var v = changes[k];
                if (v === undefined) {
                    if (this.state) {
                        delete this.state[k];
                    }
                    change = true;
                } else if (!this.state || this.state[k] !== v) {
                    if (!this.state) {
                        this.state = {};
                    }
                    this.state[k] = v;
                    change = true;
                }
            }
            if (!change) {
                return;
            }
            if (!this.statechange) {
                this.stateChange({
                    state: changes,
                    update: true
                });
            } else {
                console.warn(Object.getPrototypeOf(this.public).constructor.name + ".updateState() called during a statechange event");
            }
        },

        /**
         * Set the current state of the control, overriding the previous state completely.
         * Optionally, notify will fire the {@link pane#event:statechange statechange} event.
         *
         * __Note__: *{@link event:statechange statechange} events are normally only
         * used for page level navigation changes*
         *
         * @param {Object} state - The state to set
         * @param {boolean} [notify=false] - Dispatch a statechange event for this change
         * @fires pane#statechange
         */
        replaceState: function(state, notify) {
            var event = {
                state: state,
                oldstate: this.state
            };
            var change = !router.compareStates(this.state, state);
            if (!change) {
                return;
            }
            if (this.statechange) {
                throw new Error(Object.getPrototypeOf(this.public).constructor.name + ".replaceState() called during a statechange event");
            }
            this.state = state;
            this.stateChange(event, notify && this.protected.lifecyclePhase === "created");
            if (notify) {
                this.state = cloneState(state);
            }
        },
    },

    /**
     * @lends pane#
     */
    protected: {

        routename: undefined,

        visible: function(quiet) {
            if (this.visible) {
                return false;
            }
            this.visible = true;
            var type = Object.getPrototypeOf(this.public).constructor;
            if (type.debug) {
                console.log(type.name + "#" + this.public.routename + ".visible");
            }
            if (!quiet) {
                this.public.dispatchEvent(module.exports.visible());
            }
            return true;
        },

        invisible: function(quiet) {
            if (!this.visible) {
                return false;
            }
            var type = Object.getPrototypeOf(this.public).constructor;
            if (type.debug) {
                console.log(type.name + "#" + this.public.routename + ".invisible");
            }
            this.visible = false;
            if (!quiet) {
                this.public.dispatchEvent(module.exports.invisible());
            }
            return true;
        },

        /**
         * Does not actually navigate the location/history, just sets the state and
         * publishes the event
         *
         * _Note: calls App.updateRoute(!publish)_
         * _Note: may modify the state during this method if publish is true_
         *
         * @protected
         * @param {Object} state
         * @param {boolean} publish - If we should dispatch pane#onstatechange
         */
        pushState: function(state, publish) {
            var oldstate = this.state;
            this.state = state;
            if (!this.statechange) {
                if (publish) {
                    var clone = cloneState(state);
                    this.publishStateChange({
                        state: state,
                        oldstate: oldstate
                    });
                    state = cloneState(state);
                    if (!router.compareStates(state, clone)) {
                        var detail = {
                            state: state,
                            oldstate: clone
                        };
                        this.state = state;
                        this.stateChange(detail);
                    } else {
                        this.state = state;
                    }
                }
                App.updateRoute(!publish);
            }
        },

        updateRoute: function(replace) {
            if (!this.statechange && this.protected.lifecyclePhase === "created") {
                App.updateRoute(replace);
            }
        },

        getCompoundRoute: function() {
            if (this.protected.routename) {
                return [
                    [this.protected.routename, this.state]
                ];
            }
        },

        /**
         * _Note: may modify the state during the call_
         *
         * Note: we sepecifically do NOT call stateChange here -
         * if you want the hook, override setCompoundRoute and call
         * this.protected.setCompoundRoute to delegate to this
         * @protected
         */
        setCompoundRoute: function(params) {
            var route = params.route;
            if (!route) {
                params.route = route = [];
            }
            var index = (params.index = params.index || 0);
            var compound = route[index];
            if (!compound) {
                compound = [this.protected.routename, this.public.state || {}];
            } else if (compound[0] !== this.protected.routename && compound[0] !== "") {
                throw new Error("control.route.InvalidRoute " + this.protected.routename + ": " + route);
            } else if (this.protected.lifecyclePhase === "initialized" || !router.compareStates(compound[1], this.state)) {
                var event = {
                    state: compound[1],
                    oldstate: this.state
                };
                this.state = event.state;

                if (!this.statechange) {
                    this.publishStateChange(event);
                    this.state = cloneState(event.state);
                }
            }
            route[index] = compound;
        },

        /**
         * Called just **BEFORE** a state change is made.
         * Return true to cancel the state change;
         * @protected
         * @param {Object} detail - The detail from the statechange event, _before_
         * it has been passed to the event. You can change it at this point.
         * @returns {boolean} True if we should cancel the state change
         */
        stateChange: function(detail, notify) {
            var tp = Object.getPrototypeOf(this.public);
            if (tp.debug > 1) {
                console.log(tp.constructor.name + "#" + this.protected.routename + " stateupdate", detail);
            }
            if (!this.statechange && this.protected.lifecyclePhase === "created") {
                App.updateRoute(true);
                if (notify) {
                    this.publishStateChange(detail);
                }
            }
        },

        creationCompleted: function() {
            /** Send out our state */
            var exception;
            try {
                this.super.protected("creationCompleted", this.state);
            } catch (e) {
                exception = e;
            }
            if (exception) {
                // TODO: should we throw this instead ??
                errorUtils.log(exception);
                //throw exception;
            }
        },

        route: function(route) {
            if (Object.getPrototypeOf(this.public).constructor.debug) {
                console.log(Object.getPrototypeOf(this.public).constructor.name + "#" + this.protected.routename + ".ready");
            }
            route = route ? {
                route: route
            } : router.stringToCompoundRoute(this.protected.defaultroute || "");
            route.invisible = !this.visible;
            this.protected.setCompoundRoute(route);
        },

        resolveRoute: function(params) {
            var routename = params.routename || utils.getAttribute(this.public, "routename");

            if (!routename) {
                //check if this routable is registered as a route
                var routeInfo = router.getRouteForPath(params.sourcepath);
                if (routeInfo) {
                    routename = routeInfo.name;
                }
            }

            return routename;
        },

        resolveDefaultRoute: function(params) {
            var defaultroute;
            if (params.state) {
                defaultroute = this.public.routename + "?" + router.objectToParams(params.state);
            } else {
                defaultroute = this.public.routename;
            }
            return defaultroute;
        }

    },

    private: {

        publishStateChange: function(detail) {
            var type = Object.getPrototypeOf(this.public).constructor;
            if (type.debug) {
                console.log(type.name + "#" + this.protected.routename + " statechange", detail);
            }

            this.statechange = true;
            var event = module.exports.statechange(detail);
            this.public.dispatchEvent(event);
            this.statechange = undefined;
        },

        stateChange: function(detail, notify) {
            if (this.protected.blockStateChange) {
                this.state = detail.state;
                console.warn("elsa.control[" + Object.getPrototypeOf(this.public).constructor.name + "]: internal recursive bug (don't call pane.updateState() during a statechange event, instead modify the state parameter of the event):", detail, notify);
                return;
            }
            this.protected.blockStateChange = true;
            this.protected.stateChange(detail, notify);
            this.protected.blockStateChange = false;
        }
    },

    init: function(params) {
        params = params || {};
        this.protected.sourcepath = params.sourcepath;
        this.visible = false;

        this.routename = this.protected.resolveRoute(params);
        if (!this.routename) {
            var typename = Object.getPrototypeOf(this.public).constructor.name;
            throw new Error("No router entry was found for " + this.protected.sourcepath + ". Please specify a routename attribute OR register this route using elsa.App.registerRoutes.", this.public);
        }

        this.protected.defaultroute = this.protected.resolveDefaultRoute(params);
    },

    destroy: function() {
        this.state = undefined;
        this.compoundRoute = undefined;
    }
};

},{"../../../shared/error-utils.js":114,"../../../shared/events.js":115,"../../../shared/utils":118,"../../app/app.js":78,"../../router":97}],92:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = window.Ecma5Extend;
var compiler = window.elsa.compiler;
var types = window.elsa.compiler.elements;
var styles = window.elsa.utils.styles;

var router = require("../../router");
var App = require("../../app/app.js");
var utils = require("../../../shared/utils");
var events = require("../../../shared/events");

var Pane = require("../pane/index.js");
var stackNavigation = require("./navigation.js");

var routeuid = 0;

/**
 * Implied drill-down navigation interface created when using page. Any time you define a page, Elsa creates a stack and exposes this API to page under page.stack.* This allows you to push and pop pages are required.
 * @see page
 *
 * @class stack
 * @extends pane
 * @el abstract
 *
 * @demo backbone
 * <caption>Example of drill down navigation using navigateTo() API. Here, we navigate to the same route as an example.</caption>
 * <template name="stack.html" routename="stack">
 * <el-page data-controller="backbone:./stack.js">
 *      <el-bar data-backbutton="auto"></el-bar>
 *      <el-page-content>
 *      </el-page-content>
 *      <el-action id="next-action" class="signature" data-label="Next" data-iconclass="fa fa-angle-right"></el-action>
 * </el-page>
 * </template>
 * <template name="stack.js">
 * module.exports = Backbone.View.extend({
 *      events: {
 *          "trigger #next-action": "next"
 *      },
 *      next: function() {
 *          this.el.navigateTo("stack");
 *      }
 * });
 * </template>
 *
 * @demo angular
 * <caption>Example of drill down navigation using navigateTo() API. Here, we navigate to the same route as an example.</caption>
 * <template name="stack.html" routename="stack">
 * <el-page ng-controller="stackCtrl">
 *      <el-bar data-backbutton="auto"></el-bar>
 *      <el-page-content>
 *      </el-page-content>
 *      <el-action el-on="{trigger: 'navigateTo(\'stack\')'}" class="signature" data-label="Next" data-iconclass="fa fa-angle-right"></el-action>
 * </el-page>
 * </template>
 * <template name="stackCtrl.js">
 * angular.module("demo").controller("stackCtrl", function() {
 *
 * });
 * </template>
 *
 * @demo backbone
 * <caption>Advanced Demo: Navigate to a compose page.</caption>
 * <template name="app.js">
 * function load() {
 *      elsa.App.registerRoutes({
 *          "compose": "compose.html",
 *          "stack": "stack.html"
 *      });
 *      elsa.App.initialize("/stack");
 * }
 * document.addEventListener("DOMContentLoaded", load, false);
 * </template>
 * <template name="stack.html" routename="stack">
 * <el-page data-controller="backbone:./stack.js">
 *      <el-bar data-backbutton="auto"></el-bar>
 *      <el-page-content>
 *      </el-page-content>
 *      <el-action id="compose-action" class="signature" data-label="Compose" data-iconclass="fa fa-pencil"></el-action>
 * </el-page>
 * </template>
 * <template name="stack.js">
 * module.exports = Backbone.View.extend({
 *      events: {
 *          "trigger #compose-action": "compose"
 *      },
 *      compose: function() {
 *          this.el.navigateTo("compose");
 *      },
 *      pop: function() {
 *          this.el.stack.pop();
 *      }
 * });
 * </template>
 * <template name="compose.html" routename="compose">
 * <el-page data-controller="backbone:./compose.js">
 *      <el-bar>
 *          <button class="pop">Send</button>
 *          <div class="title">Compose</div>
 *          <button class="pop">Cancel</button>
 *      </el-bar>
 *      <el-page-content>
 *      </el-page-content>
 * </el-page>
 * </template>
 * <template name="compose.js">
 * module.exports = Backbone.View.extend({
 *      events: {
 *          "click .pop": "pop"
 *      },
 *      pop: function() {
 *          this.el.stack.pop();
 *      }
 * });
 * </template>
 */

module.exports = {

    name: "stack",

    extend: Extend.createType(Pane),

    pop: events.createEventType('pop', {
        cancelable: true
    }),

    /** @lends stack# */
    public: {

        /**
         * The top page on the stack.
         * @type elsa.page
         */
        top: {
            writable: false,
            get: function() {
                return this.pages[this.pages.length - 1];
            }
        },

        /**
         * The number of pages currently on the stack.
         * @type Number
         */
        length: {
            writable: false,
            get: function() {
                return this.pages.length;
            }
        },

        /**
         * Returns child pages
         * @type page
         */
        pages: {
            writable: false,
            get: function() {
                return this.pages.slice();
            }
        },

        /**
         * The default route of the stack. Can be set at runtime
         * @type String
         */
        defaultroute: {
            get: function() {
                return this.protected.defaultroute;
            },
            set: function(value) {
                this.protected.defaultroute = value;
            }
        },

        /**
         * Pop page(s) off the stack. The popped page(s) will be destroyed.
         *
         * @param {...elsa.page} page - Page(s) to be popped off of the stack.
         * If this argument is omitted, the top page is popped off the stack.
         *  *Note: if the top page is not popped, no pop transition animation will be shown
         * @param {boolean} [noTransition=false] - If the pop transition animation should be skipped
         * @returns {boolean} Returns false if one of the pages stops itself from being popped by calling `preventDefault()`
         * on its `invisible` event. Returns true if page(s) were popped successfully.
         *
         * @fires page#visible
         * @fires page#pop
         */
        pop: function(page, noTransition) {
            var pages = this.public.pages.slice();
            var pagesToPop = [];
            var replace, i;
            var findChild = function(child) {
                var idx = pages.indexOf(child);
                if (idx === -1) {
                    throw Error("Page " + (child ? child.routename : "<unknown>") + " is not part of this stack");
                }
                return idx;
            };

            if (Object.prototype.toString.call(page) === '[object Array]') { // pop([page1, page2], true|false); (used by popTo)
                pagesToPop = page.map(findChild);
            } else if (typeof noTransition === "boolean") { // pop(pageX, true|false)
                pagesToPop = [findChild(page)];
            } else if (typeof page === "boolean") { // pop(true|false)
                noTransition = page;
            } else { // pop(page1, page2, page3, true|false)
                pagesToPop = Array.prototype.slice.call(arguments);
                var lastArg = pagesToPop[pagesToPop.length - 1];
                noTransition = typeof lastArg === "boolean" ? pagesToPop.pop() : false;
                pagesToPop = pagesToPop.map(findChild);
            }

            // If no pagesToPop are supplied, the last page in the stack should be removed.
            if (!pagesToPop.length) {
                if (pages.length === 0) {
                    console.warn("No pages in the stack to pop");
                    return false;
                }
                pagesToPop.push(pages.length - 1);
            }

            if (pagesToPop.length === 1 && pagesToPop[0] === pages.length - 1) {
                var currentCompound = router.stringToCompoundRoute(window.location.hash.slice(2));
                currentCompound.pop();
                if (App.previousRoute) {
                    var previousCompound = router.stringToCompoundRoute(App.previousRoute.slice(1));
                    var same = false;

                    if (previousCompound.length === currentCompound.length) {
                        var prev, cur, len = previousCompound.length;

                        same = true;
                        for (i = 0; same && i < len; i++) {
                            prev = previousCompound[i];
                            cur = currentCompound[i];
                            same = prev[0] === cur[0];
                        }
                    }
                }
            }

            pagesToPop = pagesToPop.sort();
            var originalRoutes = this.protected.getCompoundRoute();
            var compound = originalRoutes.slice();
            for (i = 0; i < compound.length; i++) {
                compound[i].__id = pages[i].__id;
            }
            for (i = pagesToPop.length - 1; i >= 0; i--) {
                compound.splice(pagesToPop[i], 1);
            }
            var params = {
                route: compound,
                routeIndex: 0,
                source: (noTransition || App.testmode) ? 'hashchange' : 'navigation'
            };

            var ret = this.protected.setCompoundRoute(params, originalRoutes);
            this.protected.updateRoute(replace);
            return ret;
        },

        /**
         * Pushes a page onto the stack.
         *
         * @param {string} routename - The routename of an elsa page
         * @param {Object} [state] - An object representing the state of the page. If the page is
         * a page instance, the page's state will be updated with this value. If no value is provided the
         * page wil maintain its current state or load its default state if it has not yet been created.
         * @param {boolean} [noTransition=false] - If the pop transition animation should be skipped
         * @returns {boolean} Returns false if the top page prevents the new page from being pushed on top of it by calling `preventDefault()`
         * on its `invisible` event. Returns true if page was pushed successfully.
         *
         * @fires page#visibled
         * @fires page#invisible
         */
        push: function(uri, state, noTransition) {
            if (state) {
                uri = uri + "?" + router.objectToParams(state);
            }
            var source = (noTransition || App.testmode) ? 'hashchange' : 'navigation';
            return this.protected.navigateTo(this.pages[this.pages.length - 1], uri, false, source);
        },

        /**
         * Pop multiple pages off of the stack until the provided page is reached.
         *
         * @param {elsa.page|number} page - The new top page, or index of the new top page. If
         * number is < 0, all the pages will be removed.
         * @param {boolean} [noTransition=false] - If the pop transition animation should be skipped
         * @returns {boolean} Returns false if the page could not be popped to (i.e. it was already the top page in the stack).
         * Returns true if the popTo succeeded.
         *
         * @fires page#visible
         * @fires page#pop
         */
        popTo: function(index, noTransition) {
            if (typeof index !== "number") {
                index = Array.prototype.slice.call(this.public.pages).indexOf(index);
            }
            if (index < 0 || index > this.public.childElementCount - 1) {
                throw new Error("Invalid page supplied, perhaps it is not in the stack?");
            }
            if (index + 1 === this.public.childElementCount) {
                return false;
            }

            // popTo(topPage) should do nothing and return false.
            noTransition = noTransition;
            var originalRoutes = this.protected.getCompoundRoute();
            var compound = originalRoutes.slice(0, index + 1);

            var ret = this.protected.setCompoundRoute({
                route: compound,
                routeIndex: 0,
                source: (noTransition || App.testmode) ? 'hashchange' : 'navigation'
            }, originalRoutes);
            this.protected.updateRoute();
            return ret;
        }

    },

    protected: {

        navigateTo: function(page, uri, replace) {
            var index = Array.prototype.slice.call(this.public.pages).indexOf(page);
            var originalRoutes = this.protected.getCompoundRoute();

            if (uri[0] === '.' && uri[1] === '/') {
                uri = uri.slice(2);
            }

            if (index === -1) {
                index = originalRoutes.length - 1;
            }

            // popTo(topPage) should do nothing and return false.
            var compound = originalRoutes.slice(0, index + 1).concat(router.stringToCompoundRoute(uri));

            var ret = this.protected.setCompoundRoute({
                route: compound,
                routeIndex: 0,
                source: (App.testmode) ? 'hashchange' : 'navigation'
            }, originalRoutes);
            this.protected.updateRoute(replace);
            return ret;
        },

        visible: function() {
            var change = this.super.protected("visible", !!this.public.parentControl);
            if (!change) {
                return;
            }

            this.applyVisible(App.device.type);
        },

        invisible: function() {
            var change = this.super.protected("invisible", !!this.public.parentControl);
            if (!change) {
                return;
            }

            for (var i = this.visiblePages.length - 1; i >= 0; i--) {
                Pane.getPrivate(this.visiblePages[i]).protected.invisible();
            }
        },

        getCompoundRoute: function() {
            var route = [];

            for (var i = this.pages.length - 1; i >= 0; i--) {
                var child = this.pages[i];
                var childPrivate = Pane.getPrivate(child);
                route = childPrivate.protected.getCompoundRoute().concat(route);
            }
            return route;
        },

        setCompoundRoute: function(params, originalRoutes) {
            var route = params.route;
            var routeIndex = (params.index = params.index || 0);
            var pages = this.public.pages;
            if (route.length - routeIndex === 0) {
                if (this.protected.defaultroute) {
                    // modify route inplace to support route re-direction
                    route.splice.apply(route, [routeIndex, 0].concat(router.stringToCompoundRoute(this.protected.defaultroute)));
                }
            }

            if (!originalRoutes) {
                originalRoutes = Array.apply(Array, this.protected.getCompoundRoute());
            }
            var currentRoutes = {};
            originalRoutes.forEach(function(item, index) {
                currentRoutes[index] = item;
            });

            /* actions api for what to do to which pages
             *  actions[i] - i is the index in the new route
             *  .index - the index in the current route of the source page to re-use
             *  .update - true if we need to update the page state
             */
            var actions = new Array(route.length - routeIndex);
            var i, j, r, compound, state, currentCompound;

            // find exact matches
            for (i = 0; i < route.length - routeIndex; i++) {
                compound = route[routeIndex + i];
                r = compound[0];
                state = compound[1];
                for (j in currentRoutes) {
                    currentCompound = currentRoutes[j];
                    if (r === currentCompound[0] && router.compareStates(currentCompound[1], state)) {
                        var idx;
                        if (compound.__id) {
                            for (var k = 0; k < pages.length; k++) {
                                if (pages[k].__id === compound.__id) {
                                    idx = k;
                                    break;
                                }
                            }
                            if (idx === undefined) {
                                continue;
                            }
                        } else {
                            idx = originalRoutes.indexOf(currentCompound);
                        }
                        actions[i] = {
                            index: idx
                        };
                        delete currentRoutes[j];
                        break;
                    }
                }
            }

            // find any state matches
            for (i = 0; i < route.length - routeIndex; i++) {
                if (!actions[i]) {
                    compound = route[routeIndex + i];
                    r = compound[0];
                    for (j in currentRoutes) {
                        currentCompound = currentRoutes[j];
                        if (r === currentCompound[0]) {
                            actions[i] = {
                                index: originalRoutes.indexOf(currentCompound),
                                update: true
                            };
                            delete currentRoutes[j];
                            break;
                        }
                    }
                }
            }

            if (Object.getPrototypeOf(this.public).constructor.debug > 1) {
                console.log("stack.route", router.compoundRouteToString(route), actions);
            }
            return this.applyRouteChange(originalRoutes, actions, params, pages);
        },

        resolveRoute: function(params) {
            var routename = this.super.protected("resolveRoute", params);
            if (!routename) {
                routename = "stack-anon" + routeuid++;
            }
            return routename;
        },

        resolveDefaultRoute: function(params) {
            var defaultroute = params.defaultroute || utils.getAttribute(this.public, "defaultroute");
            var page = this.public.querySelector("el-page");
            if (!defaultroute) {
                if (page) {
                    defaultroute = page.routename;
                }
            }
            return defaultroute;
        }

    },

    private: {

        createPage: function(r, previous, head) {
            if (!previous) {
                previous = this.public.parentControl;
            }
            var page = router.loadModule(r[0], r[1], previous);
            if (!page) {
                var evt = router.RouteErrorEvent.init({
                    route: r[0],
                    head: router.compoundRouteToString(head || []),
                    state: r[1],
                    message: "Unable to find module for route " + r[0],
                    source: this.public,
                });
                throw evt;
            }
            // TODO: handle bad page or error here
            if (page instanceof window.DocumentFragment) {
                page = page.querySelector("el-page");
            }
            page.publish('route', [r]);
            return page;
        },

        isAnimationAllowed: function(originalRoutes, actions, params) {
            if (params.source === 'hashchange') {
                return false;
            }
            var pop = actions.length === originalRoutes.length - 1;
            var push = actions.length === originalRoutes.length + 1;
            if (!pop && !push) {
                return false;
            }
            return pop ? "pop" : "push";
        },

        actionsContainPage: function(actions, j) {
            for (var i = actions.length - 1; i >= 0; --i) {
                var action = actions[i];
                if (action && action.index === j) {
                    return true;
                }
            }
            return false;
        },

        applyRouteChange: function(originalRoutes, actions, params, pages) {
            var i, j, r, page;
            var deviceType = App.device.type;
            var route = params.route;
            var returnValue = true;
            pages = pages || [];
            var pagesToAdd = new Array(originalRoutes.length);
            var pagesToRemove = new Array(originalRoutes.length);

            /**
             * Iterate and emit `pop` and create pages where necessary
             * THIS CALLS TO USER CODE AND MAY BLOCK / ERROR OUT
             */
            var jMax = originalRoutes.length;
            for (j = jMax - 1; j >= 0; j--) {
                var toRemove = !this.actionsContainPage(actions, j);
                if (toRemove) {
                    page = pages[j];
                    if (!page.dispatchEvent(module.exports.pop())) {
                        returnValue = false;
                        route.splice.apply(route, [params.index, route.length].concat(originalRoutes.slice(0, j + 1)));
                        actions = new Array(j + 1);
                        for (i = 0; i < actions.length; i++) {
                            actions[i] = {
                                index: i
                            };
                        }
                        pagesToRemove = new Array(originalRoutes.length);
                        for (i = j + 1; i < jMax; i++) {
                            pagesToRemove[i] = pages[i];
                        }
                        break;
                    } else {
                        pagesToRemove[j] = page;
                    }
                }
            }

            var iMax = route.length - params.index;
            var navigation = {
                pages: new Array(iMax),
                deviceType: deviceType,
                destroy: []
            };

            var previous = this.public;
            for (i = 0; i < iMax; i++) {
                var action = actions[i];
                if (action) {
                    j = action.index;
                    page = pages[j];
                    var protectedPane = Pane.getPrivate(page).protected;
                    protectedPane.parentControl = previous;
                    if (action.update) {
                        protectedPane.pushState(route[params.index + i][1], true);
                    }
                } else {
                    r = route[params.index + i];
                    page = this.createPage(r, previous, route.slice(0, params.index + i + 1));
                    pagesToAdd[i] = page;
                }
                previous = page;
                navigation.pages[i] = page;
            }
            previous = undefined;

            /* TODO: this needs a layout api for multi-page transitions */
            navigation.transition = this.isAnimationAllowed(originalRoutes, actions, params);
            if (this.navigation && !this.navigation.transition) {
                /* if we need to transition, finish the previous navigation */
                this.finishNavigation(this.navigation);
            }
            this.public.classList.add('transitioning');

            /**
             * no more user code here
             */
            if (navigation.transition === "push") {
                navigation.target = navigation.pages[iMax - 1];
                navigation.targetLayout = Pane.getPrivate(navigation.target).protected.layout;
                navigation.targetLayout.container.classList.add("animate-in-from", "animate-in");
            }

            /**
             * Iterate and mutate the DOM, queue page destruction
             */
            for (j = 0; j < jMax; j++) {
                page = pagesToRemove[j];
                if (page) {
                    if (navigation.transition === "pop" && j === jMax - 1) {
                        navigation.target = page;
                        navigation.targetLayout = Pane.getPrivate(page).protected.layout;
                        navigation.targetLayout.container.classList.add("animate-out");
                        navigation.destroy.push(page);
                    } else {
                        var container;
                        if (!page.__id) {
                            if (page.parentNode) {
                                page.parentNode.removeChild(page);
                            }
                        } else {
                            Pane.getPrivate(page).protected.layout.remove();
                            navigation.destroy.push(page);
                        }
                    }
                }
            }


            var layout = {
                pages: navigation.pages,
                parent: this.public,
                index: 0,
                nextElementSibling: this.public.firstElementChild
            };
            while (layout.index < iMax) {
                Pane.getPrivate(layout.pages[layout.index]).protected.layout.insert(layout);
            }

            this.pages = navigation.pages;
            this.postNavigation(navigation, route);
            return returnValue;
        },


        updateVisiblePages: function(deviceType, ignore) {
            var visiblePages = [];
            var last = this.public.lastElementChild;
            ignore = ignore || [];
            while (ignore.indexOf(last) !== -1) {
                last = last.previousElementSibling;
            }

            var queue = last ? [last] : [];
            while (queue.length > 0) {
                var container = queue.shift();

                if (types.page.prototype.isPrototypeOf(container)) {
                    visiblePages.unshift(container);
                } else {
                    // HACK - how do we indicate the owning page, lets try a new api
                    var page = container.querySelector('el-page');
                    var containers = Pane.getPrivate(page).protected.layout.getVisibleContainers(container, deviceType);
                    for (var i = containers.length - 1; i >= 0; i--) {
                        var c = containers[i];
                        if (ignore.indexOf(c) === -1) {
                            queue.push(c);
                        }
                    }
                }
            }

            this.visiblePages = visiblePages;
        },

        applyVisible: function() {
            for (var i = this.visiblePages.length - 1; i >= 0; i--) {
                var page = this.visiblePages[i];
                // lets at least use a cheap guard
                if (page.__id) {
                    Pane.getPrivate(page).protected.visible();
                } else {
                    this.visiblePages.splice(i, 1);
                }
            }
        },

        applyInvisible: function() {
            var len = this.pages.length;
            for (var i = 0; i < len; i++) {
                var page = this.pages[i];
                if (this.visiblePages.indexOf(page) === -1) {
                    // lets at least use a cheap guard
                    if (page.__id) {
                        Pane.getPrivate(page).protected.invisible();
                    } else {
                        this.visiblePages.splice(i, 1);
                    }
                }
            }
        }
    },

    init: function(params) {
        params = params || {};
        this.pages = Array.prototype.slice.call(this.public.querySelectorAll('el-page'));
        this.public.classList.add("el-stack-container");
        this.visiblePages = [];

        var self = this;
        this.onDeviceTypeChanged = function(deviceType) {
            if (self.public.visible) {
                App.requestAnimationFrame(self, function() {
                    this.updateVisiblePages(deviceType);
                    App.requestAnimationFrame(this, function() {
                        this.applyVisible();
                        this.applyInvisible();
                    });
                });
            }
        };
        App.device.addListener(this.onDeviceTypeChanged);
    },

    destroy: function() {
        App.device.removeListener(this.onDeviceTypeChanged);
        if (this.navigation) {
            this.finishNavigation(this.navigation);
        }
        compiler.destroy(this.pages);

        this.visiblePages = undefined;
        this.pages = undefined;
        this.onDeviceTypeChanged = undefined;
        this.transitionEndHandler = undefined;
        this.navigation = undefined;

        // Cancel all the active RAFs.
        App.cancelAnimationFrame(this);
    }
};

// until ecma5-extend can do non-function mixins
for (var k in stackNavigation.private) {
    module.exports.private[k] = stackNavigation.private[k];
}

},{"../../../shared/events":115,"../../../shared/utils":118,"../../app/app.js":78,"../../router":97,"../pane/index.js":91,"./navigation.js":93}],93:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var styles = window.elsa.utils.styles;

var App = require("../../app/app.js");
var Pane = require("../pane/index.js");

var states = {
    "Idle": {
        "navigate": "Start"
    },
    "Start": {
        "frame": "Transition",
        "cancel": "Idle",
    },
    "Transition": {
        "transitionend": "Idle",
        "cancel": "Idle"
    }
};

var changeState = function(self, input, param1, param2, param3) {
    /* State-Machine */
    var actions = states[self.navigationState];
    var newstate = actions && actions[input];
    if (!newstate) {
        return;
    }
    var oldstate = self.navigationState;
    if (Object.getPrototypeOf(self.public).constructor.debug) {
        console.log("stack.navigationState (" + input + ") " + oldstate + " => " + newstate);
    }
    self.navigationState = newstate;
    return true;
};

var NavigationEndEvent = "transitionend";

module.exports = {

    private: {

        navigationState: "Idle",

        postNavigation: function(navigation) {
            if (!changeState(this, "navigate", navigation)) {
                return;
            }

            this.navigation = navigation;
            this.public.classList.add("transitioning");
            this.pageTransitionRafId = App.requestAnimationFrame(this, function(navigation) {
                if (!navigation.target) {
                    if (!changeState(this, "frame")) {
                        return;
                    }
                    this.pageTransitionRafId = undefined;
                    this.finishNavigation(this.navigation);

                    return;
                } else {
                    this.pageTransitionRafId = App.requestAnimationFrame(this, this.postNavigationFrame, [navigation]);
                }
            }, [navigation]);
        },

        postNavigationFrame: function(navigation) {
            if (!changeState(this, "frame")) {
                return;
            }
            this.pageTransitionRafId = undefined;
            var i, page;

            this.navigationStarted(navigation);

            var self = this;
            var first = true;
            var container = navigation.targetLayout.container;
            var transitionEndHandler = this.transitionEndHandler = function(e) {
                if (e.target !== container) {
                    if (Object.getPrototypeOf(self.public).constructor.debug > 1) {
                        console.warn(e);
                    }
                    return;
                }
                container.removeEventListener(NavigationEndEvent, self.transitionEndHandler);
                self.postPageTransitionRafId = App.requestAnimationFrame(self, self.navigationTransitionEnd, [navigation]);
            };

            container.addEventListener(NavigationEndEvent, transitionEndHandler);
            this.transitionTarget = container;

            if (navigation.transition === "push") {
                container.classList.remove("animate-in-from");
            } else if (navigation.transition === "pop") {
                container.classList.add("animate-out-to");
            }
            if (Object.getPrototypeOf(this.public).constructor.debug) {
                console.log("stack.navigation.Animation", navigation.transition, navigation.target.routename + JSON.stringify(navigation.target.state));
            }
        },

        navigationTransitionEnd: function(navigation) {
            if (!changeState(this, "transitionend")) {
                return;
            }
            this.navigationEnded(navigation);
        },

        finishNavigation: function(navigation) {
            if (!changeState(this, "cancel")) {
                return;
            }
            if (this.pageTransitionRafId) {
                App.cancelAnimationFrame(this.pageTransitionRafId);
            }
            if (this.transitionTarget) {
                this.transitionTarget.removeEventListener(NavigationEndEvent, this.transitionEndHandler);
                this.transitionEndHandler = undefined;
            } else if (this.postPageTransitionRafId) {
                App.cancelAnimationFrame(this.postPageTransitionRafId);
                this.postPageTransitionRafId = undefined;
            } else {
                this.navigationStarted(navigation);
            }
            if (navigation.transition === "push") {
                navigation.targetLayout.container.classList.remove("animate-in", "animate-in-from");
            } else if (navigation.transition === "pop") {
                navigation.targetLayout.container.classList.remove("animate-out", "animate-out-to");
            }
            this.navigationEnded(navigation);
        },

        pushTransitionEnd: function(navigation) {
            navigation.targetLayout.container.classList.remove("animate-in");
        },

        popTransitionEnd: function(navigation) {
            navigation.targetLayout.remove();
            navigation.target = undefined;
        },

        navigationStarted: function(navigation) {
            var visible = this.public.visible;
            var ignore = [];
            if (visible) {
                if (navigation.transition === "pop") {
                    ignore = [navigation.target];
                }
            }
            this.updateVisiblePages(navigation.deviceType, ignore);
            if (visible) {
                this.applyVisible();
            }
        },

        navigationEnded: function(navigation) {
            this.postPageTransitionRafId = undefined;

            if (navigation.transition === "push") {
                this.pushTransitionEnd(navigation);
            } else if (navigation.transition === "pop") {
                this.popTransitionEnd(navigation);
            }
            this.navigation = undefined;
            this.transitionTarget = undefined;
            this.transitionEndHandler = undefined;

            if (this.navigation !== navigation) {
                this.public.classList.remove("transitioning");
            }

            if (this.public.visible) {
                this.applyInvisible();
            }
            setTimeout(function(todestroy) {
                for (var i = todestroy.length - 1; i >= 0; i--) {
                    var page = todestroy[i];
                    if (page && page.__id) {
                        window.elsa.compiler.destroy(page);
                    }
                }
            }, 0, navigation.destroy);
        },
    }
};

},{"../../app/app.js":78,"../pane/index.js":91}],94:[function(require,module,exports){
/* Copyright (C) 2014 BlackBerry Limited. Proprietary and confidential. */
if (typeof window.elsa === 'undefined') {
    throw Error("elsa-compiler must be loaded before elsa-core");
}

var compiler = window.elsa.compiler;

compiler.registerElement(require("./controls/page"));
compiler.registerElement(require("./controls/stack"));
compiler.registerElement(require("./controls/drawer"));
compiler.registerElement(require("./controls/import"));

/**
 * The main elsa module.
 * All elsa element types are available as properties of this module.
 *
 * @module elsa
 *
 * @property {App} App - the {@link App elsa.App} instance
 * @property {elsa.utils} utils - general utilities included with elsa
 * @property {elsa.compiler} compiler - the elsa {@link core.compiler compiler}
 * @property {function} compile - alias for {@link core.compiler#compile elsa.compiler.compile}
 * @property {function} destroy - alias for {@link core.compiler#destroy elsa.compiler.destroy}
 *
 */

Object.defineProperties(window.elsa, {
    /**
     * General utilities included with elsa
     * @class utils
     * @memberOf elsa
     *
     * @property {elsa.utils.styles} styles - {@link elsa.utils.styles}
     */

    App: {
        enumerable: true,
        writable: false,
        value: require("./app/app.js")
    },

    compile: {
        value: compiler.compile
    },

    destroy: {
        value: compiler.destroy
    }

});

//compiler.public.plugins.register("elsa", require("../plugins/elsa.js"));
//compiler.public.plugins.register("backbone", require("../plugins/backbone.js"));
//compiler.public.plugins.register("angular", require("../plugins/angular.js"));

module.exports = window.elsa;

},{"./app/app.js":78,"./controls/drawer":83,"./controls/import":84,"./controls/page":85,"./controls/stack":92}],95:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = window.Ecma5Extend.createType({

    name: "RouteErrorEvent",

    extend: window.CustomEvent,

    public: {
        base: {
            writable: false
        },
        route: {
            writable: false
        },
        state: {
            writable: false
        },
        source: {
            writable: false
        },

        message: {
            writable: false
        },
        toString: function() {
            return Object.getPrototypeOf(this.public).constructor.name + ": " + this.message;
        }
    },

    init: function(name, detail, properties) {
        for (var k in properties) {
            this[k] = properties[k];
        }
        if (!this.stack) {
            try {
                throw Error();
            } catch (e) {
                var lines = e.stack.split('\n');
                lines.splice(0, 2, 'RouteErrorEvent');
                this.public.stack = lines.join('\n');
            }
        }
    }

});

},{}],96:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = function(code, require) {
    var module = {};
    var exports;
    Object.defineProperty(module, "exports", {
        get: function() {
            return exports;
        },
        set: function(value) {
            exports = value;
        }
    });
    eval(code); // jshint ignore:line
    return exports;
};

},{}],97:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = window.elsa.compiler;

var path = require('path');
var errorUtils = require('../../shared/error-utils.js');
var xhrRequire = require('./xhr-require.js');
var RouteErrorEvent = require('./error.js');

var router;
var routes = {};
var routeMap = {};

Object.defineProperties(RouteErrorEvent, {
    "init": {
        configurable: true,
        value: function(properties) {
            return /*Object.getPrototypeOf(RouteErrorEvent)*/ RouteErrorEvent.create.call(this, "routeerror", {
                bubbles: true,
                cancelable: true
            }, properties);
        }
    }
});

/**
 * The elsa router.
 * The elsa router handles registering an loading of elsa routes.
 * It also provides a complete set of utility functions for elsa route string manipulation.
 *
 * @class router
 * @memberOf App
 */
var router = module.exports = {

    /**
     * @memberOf App.router#
     * {@link RouteErrorEvent}
     * @type {RouteErrorEvent}
     */
    RouteErrorEvent: RouteErrorEvent,

    xhr: xhrRequire,

    objectToParams: function(obj) {
        var params = [];
        for (var key in obj) {
            var value = obj[key];
            if (value === null || value === undefined) {
                params.push(key);
            } else {
                params.push(key + "=" + value);
            }
        }
        return params.join("&");
    },
    paramsToObject: function(params) {
        if (params === "") {
            return {};
        }
        var obj = {};
        params.split("&").forEach(function(p) {
            var kv = p.split("=");
            if (kv.length > 1) {
                obj[kv[0]] = kv[1];
            } else {
                obj[kv[0]] = null;
            }
        });
        return obj;
    },

    stringToCompoundRoute: function(route) {
        return route.split("/").map(function(r) {
            var split = r.split("?");
            return [split.shift(), router.paramsToObject(split.join("?"))];
        });
    },

    compoundRouteToString: function(compound) {
        return compound.map(function(spec) {
            var params = router.objectToParams(spec[1]);
            if (params.length > 0) {
                return spec[0] + "?" + params;
            } else {
                return spec[0];
            }
        }).join("/");
    },

    compareStates: function(a, b) {
        if (!a || !b) {
            return a === b;
        }
        var akeys = Object.keys(a);
        var bkeys = Object.keys(b);
        if (akeys.length !== bkeys.length) {
            return false;
        }
        for (var i = akeys.length - 1; i >= 0; i--) {
            if (a[akeys[i]] !== b[bkeys[i]]) {
                return false;
            }
        }
        return true;
    },

    /**
     * Register routes in the elsa router.
     * Each route is specified by a link (href) or route object with the following parameters:
     *  * path - path of this module
     *  * href - the href passed to the require function
     *
     * @memberOf App.router#
     * @param  {object} routes - A map of routenames to links/route objects
     * @param  {function(href)} lookupFn - A require-style module factory that will be called to instantiate modules by their href.
     * @param  {object} [elsaInfo] - The version of elsa which was used to develop the routes.
     */
    registerRoutes: function(_routes, lookupFn, info) {
        if (arguments.length < 3 && typeof lookupFn !== "function") {
            var decodedRoutes = {};
            for (var name in _routes) {
                var id = _routes[name];
                decodedRoutes[name] = {
                    path: id,
                    href: id,
                    name: name
                };
            }
            return router.registerRoutes(decodedRoutes, xhrRequire.require, info);
        }
        for (var route in _routes) {
            var imp = _routes[route];
            if (route.indexOf("/") >= 0) {
                route = route.replace("/", "");
            }
            if (typeof imp === "string") {
                imp = {
                    path: imp
                };
            }
            imp.name = imp.name || route;
            imp.require = lookupFn;
            imp.href = imp.href || imp.path;
            routes[route] = imp;
            routeMap[imp.path] = imp;
            //console.log("ROUTE  ", route, typeof lookupFn(imp.href));
        }
    },

    /**
     * Return the routename previously registered for a given path, or undefined if there is no routename associated with the path
     *
     * @memberOf App.router#
     * @param  {string} path - absolute path to an elsa module (Note: the root folder for an elsa module is the package name)
     * @return {string} routename registered for path
     */
    getRouteForPath: function(p) {
        return routeMap[p];
    },

    /**
     * Returns the routename registered for href relative to base.
     * @memberOf App.router#
     * @param  {string} base - the base path to resolve href
     * @param  {string} href - an elsa path (unix style)
     * @return {string} routename
     */
    resolveRoute: function(sourcepath, href) {
        if (href) {
            var id, route;
            if (href[0] === '/') {
                route = router.getRouteForPath(href);
            } else {
                if (sourcepath) {
                    if (href[0] === '.') {
                        id = path.normalize(path.join(path.dirname(sourcepath), href));
                    }
                    route = router.getRouteForPath(id);
                }
                if (!route) {
                    // fallback to /<route>.js
                    id = path.resolve("/" + href);
                    route = router.getRouteForPath(id);
                }
            }
            return route;
        }
    },

    getModule: function(routename) {
        return routes[routename];
    },

    loadModule: function(routename, state, parentControl, compoundRoute) {
        var imp = routes[routename],
            mod;
        if (!imp) {
            throw Error('elsa.router: Route not registered \'' + routename + '\'');
        }
        try {
            // user module toplevel execution
            mod = imp.require(imp.href);
        } catch (e) {
            errorUtils.log(e);
            return undefined;
        }
        var src = mod;
        if (mod === undefined) {
            throw Error('elsa.router: Module not found \'' + routename + '\' from  \'' + (imp.path || imp.href) + '\'');
        } else if (typeof mod !== "function") {
            mod = function() {
                return src;
            };
        } else {
            mod = function(a, b, c, d, e, f, g) {
                return src(a, b, c, d, e, f, g);
            };
        }
        mod.sourcepath = mod.sourcepath || imp.path;
        mod.require = mod.require || imp.require;
        mod.routename = routename;
        return compiler.compile(mod, parentControl);
    }
};

},{"../../shared/error-utils.js":114,"./error.js":95,"./xhr-require.js":98,"path":3}],98:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var path = require('path');
var evalTransform = require('./eval.js');
var RouteErrorEvent = require('./error.js');

var htmlTransform = function(response) {
    return response;
};

var underscoreTransform = function underscoreTransform(response) {
    return window._.template(response);
};

module.exports = {
    transforms: {
        'js': evalTransform,
        'json': JSON.parse,
        'html': htmlTransform,
        'jst': underscoreTransform,
        'tmpl': underscoreTransform
    },

    require: function xhrRequire(href) {
        //console.log('elsa.router.load: ' + href);
        var request = new XMLHttpRequest();

        request.open('GET', href, false); // `false` makes the request synchronous
        try {
            request.send(null);
        } catch (e) {}

        if (request.readyState === 4) {
            if (request.status !== 0 && (request.status < 200 || request.status >= 300)) {
                return;
            }
        }

        var extension = /[^.]*$/.exec(href)[0].toLowerCase();
        var plugin = module.exports.transforms[extension];

        if (plugin) {
            return plugin(request.response, function(id) {
                if (id[0] === '.') {
                    id = path.normalize(path.join(path.dirname(href), id));
                }
                return module.exports.require(id);
            });
        } else {
            throw new Error('No known require shim for file type: .' + extension);
        }
    }
};

},{"./error.js":95,"./eval.js":96,"path":3}],99:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var MODULES = [];
var compiling = false;

if (window.angular) {
    var angular = window.angular;

    angular.module("elsa", ["ngRoute", "ngLocale"]);

    require("./angular/ngRoute/ngRoute.js");
    require("./angular/ngHref/ngHref.js");

    angular.module("elsa").run(function($injector, $timeout) {
        var elsaAngular = window.elsa.compiler.plugins.get("angular");
        elsaAngular.controller.injector = $injector;
        window.elsa.compiler.templateCompiler = elsaAngular.compiler;
        window.elsa.list.templateType = window.elsa.list.templateType || require('../controls/list/templates/engines/angular.js')();
    });

    require("./angular/directives/events.js");
    require("./angular/directives/simple.js");
    require("./angular/directives/pane.js");
    require("./angular/directives/list.js");

    module.exports = {

        compiler: require("./angular/compiler.js"),

        controller: {

            create: function(el, controller, options) {},

            destroy: function(el) {}
        }

    };
}

},{"../controls/list/templates/engines/angular.js":45,"./angular/compiler.js":100,"./angular/directives/events.js":102,"./angular/directives/list.js":103,"./angular/directives/pane.js":104,"./angular/directives/simple.js":105,"./angular/ngHref/ngHref.js":106,"./angular/ngRoute/ngRoute.js":108}],100:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var angular = window.angular;

var scopeutil = require("./scopeutil.js");

module.exports = {
    defaultTemplateType: 'angular',
    DISABLEDdefaultTemplater: {
        engine: 'angular',
        parse: function(listItem, templateKey) {
            //angular.element(listItem)

            return listItem;
        },
        bind: function(parentControl, dom, data, key) {
            var $scope = angular.element(dom).scope();
            if (!$scope) {
                var injector = window.elsa.compiler.plugins.get("angular").controller.injector;
                injector.invoke(function($compile) {
                    var parent = angular.element(parentControl);
                    $scope = parent.scope().$new();
                    $scope.$apply(function($scope) {
                        $scope[$scope.listValueIdentifier] = data;
                    });
                    $compile(dom)($scope);
                });
            } else {
                $scope.$apply(function($scope) {
                    $scope[$scope.listValueIdentifier] = data;
                });
            }
        },
        clear: function() {

        },
        create: function(parentControl, text) {
            var $li = angular.element(document.createElement("li"));
            $li.html(text);
            var injector = window.elsa.compiler.plugins.get("angular").controller.injector;
            var scope = angular.element(parentControl).scope();
            var compiled;

            injector.invoke(function($compile) {
                /*$compile($li)(scope.$new(), function(clone, scope) {

                 });*/
                compiled = $compile($li);
            });
            //angular.element(parentControl).data(text, compiled);
            //parentControl[text] = compiled;
            return $li[0];
        },
        destroy: function(parentControl, li) {
            var $li = angular.element(li);
            $li.scope().destroy();
            $li.remove();
        }
    },
    create: function(el, state, params) {
        var $el = window.angular.element(el);
        $el.data("params", params);
        $el.data("state", state);
        if (params.sourcepath) {
            // TODO: check if needed
            var route = window.elsa.App.router.getRouteForPath(params.sourcepath);
            $el.data("routename", route.name);
        }

        var $scope, element;
        var injector = window.elsa.compiler.plugins.get("angular").controller.injector;
        if (injector) {
            var childCompiler = module.exports.compiler.creationCompletedQueue.length > 0;

            injector.invoke(function($rootScope, $compile) {
                var parent = params.parentControl;
                if (parent) {
                    $scope = window.angular.element(parent).scope();
                }
                if (!$scope) {
                    $scope = $rootScope;
                }

                element = window.angular.element(el);
                scopeutil.apply($scope, function() {
                    var compile = $compile(element);
                    compile($scope);
                });
            }, this);
        } else {
            console.warn("elsa.angular: Unable to get injector from document. Did you initialize angular?");
        }

        // disable the elsa compiler
        return true;
    },
    initialize: function(compiler) {
        module.exports.compiler = compiler;
    },
    compiler: undefined
};

},{"./scopeutil.js":109}],101:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var angular = window.angular;
var elsaAngular = angular.module("elsa");
var utils = require("../../../shared/utils");

var scopeutil = require("../scopeutil.js");
var angularParser = require("../compiler.js");

var ELEMENT_NODE = 1;

var destroyHandler = function() {
    var el = this;
    var element = angular.element(el);
    var scope = element.scope();

    //console.log("angular.DESTROY", el.tagName.slice(3).toLowerCase(), el.routename, JSON.stringify(el.state));
    Object.defineProperty(el, 'destroy', {
        configurable: true,
        value: undefined
    });

    if (scope && scope.hasOwnProperty('$route')) {
        var bindings = ['$route', '$routeParams', 'navigateTo'];
        var params = element.children().data("params");
        if (params) {
            params.parentControl = undefined;
        }
        if (scope.$route) {
            Object.defineProperty(scope.$route, "pane", {
                value: undefined,
                configurale: true
            });
        }
        element.children().remove();
        //console.log(scope.$route.pane.routename, JSON.stringify(scope.$route.pane.state));

        bindings.forEach(function(binding) {
            Object.defineProperty(scope, binding, {
                configurable: true,
                value: undefined
            });
        });
        scope.$destroy();
        scope = undefined;
    } else if (['EL-ACTION'].indexOf(el.tagName) !== -1) {
        // TODO: identify memory leak here
        //el.children.remove();
    }
    var events = ['statechange', '$destroy'];
    events.forEach(function(event) {
        element.off(event);
    });

    element.remove();

    element = undefined;
    Object.getPrototypeOf(el).destroy.call(el);
    el = undefined;
};

module.exports = function createObject(scope, element, el, attrs, $timeout) {
    var typename = el.tagName.slice(3).toLowerCase();

    if ("routename" in attrs) {
        element[0].setAttribute("data-routename", attrs.routename);
    }

    var type = elsa[typename];
    var params = element.inheritedData("params") || {};
    params.state = element.data("state");
    if (type.attributes && utils.contains("stateid", type.attributes)) {
        var stateid = attrs.stateid || attrs.label;
        element[0].setAttribute("data-stateid", utils.slugify(stateid));
    }
    element[0] = el = type.create(el, params);
    if (type.name === "import") {
        return {};
    }

    var childParams = {
        sourcepath: params.sourcepath,
        require: params.require,
        parentControl: el
    };
    element.children().data("params", childParams);

    element.one('$destroy', function() {
        if (this.destroy) {
            var self = this;
            $timeout(function() {
                if (self.destroy) {
                    self.destroy();
                }
            }, 0);
        }
    });
    angularParser.compiler.creationCompletedQueue.push(el);

    Object.defineProperty(el, 'destroy', {
        configurable: true,
        value: destroyHandler
    });

    return {
        attributes: type.attributes,
        events: type.events,
        modelDrivenAttribute: type.modelDrivenAttribute,
        typename: typename,
        bindings: ['destroy'],
        eventHandlers: ['$destroy']
    };
};

},{"../../../shared/utils":118,"../compiler.js":100,"../scopeutil.js":109}],102:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var scopeutil = require("../scopeutil.js");

var elsaAngular = window.angular.module('elsa');

var eventDirective = function($parse) {
    return {
        restrict: 'A',
        priority: 0,
        compile: function($element, attr) {
            // Event object is a simple object hash parsed without scope.
            // This means you can't do tricks like making your whole event obj conditional
            // e.g. el-on="foo ? {triggered: 'bar()'} : {triggered: 'baz()'}"
            var eventObj = $parse(attr.elOn)();
            var eventNames = Object.keys(eventObj);

            // Parse individual event handlers and save the scope
            // execution function for when they are actually triggered.
            var len = eventNames.length;
            for(var i = 0; i < len; i++) {
                eventObj[eventNames[i]] = $parse(eventObj[eventNames[i]]);
            }

            return function ngEventHandler($scope, $element) {
                var el = $element[0];

                // Generic trigger handler executes the $parsed expression
                // with the attribute's scope.
                var trigger = function(event) {
                    scopeutil.apply($scope, function() {
                        eventObj[event.type]($scope, {
                            $event: event
                        });
                    });
                };

                for(var i = 0; i < len; i++) {
                    el.addEventListener(eventNames[i], trigger);
                }

                $element.one('$destroy', function() {
                    for(var i = 0; i < len; i++) {
                        el.removeEventListener(eventNames[i], trigger);
                    }
                });
            };
        }
    };
};

elsaAngular.directive('elOn', ['$parse', eventDirective]);

},{"../scopeutil.js":109}],103:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var scopeutil = require("../scopeutil.js");
var createObject = require("./create.js");

var angular = window.angular;
var ELEMENT_NODE = 1;

function listDirective($timeout) {
    return {
        restrict: 'E',
        priority: 998,
        require: '?ngModel',
        compile: function($element, $attr) {
            return function($scope, $element, $attrs, ngModelCtrl) {
                var expression = $attr.listRepeat;
                var el = $element[0];
                if (el.nodeType !== ELEMENT_NODE || typeof el.__id === 'number') {
                    return;
                }

                var params = Object.create($element.inheritedData('params') || {});
                var info = createObject($scope, $element, el, $attrs, $timeout);

                if (!expression) {
                    return $element;
                }

                var list = el;

                // Below was ripped direct from ngRepeat.
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!match) {
                    throw new Error('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                }

                var lhs = match[1];
                var rhs = match[2];
                var aliasAs = match[3];
                var trackByExp = match[4];

                match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

                if (!match) {
                    throw new Error('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                }
                var valueIdentifier = match[3] || match[1];
                var keyIdentifier = match[2];

                if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(aliasAs))) {
                    throw new Error('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
                }

                $element.scope().listValueIdentifier = valueIdentifier;

                var observationHandler = function(prop, value) {
                    var coerced = parseInt(value);
                    coerced = !!coerced || (typeof value === 'string' && value.indexOf('[') === 0) ? JSON.parse(value) : value;
                    list[prop] = coerced;
                };

                var unobserves = [];
                for(var prop in $attrs) {
                    if(window.elsa.list.attributes.indexOf(prop) !== -1) {
                        unobserves.push($attrs.$observe(prop, observationHandler.bind(undefined, prop)));
                    }
                }

                if (ngModelCtrl) {
                    ngModelCtrl.$render = function() {
                        list.selectedIndices = ngModelCtrl.$viewValue;
                    };
                    var applySelection = function() {
                        scopeutil.apply($scope, function() {
                            ngModelCtrl.$setViewValue(list.selectedIndices);
                        });
                    };
                    list.addEventListener('selected', applySelection);
                }

                $scope.$watchCollection(rhs, function(collection) {
                    //TODO: Proper diffs on the collection.
                    list.collection = collection;
                });

                $element.one('$destroy', function() {
                    list.removeEventListener('selected', applySelection);

                    unobserves.forEach(function(fn) {
                        fn();
                    });
                    unobserves.length = 0;
                });

                return $element;
            };
        }
    };
}

listDirective.$inject = ['$timeout'];

window.angular.module('elsa').directive('elList', listDirective);

},{"../scopeutil.js":109,"./create.js":101}],104:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var angular = window.angular;
var elsaAngular = angular.module("elsa");

var scopeutil = require("../scopeutil.js");
var createObject = require("./create.js");

var ELEMENT_NODE = 1;

function stopPropagationHandler(event) {
    event.stopPropagation();
}

function getRouteParams() {
    return this.$route.pane.state;
}

function navigateTo(uri, replace) {
    if (uri[0] !== '.') {
        elsa.App.navigateTo(uri, replace);
    } else {
        this.$route.pane.navigateTo(uri, replace);
    }
}

function paneCommon(scope, element, el, attrs, transclude, route, $timeout) {
    var info = createObject(scope, element, el, attrs, $timeout);

    info.eventHandlers.statechange = function(e) {
        console.log('PANE.$routeChangeSuccess', e.target.__id === el.__id, el.routename, JSON.stringify(el.state));
        var scope = angular.element(this).scope();
        if (scope) {
            scopeutil.apply(scope, function() {
                scope.$emit('$routeChangeSuccess', e.state);
            });
        } else {
            console.warn("NO SCOPE");
        }
    };

    Object.defineProperties(scope, {
        '$routeParams': {
            get: getRouteParams,
            configurable: true
        },
        '$route': {
            value: Object.create(route, {
                pane: {
                    configurable: true,
                    value: el
                }
            }),
            configurable: true
        }
    });

    element[0].addEventListener('statechange', info.eventHandlers.statechange);
    scope.$on('$routeChangeSuccess', stopPropagationHandler);

    element.one('$destroy', function() {
        element[0].removeEventListener('statechange', info.eventHandlers.statechange);
    });
    return info;
}

function pageDirective($route, $compile, $timeout) {
    return {
        restrict: 'E',
        priority: 980,
        scope: true,
        controller: function($scope, $element, $attrs, $transclude) {
            var el = $element[0];
            if (el.nodeType !== ELEMENT_NODE || typeof el.__id === "number") {
                return;
            }

            var info = paneCommon($scope, $element, el, $attrs, $transclude, $route, $timeout);
            Object.defineProperties($scope, {
                'navigateTo': {
                    configurable: true,
                    value: navigateTo
                },
                'pop': {
                    configurable: true,
                    value: function() {
                        return el.stack.pop.apply(el.stack, arguments);
                    }
                },
                'toast': {
                    configurable: true,
                    value: function() {
                        return el.toast.apply(el, arguments);
                    }
                }
            });

            return $element;
        }
    };
}

pageDirective.$inject = ['$route', '$compile', '$timeout'];

function drawerDirective($route, $timeout) {
    return {
        restrict: 'E',
        priority: 980,
        scope: false,
        controller: function($scope, $element, $attrs, $transclude) {
            var el = $element[0];
            if (el.nodeType !== ELEMENT_NODE || typeof el.__id === "number") {
                return;
            }

            var info = paneCommon($scope, $element, el, $attrs, $transclude, $route, $timeout);

            return $element;
        }
    };
}

drawerDirective.$inject = ['$route', '$timeout'];

function stackDirective($route, $timeout) {
    return {
        restrict: 'E',
        priority: 980,
        scope: false,
        controller: function($scope, $element, $attrs, $transclude) {
            var el = $element[0];
            if (el.nodeType !== ELEMENT_NODE || typeof el.__id === "number") {
                return;
            }

            var info = paneCommon($scope, $element, el, $attrs, $transclude, $route, $timeout);
            /*
             * attrs.$watch('defaultRoute', function(value) { el.defaultRoute = value; })
             */

            return $element;
        }
    };
}

stackDirective.$inject = ['$route', '$timeout'];

function tabDirective($timeout) {
    return {
        restrict: 'E',
        priority: 980,
        scope: false,
        controller: function($scope, $element, $attrs, $transclude) {
            var el = $element[0];
            if (el.nodeType !== ELEMENT_NODE || typeof el.__id === "number") {
                return;
            }

            var info = createObject($scope, $element, el, $attrs, $timeout);

            return $element;
        }
    };
}

tabDirective.$inject = ['$timeout'];

elsaAngular.directive('elDrawer', drawerDirective);
elsaAngular.directive('elStack', stackDirective);
elsaAngular.directive('elPage', pageDirective);
elsaAngular.directive('elTab', tabDirective);

},{"../scopeutil.js":109,"./create.js":101}],105:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var angular = window.angular;
var elsaAngular = angular.module('elsa');
var scopeutil = require("../scopeutil.js");
var createObject = require('./create.js');

/**
* Observes attributes defined on the target type's `attributes` property
* and calls the target's setter with the new value when it updates.
* Returns an array of functions used to unobserve each attribute.
*/
var observeAttributes = function(el, target, attrs) {
    var isValidAttribute = function(key) {
        return typeof attrs[key] === 'string' && target.attributes && target.attributes.indexOf(key) !== -1;
    };

    var observeAttribute = function(key) {
        return attrs.$observe(key, function(value) {
            el[key] = value;
        });
    };

    return Object.keys(attrs).filter(isValidAttribute).map(observeAttribute);
};

/**
* Calls the supplied method immediately, with no arguments. Used to invoke an array
* of functions with `forEach`.
*/
var callMethod = function(method) {
    method();
};

var simpleDirective = function($parse, $timeout) {
    var ELEMENT_NODE = 1;

    return {
        restrict: 'E',
        priority: 980,
        scope: false,
        require: '?ngModel',
        compile: function(element, attrs) {
            return function(scope, element, attrs, ngModelCtrl, transclude) {
                var el = element[0];
                if (el.nodeType !== ELEMENT_NODE || typeof el.__id === 'number') {
                    return;
                }
                var object = createObject(scope, element, el, attrs, $timeout);
                var unobserves = observeAttributes(el, object, attrs);

                element.one('$destroy', function() {
                    unobserves.forEach(callMethod);
                });

                // bind model driven attributes to data and back
                if (object.modelDrivenAttribute && attrs.ngModel) {
                    var attr = object.modelDrivenAttribute.attr;
                    var evt = object.modelDrivenAttribute.event;

                    ngModelCtrl.$render = function() {
                        el[attr] = ngModelCtrl.$viewValue;
                    };

                    var setValue = function() {
                        ngModelCtrl.$setViewValue(el[attr]);
                    };

                    var applyValue = function() {
                        scopeutil.apply(scope, setValue);
                    };

                    el.addEventListener(evt, applyValue);
                    element.one('$destroy', function() {
                        el.removeEventListener(evt, applyValue);
                    });

                    setValue();
                }

                return element;
            };
        }
    };
};

simpleDirective.$inject = ['$parse', '$timeout'];

['Bar', 'Control', 'Draweritem', 'Action', 'Import', 'ExpandableAction', 'Tabs', 'Toggle', 'Activityindicator', 'Header', 'Dialog', 'Refresher'].forEach(function(name) {
    elsaAngular.directive('el' + name, simpleDirective);
});

},{"../scopeutil.js":109,"./create.js":101}],106:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

//TODO: evaluate a hash anywhere in the route to get out of the app
//URLs without a scheme or that don't start with a hash (#) are considered Elsa URLs
var nonElsaURLPattern = new RegExp('^[^/]*:|^#');

var ngHrefDirective = function() {
    function elsaUrl(str) {
        return !nonElsaURLPattern.test(str);
    }

    return {
        restrict: 'A',
        priority: 100, // regular href has priority 99
        link: function($scope, element, attr) {
            var clickHandler = function(e) {
                if (elsaUrl(attr.href)) {
                    e.preventDefault();
                    $scope.navigateTo(attr.href);
                }
            };

            element.bind('click', clickHandler);
            $scope.$on('$destroy', function() {
                element.unbind('click', clickHandler);
            });
        }
    };
};

window.angular.module('elsa').directive('ngHref', [ngHrefDirective]);
},{}],107:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = ["$rootScope", function($rootScope) {
    elsa.App.addEventListener('urlchange', function(e) {
        $rootScope.$broadcast('$locationChangeSuccess', e.currentRoute, e.oldRoute);
    });
    elsa.App.addEventListener('navigation', function(e) {
        if ($rootScope.$broadcast('$locationChangeStart', e.newRoute, e.oldRoute).defaultPrevented) {
            e.preventDefault();
        }
    });

    var geturl = function(value) {
        if (value) {
            return elsa.App.navigateTo(value);
        } else {
            return elsa.App.currentRoute;
        }
    };

    return {
        absUrl: function() {
            return window.location.href;
        },
        url: geturl,
        path: geturl,
        hash: geturl,
        protocol: function() {
            return window.location.protocol;
        },
        host: function() {
            return window.location.host;
        },
        port: function() {
            return window.location.port;
        },
        replace: function() {
            console.warn("Unsupported api: elsa does not support $location.replace()");
        },
        state: function() {
            console.warn("Unsupported api: elsa does not support $location.state()");
        },
        search: function() {
            console.warn("Unsupported api: elsa does not support $location.search()");
        }
    };
}];

},{}],108:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var angular = window.angular;

var ngRouteModule = window.angular.module('ngRoute', ['ng']).config(function($provide, $locationProvider, $controllerProvider, $compileProvider) {
    var locationProvider = Object.create($locationProvider, {
        $get: {
            value: require("./location.js")
        }
    });
    $provide.provider('$location', locationProvider);
});

var $routeMinErr = window.angular.$$minErr('ngRoute');

angular.module('ngRoute').provider('$routeParams', {
    $get: function() {
        return {};
    }
});

function $routeProvider() {

    var routes = {};

    this.when = function() {
        return this;
    };
    this.otherwise = function(route) {
        elsa.App.defaultRoute = route;
        return this;
    };

    this.$get = function($rootScope, $injector /*, $templateRequest,$sce*/ ) {

        var $route = {
            routes: routes,

            reload: window.location.reload,

            updateParams: function(newParams) {
                if (this.pane) {
                    this.pane.updateState(newParams);
                } else {
                    throw $routeMinErr('norout', 'Tried updating route when with no current route');
                }
            },

            replaceParams: function(newParams, notify) {
                if (this.pane) {
                    this.pane.replaceState(newParams, notify);
                } else {
                    throw $routeMinErr('norout', 'Tried updating route when with no current route');
                }
            }
        };

        Object.defineProperties($route, {
            params: {
                get: function() {
                    if (this.pane) {
                        return this.pane.state;
                    } else {
                        return {};
                    }
                }
            },
            current: {
                get: function() {
                    return this.pane ? this.pane.routename : undefined;
                }
            }
        });

        return $route;
    };
    this.$get.$inject = ['$rootScope', '$injector']; //, '$templateRequest','$sce'

    /** Events
     *
     * $routeChangeStart on $rootScope
     *
     * [DONE] $routeChangeSuccess on $rootScope
     *
     * $routeChangeError on $rootScope
     *
     * $routeUpdate on $rootScope
     *
     *
     ** Properties
     *
     * current { controller, locals }
     * routes
     *
     */
}


window.angular.module('ngRoute').provider('$route', $routeProvider);

},{"./location.js":107}],109:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

module.exports = {
    apply: function(scope, fcn) {
        //console.log("scope.APPLY", scope.$$phase);
        if (scope.$$phase) {
            fcn();
        } else {
            scope.$apply(fcn);
            //scope.$digest();
        }
    }
};

},{}],110:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var createPluginDelegate = function(self, fn) {
    return function(a, b, c, d, e) {
        fn(self, this, a, b, c, d, e);
    };
};

module.exports = {

    controller: {

        create: function(el, Module, options) {
            if (!Module) {
                console.warn("Unable to load backbone module: " + Module);
                return;
            }
            return new Module({
                el: el,
                data: options.data,
                /*parent : options.parent*/
            });
        },

        destroy: function(el, view) {
            view.remove();
            view.unbind();
        }
    },

    collection: {

        change: function(adapter, collection, model) {
            adapter.publish('change', model.changedAttributes(), collection.indexOf(model));
        },

        add: function(adapter, unused, model, collection, options) {
            adapter.publish('add', model, options.at);
        },

        remove: function(adapter, unused, model, collection, options) {
            adapter.publish('remove', model, options.index);
        },

        get: function(adapter, collection, index) {
            return collection.at(index).attributes;
        },

        indexOf: function(adapter, collection, item) {
            return collection.indexOf(item);
        },

        length: function(adapter, collection) {
            return collection.length;
        },

        bind: function(adapter, collection) {
            this.changeHandler = createPluginDelegate(adapter, this.change);
            this.addHandler = createPluginDelegate(adapter, this.add);
            this.removeHandler = createPluginDelegate(adapter, this.remove);

            collection.on('change', this.changeHandler);
            collection.on('add', this.addHandler);
            collection.on('remove', this.removeHandler);
        },
        unbind: function(adapter, collection) {
            collection.off('change', this.changeHandler);
            collection.off('add', this.addHandler);
            collection.off('remove', this.removeHandler);

            this.changeHandler = undefined;
            this.addHandler = undefined;
            this.removeHandler = undefined;
        }
    }

};

},{}],111:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var createPluginDelegate = function(self, fn) {
    return function(a, b, c, d, e) {
        fn(self, this, a, b, c, d, e);
    };
};

module.exports = {
    controller: {
        create: function(el, mod, options) {
            if (!mod) {
                console.warn("Unable to load Elsa module: " + mod);
                return;
            }
            var controller = Object.create(mod, {
                el: {
                    configurable: true,
                    writable: false,
                    value: el
                },
                data: {
                    configurable: true,
                    writable: true,
                    value: options.data
                }
            });

            if(typeof controller.create !== 'function') {
                throw new Error('Elsa controls must have a create method defined.');
            }

            controller.create();
            return controller;
        },
        destroy: function(el, controller) {
            if (typeof controller.destroy === 'function') {
                controller.destroy();
            }
        }
    },

    collection: {

        change: function(adapter, collection, index, value) {
            adapter.publish('change', value, index);
        },

        add: function(adapter, collection, index, value) {
            adapter.publish('add', value, index);
        },

        remove: function(adapter, collection, index) {
            adapter.publish('remove', undefined, index);
        },

        get: function(adapter, collection, index) {
            return collection[index];
        },

        indexOf: function(adapter, collection, item) {
            return collection.indexOf(item);
        },

        length: function(adapter, collection) {
            return collection.length;
        },

        bind: function(adapter, collection) {
            if (typeof collection.publish === "function") {
                this.changeHandler = createPluginDelegate(adapter, this.change);
                this.addHandler = createPluginDelegate(adapter, this.add);
                this.removeHandler = createPluginDelegate(adapter, this.remove);

                collection.subscribe('change', this.changeHandler);
                collection.subscribe('add', this.addHandler);
                collection.subscribe('remove', this.removeHandler);
            }
        },
        unbind: function(adapter, collection) {
            if (this.changeHandler) {
                collection.unsubscribe('change', this.changeHandler);
                collection.unsubscribe('add', this.addHandler);
                collection.unsubscribe('remove', this.removeHandler);

                this.changeHandler = undefined;
                this.addHandler = undefined;
                this.removeHandler = undefined;
            }
        }
    }
};

},{}],112:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var createPluginDelegate = function(self, fn) {
    return function(a, b, c, d, e) {
        fn(self, this, a, b, c, d, e);
    };
};

var initialized = false;
var initialize = function($) {
    var cleanData = $.cleanData;

    $.cleanData = function( elems ) {
        window.elsa.destroy(elems);
        return cleanData(elems);
    };
};

module.exports = {
    controller: {
        create: function(el, constructor, options) {
            if (!initialized) {
                initialize(module.exports.$ || $);
            }
            var $element = $(el);
            constructor($element);

            if(typeof constructor !== 'function') {
                throw new Error('jQuery controllers need to be a function.');
            }

            return $element;
        },
        destroy: function(el, $element) {
            $element.remove();
        }
    }
};

},{}],113:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var compiler = require('../core/compiler.js');

module.exports = {
    public: {
        content: {
            get: function() {
                if (!this.content) {
                    this.content = this.contentSelector ? this.public.querySelector(this.contentSelector) : this.public;
                }
                return this.content;
            },
            set: function(textOrEl) {
                if (!this.content) {
                    this.content = this.contentSelector ? this.public.querySelector(this.contentSelector) : this.public;
                    if (!this.content) {
                        throw Error('No content defined for ' + Object.getPrototypeOf(this.public).constructor.name + ': ' + this.public.routename + '. Did you forget to use <el-page-content></el-page-content?');
                    }
                }
                if (textOrEl) {
                    compiler.replaceDocumentFragment(this.content, textOrEl, this.public);
                } else {
                    compiler.destroyDocumentFragment(this.content);
                }
            }
        }
    },

    init: function() {},

    destroy: function() {
        this.content = undefined;
    }
};

},{"../core/compiler.js":65}],114:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

/*global Control:false*/

module.exports = {
    log: console.warn
};

var cssFcn = 'color:red; line-hight: 16px; font-weight: 600';
var cssLine = 'color:black; line-height: 16px';

if (console.groupCollapsed) {
    var stackExtractor = /^[ ]*at ([^ ]*)\b.* \(([^)]*)\)$/;
    var evalStackExtractor = /^[ ]*at ([^ ]+)\b.* \(eval at ([^ ]+) \(([^)]+)\), (.+)\)$/;
    module.exports.log = function(e) {
        var message = (e.name || e.constructor.name);
        if (e.code !== undefined) {
            message += "(" + e.code + ")";
        }
        message += ": " + e.message;

        console.groupCollapsed('%cx%c' + message,
            'border-radius: 9px; background-color: rgba(255,0,0,0.8); color: white; padding: 0px 3px 1px 3px;font-size: 8.5px; margin-right: 8px;',
            'color: red; font-weight: normal !important; line-height: 18px');

        var args = [],
            lines = [];
        e.stack.split("\n").slice(1).forEach(function(x) {
            var result = stackExtractor.exec(x);
            if (result) {
                args.push(cssFcn);
                args.push(cssLine);
                lines.push('%c' + result[1] + "%c    " + (new Array(Math.max(32 - result[1].length, 1))).join(" ") + result[2]);
            } else if ((result = evalStackExtractor.exec(x))) {
                args.push(cssFcn);
                args.push(cssLine);
                lines.push('%c' + result[2] + "%c    " + (new Array(Math.max(32 - result[2].length, 1))).join(" ") + result[4]);
                args.push(cssFcn);
                args.push(cssLine);
                lines.push('%c' + result[1] + "%c    " + (new Array(Math.max(32 - result[1].length, 1))).join(" ") + result[3]);
            } else {
                lines.push(x);
            }
        });
        args.unshift(lines.join("\n") + "%c");
        args.push('padding-right: 100%;');

        /* The error did not originate from this location,
         * this is only where it is reported. */
        console.log.apply(console, args);
        console.groupEnd();
    };
}

},{}],115:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var Extend = require('ecma5-extend');

var createEventType = function(name, eventProperties) {
    return function(properties) {
        properties = properties || {
            cancelable: false,
            bubbles: false
        };

        // Something annoying about CustomEvent is that all its
        // properties are readonly and not configurable. So existing
        // properties like `detail` need to be passed to the constructor.
        for (var k in eventProperties) {
            properties[k] = eventProperties[k];
        }

        var event = new CustomEvent(name, properties);

        // However if you want to set a property that isn't already defined
        // in CustomEvent such as `state` or `index` it needs to be added
        // to the event object after creation.
        for (var j in properties) {
            event[j] = properties[j];
        }

        return event;
    };
};

module.exports = {

    /**
     * Creates a function that when called, creates an event.
     *
     * @param {String} name The name of the event.
     * @param {Object} eventProperties Properties of the event, such as whether it bubbles or is cancelable.
     */
    createEventType: createEventType,

    // Since trigger is such a common event we cache the event factory.
    trigger: createEventType('trigger', {
        cancelable: true,
        bubbles: true
    })
};

},{"ecma5-extend":1}],116:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var InteractionType = {
    ANY: 'any',
    TOUCH: 'touch',
    MOUSE: 'mouse'
};

var INTERACTION_DURATION = 2000;

/**
 * A legacy quirk of mobile browsers is that they dispatch a corresponding 'mouse' event for every 'touch' event
 * a few frames after the touch. This means that with a quick tap you can get events in the following order:
 * touchstart, touchend, mousedown, mouseup. This looks like two taps to input agnostic code.
 *
 * Because of this we use a state machine that starts off able to accept any event type, but after getting the first event only
 * other events of that interaction type are accepted for the next 2 seconds. Each time a valid event is received
 * the timer resets. This strikes a balance between supporting both input types while circumventing legacy browser behaviour.
 */
var InteractionMode = module.exports = function InteractionMode() {
    if (this === InteractionMode) {
        return new InteractionMode();
    }

    this.interactionMode = InteractionType.ANY;
    this.reset = this.reset.bind(this);
};

InteractionMode.create = InteractionMode;

InteractionMode.prototype = {
    isValid: function(event) {
        var eventMode = event.type.indexOf('touch') === 0 ? InteractionType.TOUCH : InteractionType.MOUSE;
        if (this.interactionMode === eventMode || this.interactionMode === InteractionType.ANY) {

            // Only validate events of this type for the next two seconds.
            this.enter(eventMode);

            return true;
        }
        return false;
    },

    enter: function(mode) {
        clearTimeout(this.interactionModeResetId);

        this.interactionMode = mode;
        this.interactionModeResetId = setTimeout(this.reset, INTERACTION_DURATION);
    },

    reset: function() {
        this.interactionMode = InteractionType.ANY;
    },

    destroy: function() {
        clearTimeout(this.interactionModeResetId);
    }
};

},{}],117:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

var InteractionMode = require('./interactionMode.js');
/**
 * @class  OverlayTouch
 * @ignore
 */

var pointInRectDelta = function(x, y, r, delta) {
    return (x >= r.left - delta && x <= r.right + delta && y >= r.top - delta && y <= r.bottom + delta);
};

var OverlayTouch = module.exports = function OverlayTouch(el, passthrough, overlayCallback, passthroughCallback) {
    if (this === OverlayTouch) {
        return new OverlayTouch(el, passthrough, overlayCallback, passthroughCallback);
    }
    if (typeof el === "function") {
        overlayCallback = passthrough;
        passthrough = el;
        el = undefined;
    }
    if (typeof passthrough === "function") {
        passthroughCallback = overlayCallback;
        overlayCallback = passthrough;
        passthrough = undefined;
    }
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.callbacks = {
        overlay: overlayCallback,
        passthrough: passthroughCallback
    };
    if (el) {
        this.enableOverlayTouch(el, passthrough);
    }
    return this;
};

var validateEnd = function(eStart, eEnd, target) {
    var valid = true;
    if (eEnd.type.indexOf("mouse") === 0) {
        valid = target.contains(eEnd.target) === target.contains(eStart.target);
    } else {
        valid = pointInRectDelta(eEnd.changedTouches[0].clientX, eEnd.changedTouches[0].clientY,
                target.getBoundingClientRect(), 0) ===
            pointInRectDelta(eStart.touches[0].clientX, eStart.touches[0].clientY,
                target.getBoundingClientRect(), 0);
    }
    return valid;
};

OverlayTouch.create = OverlayTouch;

/**
 * @lends OverlayTouch#
 */
OverlayTouch.prototype = {

    hitAreaPadding: 10,

    enableOverlayTouch: function(target, passthrough) {
        if (passthrough) {
            this.passthrough = passthrough;
        }
        this.overlayElement = target;
        this.overlayElement.addEventListener("touchstart", this.onTouchStart, true);
        this.overlayElement.addEventListener("mousedown", this.onTouchStart, true);
        return this;
    },
    disableOverlayTouch: function() {
        // check if overlayTouch is enabled
        if (this.overlayElement) {
            document.body.removeEventListener("touchmove", this.onTouchMove, true);
            document.body.removeEventListener("touchend", this.onTouchEnd, true);
            document.body.removeEventListener("touchcancel", this.onTouchEnd, true);
            document.body.removeEventListener("mousemove", this.onTouchMove, true);
            document.body.removeEventListener("mouseup", this.onTouchEnd, true);
            document.body.removeEventListener("mouseleave", this.onMouseLeave, true);
            this.overlayElement.removeEventListener("touchstart", this.onTouchStart, true);
            this.overlayElement.removeEventListener("mousedown", this.onTouchStart, true);
            this.overlayElement = undefined;
        }
        this.state = "idle";
        return this;
    },

    onTouchStart: function(e) {
        var passthrough = this.passthrough.contains(e.target);
        this.stateChange(passthrough ? "pass" : "down", e);
    },

    onTouchMove: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    onTouchEnd: function(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
        this.stateChange("up", e);
        return true;
    },

    onMouseLeave: function(e) {
        if (e.target === this.overlayElement) {
            this.onTouchEnd(e);
        }
    },

    "idle-exit": function(e) {
        document.body.addEventListener("touchend", this.onTouchEnd, true);
        document.body.addEventListener("touchcancel", this.onTouchEnd, true);
        document.body.addEventListener("mouseup", this.onTouchEnd, true);
        document.body.addEventListener("mouseleave", this.onMouseLeave, true);
        this.startEvent = e;
    },

    "idle-enter": function(e) {
        document.body.removeEventListener("touchend", this.onTouchEnd, true);
        document.body.removeEventListener("touchcancel", this.onTouchEnd, true);
        document.body.removeEventListener("mouseup", this.onTouchEnd, true);
        document.body.removeEventListener("mouseleave", this.onMouseLeave, true);
        this.startEvent = undefined;
    },

    "track-enter": function(e) {
        e.stopPropagation();
        e.preventDefault();

        document.body.addEventListener("touchmove", this.onTouchMove, true);
        document.body.addEventListener("mousemove", this.onTouchMove, true);
    },

    "track-exit": function(e) {
        var valid = validateEnd(this.startEvent, e, this.passthrough);
        e.stopPropagation();

        if (valid && this.callbacks.overlay) {
            this.callbacks.overlay(e, this.overlayElement);
        }

        document.body.removeEventListener("touchmove", this.onTouchMove, true);
        document.body.removeEventListener("mousemove", this.onTouchMove, true);
    },

    "passthrough-enter": function(e) {
        this.passthroughTargetBounds = e.target.getBoundingClientRect();
    },

    "passthrough-exit": function(e) {
        var eStart = this.startEvent,
            valid = validateEnd(eStart, e, this.passthrough);

        if (valid) {
            var clientX = e.clientX || e.changedTouches[0].clientX;
            var clientY = e.clientY || e.changedTouches[0].clientY;
            if (pointInRectDelta(clientX, clientY, this.passthroughTargetBounds, this.hitAreaPadding)) {
                if (this.callbacks.passthrough) {
                    e.originalTarget = eStart.target;
                    e.originalTouch = eStart;
                    this.callbacks.passthrough(e, this.overlayElement);
                } else if (e.type.indexOf("mouse") === -1) {
                    var click = document.createEvent("MouseEvents");
                    click.initMouseEvent("click", true, true, document.defaultView,
                        e.detail, clientX, clientY, clientX, clientY,
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
                    click.forwardedTouchEvent = true;
                    e.target.dispatchEvent(click);
                }
            }
        }
        this.passthroughTargetBounds = undefined;
    },

    state: "idle",
    stateChange: function(input, param1, param2, param3) {
        /* State-Machine */
        var states = {
            "idle": {
                "down": "track",
                "pass": "passthrough"
            },
            "track": {
                "up": "idle",
            },
            "passthrough": {
                "up": "idle",
            },
        };

        var actions = states[this.state];
        var newstate = actions && actions[input];
        if (newstate) {
            var oldstate = this.state;
            //console.log("overlayTouch.state (" + input + ") " + oldstate + " => " + newstate);
            this.state = newstate;

            var exitHandler = this[oldstate + "-exit"];
            if (typeof exitHandler === "function") {
                exitHandler.call(this, param1, param2, param3);
            }
            var enterHandler = this[newstate + "-enter"];
            if (typeof enterHandler === "function") {
                enterHandler.call(this, param1, param2, param3);
            }
            return this.state;
        }
    },

    destroy: function() {
        this.disableOverlayTouch();
        this.startEvent = undefined;
        this.passthroughTargetBounds = undefined;
        this.callbacks = undefined;
    }

};

},{"./interactionMode.js":116}],118:[function(require,module,exports){
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */


var getSwipeInteractionPositionX = function(event) {
    return event.clientX || (event.touches && event.touches.length ? event.touches[0].clientX : 0);
};

var getSwipeInteractionPositionY = function(event) {
    return event.clientY || (event.touches && event.touches.length ? event.touches[0].clientY : 0);
};

var getDeltaX = function(event) {
    return event.deltaX;
};

var getDeltaY = function(event) {
    return event.deltaY;
};

var clientDimensionLookup = {
    width: 'clientWidth',
    height: 'clientHeight'
};

module.exports = {
    applyAttributes: function applyAttributes(el, tags) {
        if (!tags) {
            return;
        }
        for (var i = 0; i < tags.length; i++) {
            var tagspec = tags[i].split(":");
            var attr = "data-" + tagspec[0];
            var prop = tagspec.length > 1 ? tagspec[1] : tagspec[0];
            el[prop] = el.getAttribute(prop) || el.getAttribute(attr);
        }
    },
    getInteractionPositionMethod: function getInteractionPositionMethod(prop) {
        return prop === 'x' ? getSwipeInteractionPositionX : getSwipeInteractionPositionY;
    },
    getEventDelta: function getEventDelta(prop) {
        return prop === 'x' ? getDeltaX : getDeltaY;
    },
    getElementSize: function getElementSize(elem, dimension) {
        if (elem.cachedSize && elem.cachedSizeDimension === dimension) {
            return elem.cachedSize;
        }

        // Can't work with % values, only px.
        var cssSize = elem.style[dimension];
        cssSize = (cssSize.indexOf('px') === -1) ? null : parseInt(cssSize);

        // Start by looking for an explicit size in the CSS,
        // then calculate the clientSize and finally as a
        // last resort do a getComputedStyle.
        elem.cachedSize = cssSize || elem[clientDimensionLookup[dimension]] || parseInt(window.getComputedStyle(elem)[dimension]);
        elem.cachedSizeDimension = dimension;
        return elem.cachedSize;
    },
    slugify: function(text) {
        return text.toString().toLocaleLowerCase()
            .replace(/[\s.\-\/?&]+/g, '-') // Replace spaces with -
            .replace(/[\u2000-\u206F\u20A0-\u20CF\u2200-\u22FF\u2E00-\u2E7F]+/g, '') // Remove all non-word chars
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    },
    getAttribute: function(el, attr) {
        return el.getAttribute(attr) || el.getAttribute("data-" + attr);
    },
    contains: function(value, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    },
    capitaliseFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

},{}]},{},[77])(77)
});


//# sourceMappingURL=elsa.map