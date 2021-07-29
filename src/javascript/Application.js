// DOM
const DOM = require('./DOM');

class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        this.setDOMElements()
    }

    setDOMElements() {
        this.DOM = new DOM()
    }

}

module.exports = Application