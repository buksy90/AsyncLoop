"use strict";

/**
 * Allows to handle recursive asynchronous functions in a loop way.
 * 
 * AsyncLoop will call your "bodyFn" as long as it returns Promise like object 
 * (object with .then and .catch properties). Once your loopFn returns "false"
 * AsyncLoop stops and calls your "thenFn", if any.
 * 
 * @param loopFn {function}
 * @return {{catch: _catch, then: _then}}
 * @constructor
 */
var AsyncLoop = function(bodyFn) {
    var iteration = -1;
    var catchFn = null;
    var internalResolve = null;
    var internalPromise = new Promise(function(resolve) {
        internalResolve = resolve;
        Promise.resolve(null).then(_while);
    });


    /**
     * Throw error, if user defined "catchFn" is defined, use that,
     * otherwise just print error to console
     *
     * @param msg {string|object}
     * @private
     */
    function _throw(msg) {
        if(catchFn) catchFn(msg);
        else console.error(msg);
    }

    
    /**
     * Main function that runs iterations
     *
     * @private
     */
    function _while() {
        // Create arguments array for "loopFn", set iteration index as first value
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        args.unshift(++iteration);

        var result = bodyFn.apply(null, args);
        if(result === false) {
            return internalResolve();
        }

        if(!result || !result.then || !result.catch) return _throw({
            message: "Iteration "+iteration+" didn't returned thenable & catchable object",
            returned: result
        });

        result
            .then(_while)
            .catch(_throw);
    }

    
    /**
     * Set function that will be catching every iteration
     *
     * @param catchFunction {function}
     * @return {Object}
     * @private
     */
    function _catch(catchFunction) {
        catchFn = catchFunction;

        return api;
    }


    /**
     * Executes function "doneFn" after all loop iterations are done
     *
     * @param doneFn {function}
     * @return {Object}
     */
    function _finished(doneFn) {
        internalPromise.then.apply(internalPromise, arguments);

        return api;
    }


    var api = { 
        catch: _catch, 
        finished: _finished,
        promise: internalPromise
    };
    
    return api;
};
