var Readable = require('readable-stream').Readable
    Generator = (function*(){}).constructor
;

function StreamGenerators(g) {
    if (!(g instanceof Generator))
        throw new TypeError('First argument must be a ES6 Generator');

    Readable.call(this, {objectMode:true});

    this._g = g();
}

StreamGenerators.prototype = Object.create(Readable.prototype, {constructor: {value: StreamGenerators}});

StreamGenerators.prototype._read = function(size) {
    try {
        do {
            var r = this._g.next();

            if (r.done) {
                this.push(null);
                break;
            }
        } while (this.push(r.value));
    } catch (e) {
        this.emit('error', e);
    }
};

module.exports = function(list) {
    return new StreamGenerators(list);
};
