class LocalDeTrabalho {
    constructor({ id, predio, local }) {
        this.id = id;
        this.predio = predio
        this.local = local
    }

    alterar({ predio, local }) {
        this.predio = predio
        this.local = local
    }
}

module.exports = LocalDeTrabalho