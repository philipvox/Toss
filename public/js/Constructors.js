
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function(array) {
        if (!array) return false;
        if (this.length != array.length) return false;
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i])) return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
Array.prototype.giveBack = function(needle, propOne, propTwo) {
    for (i in this) {
        if (propTwo) {
            if (this[i][propOne][propTwo] == needle) return this[i];
        } else {
            if (this[i] == needle) return this[i];
        }
    }
}
Array.prototype.contains = function(needle, propOne, propTwo) {
    for (i in this) {
        if (propTwo) {
            if (this[i][propOne][propTwo] == needle) return true;
            else {
                return false
            }
        } else {
            if (this[i] == needle) return true;
            else {
                return false
            }
        }
    }
}

count = function(ary, classifier) {
    return ary.reduce(function(counter, item) {
        if (item != undefined) {
            var p = (classifier || String)(item);
            counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
            return counter;
        }
    }, {})
}

function angleDeg(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function threeDeg(p1, p2, p3) {
    var p12 = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    var p13 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));
    var p23 = Math.sqrt(Math.pow((p2.x - p3.x), 2) + Math.pow((p2.y - p3.y), 2));
    //angle in radians
    var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));
    //angle in degrees
    return resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function setColor(object, color, s, bool) {
    object.color = color;
    if (bool) {
        object.stroke = true;
        object.strokeColor = s;
    } else {
        object.stroke = false;
    }
}

function roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
}