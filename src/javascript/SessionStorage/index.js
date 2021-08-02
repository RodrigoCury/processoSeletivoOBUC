const LocalDeTrabalho = require('../dataclasses/LocalDeTrabalho');

class SessionStorage {
    constructor() {
        this.arrLocaisTrabalho = []

        this.setupList()
    }

    setupList() {
        Object.keys(sessionStorage).forEach(key => {
            // Parsea de volta para JSON
            const obj = JSON.parse(sessionStorage.getItem(key))

            const localDeTrabalho = new LocalDeTrabalho({
                id: obj.id,
                predio: obj.predio,
                local: obj.local
            })

            this.arrLocaisTrabalho.push(localDeTrabalho)
        })
    }

    editarLocal(id, predio, local) {
        // Acessar o arquivo no session Storage
        const item = JSON.parse(sessionStorage.getItem(id))

        let indiceNoArray = 0

        this.arrLocaisTrabalho.forEach((obj, idx, arr) => {
            if (item.id === obj.id) { indiceNoArray = idx }
        })

        if (id === item.id && predio === item.predio && local === item.local) {
            return // Não Houve mudanças
        }

        // Validar Edição
        this.validarLocal({ id, predio, local })

        // Altera o valor no arrLocais Trabalho
        this.arrLocaisTrabalho[indiceNoArray].alterar({ predio, local })

        // Altera o valor no sessionStorage
        sessionStorage.setItem(id, JSON.stringify(this.arrLocaisTrabalho[indiceNoArray]))

    }

    adicionar(predio, local) {
        const id = this.idSetter()

        // cria novo Objeto LocalDeTrabalho que Valida as entradas
        const novoLocal = new LocalDeTrabalho({ id, predio, local })

        this.validarLocal(novoLocal)

        sessionStorage.setItem(id, JSON.stringify(novoLocal))

        this.arrLocaisTrabalho.push(novoLocal)

        return novoLocal
    }

    excluirLocal(id) {

        let indexNoArray = 0
        this.arrLocaisTrabalho.forEach((obj, idx) => {
            if (obj.id === id) {
                indexNoArray = idx
            }
        })

        this.arrLocaisTrabalho.splice(indexNoArray, 1)

        sessionStorage.removeItem(id)


    }

    acessarPorId(id) {
        const obj = JSON.parse(sessionStorage.getItem(id))

        if (!obj) {
            throw new Error("Não encontrado o ID")
        }

        return obj
    }

    // Função que cria ID's como um DB SQL em que ele não retorna ID já usado, menos o ultimo ID pq isso necessitaria de um log // Good enough!
    idSetter() {
        if (!sessionStorage.length) {
            // Se Storage está vazio retorna o ID 1
            return 1
        } else {
            // Procura o Maior ID do DB e retorna o Maior + 1
            let maiorID = -999

            for (let id of Object.keys(sessionStorage)) {
                id = parseInt(id)

                if (id > maiorID) {
                    maiorID = id
                }
            }
            return (maiorID + 1)
        }
    }

    validarLocal({ id, local, predio }) {
        if (local === "" || predio === "") { // Input Vazia
            const erro = new Error("Entrada Inválida")
            erro.idErro = local === "" ? 0 : 1
            throw erro
        } else if (sessionStorage.length && this.checarPorDuplicatas({ id, local, predio }) !== undefined) { // Input ja existe no BD
            const erro = new Error("Entrada Já Existe")
            erro.idErro = 2
            throw erro
        }
        return
    }

    checarPorDuplicatas({ id, local, predio }) {
        return Object.values(sessionStorage).find(value => {
            // Parse para Object
            const obj = JSON.parse(value)

            // Checa se os valores são iguais
            if (obj.local === local && obj.predio === predio) {

                // Não é duplicata mas sim o mesmo objeto

                if (obj.id.toString() === id) {
                    return false
                }

                // Se sim a função finaliza e retorna o objeto
                return true
            }
            // Se não a Função retorna undefined
            return false
        })
    }

}

module.exports = SessionStorage