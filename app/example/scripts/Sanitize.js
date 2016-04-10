/*
 * A very simple class to sanitize JS input
 * currently supports:
 *  - XSS prevention on string
 *  - Floating point check
 */
var Sanitize = class {
    constructor(input, type) {
        this.input = input;
        this.type = type;
    }
    isFloat(n) {
        return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
    }
    validateXSS(str) {
        // some basic xss tags to prevent
        // will add more later
        var xssCodes = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&#x2f;', '<script>', '\'', '\"'];
        
        for (var i = 0; i < xssCodes.length; i++) {
            if (str.indexOf(xssCodes[i]) !== -1) {
                return false;
            }
        }
        return true;
    }
    validate() { // true if sane input, false otherwise
        switch (this.type) {
        case String:
            return this.validateXSS(this.input);
        case Number:
            return this.isFloat(this.input);
        }
    }
};

