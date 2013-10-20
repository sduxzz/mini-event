/**
 * mini-event
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 事件对象类
 * @author otakustay
 */
define(
    function (require) {
        var lib = require('./lib');

        function returnTrue() { return true; }
        function returnFalse() { return false; }

        /**
         * 事件类
         *
         * @param {string=} type 事件类型
         * @param {Mixed=} args 事件中的数据
         * @constructor
         */
        function Event(type, args) {
            // 3个重载：
            //
            // - `new Event(type)`
            // - `new Event(args)`
            // - `new Event(type, args)`

            // 只提供一个对象作为参数，则是`new Event(args)`的形式，需要加上type
            if (arguments.length === 1 && typeof type === 'object') {
                args = type;
                type = args.type;
            }

            if (typeof args === 'object') {
                lib.extend(this, args);
            }
            else if (args) {
                this.data = args;
            }

            if (type) {
                this.type = type;
            }
        }

        /**
         * 判断默认行为是否已被阻止
         *
         * @return {boolean}
         */
        Event.prototype.isDefaultPrevented = returnFalse;

        /**
         * 阻止默认行为
         */
        Event.prototype.preventDefault = function () {
            this.isDefaultPrevented = returnTrue;
        };

        /**
         * 判断事件传播是否已被阻止
         *
         * @return {boolean}
         */
        Event.prototype.isPropagationStopped = returnFalse;

        /**
         * 阻止事件传播
         */
        Event.prototype.stopPropagation = function () {
            this.isPropagationStopped = returnTrue;
        };

        /**
         * 判断事件的立即传播是否已被阻止
         *
         * @return {boolean}
         */
        Event.prototype.isImmediatePropagationStopped = returnFalse;

        /**
         * 立即阻止事件传播
         */
        Event.prototype.stopImmediatePropagation = function () {
            this.isImmediatePropagationStopped = returnTrue;

            this.stopPropagation();
        };

        var globalWindow = (function () { return this; }());

        /**
         * 从DOM事件对象生成一个Event对象
         *
         * @param {Event} domEvent DOM事件对象
         * @param {string=} type 事件类型
         * @param {Mixed=} args 事件数据
         * @return {Event}
         */
        Event.fromDOMEvent = function (domEvent, type, args) {
            domEvent = domEvent || globalWindow.event;

            var event = new Event(type, args);

            event.preventDefault = function () {
                if (domEvent.preventDefault) {
                    domEvent.preventDefault();
                }
                else {
                    domEvent.returnValue = false;
                }

                Event.prototype.preventDefault.call(this);
            };

            event.stopPropagation = function () {
                if (domEvent.stopPropagation) {
                    domEvent.stopPropagation();
                }
                else {
                    domEvent.cancelBubble = true;
                }

                Event.prototype.stopPropagation.call(this);
            };

            event.stopImmediatePropagation = function () {
                if (domEvent.stopImmediatePropagation) {
                    domEvent.stopImmediatePropagation();
                }

                Event.prototype.stopImmediatePropagation.call(this);
            };

            return event;
        };

        return Event;
    }
);
