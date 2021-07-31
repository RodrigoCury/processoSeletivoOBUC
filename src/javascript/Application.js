const DOM = require('./DOM');
const Icons = require('./icons')
const SessionStorage = require('./SessionStorage')


class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        this.icons = new Icons()
        this.sessionStorage = new SessionStorage();
        this.DOM = new DOM({
            icons: this.icons,
            SessionStorage: this.sessionStorage
        })
    }
}

module.exports = Application