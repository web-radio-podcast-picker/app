// data lib functions

// eval expr. handle error. returns success: true and value: value if ok otherwize success: false. eventually log
function xeval(expr, showError) {

    try {
        const value = eval(expr)
        return { success: true, value: value }
    } catch (err) {
        // ignore or debug
        if (settings.debug.trace)
            console.log(expr, err.message)
        window.err = err
        if (settings.debug.stackTrace)
            console.log(err)
        //console.debug(err)
        return { success: false }
    }
}

function deepClone(obj) {
    if (null == obj || obj == undefined || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
