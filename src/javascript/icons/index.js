const feather = require('feather-icons')

class Icons {
    constructor() {
        this.setupIcons()
    }

    setupIcons() {
        this.homeIcon = feather.icons.home.toSvg({
            class: "home-feather",
            color: "#FFF",
            'stroke-width': 1.5,
        })

        this.userIcon = feather.icons.user.toSvg({
            class: "user-feather",
            color: "#FFF",
            'stroke-width': 1.5,
        })

        this.gearIcon = feather.icons.settings.toSvg({
            class: "user-feather",
            color: "#FFF",
            'stroke-width': 1.5,
            height: '1em',
            width: '1em'
        })

        this.editIcon = feather.icons['edit-3'].toSvg({
            class: "edit-feather",
            color: "#001b2b",
            'stroke-width': 1.5,
        })

        this.trashIcon = feather.icons['trash-2'].toSvg({
            class: "trash-feather",
            color: "#001b2b",
            'stroke-width': 1.5,
        })

        this.checkIcon = feather.icons.check.toSvg({
            class: "check-feather",
            color: "#001b2b",
            'stroke-width': 1.5,
        })

        this.xIcon = feather.icons.x.toSvg({
            class: "x-feather",
            color: "#001b2b",
            'stroke-width': 1.5,
        })
    }
}

module.exports = Icons