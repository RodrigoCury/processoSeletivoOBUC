const sorttable = require('sorttable/sorttable.js') // Biblioteca para ajustar a ordem dos items de uma tabela

class DOM {
    /**
     * Constructor
     */
    constructor({ icons, SessionStorage }) {
        // Setup
        this.$ = document.querySelector.bind(document)
        this.body = this.$('body')

        this.sessionStorage = SessionStorage

        this.icons = icons

        this.setupElements()
        this.setupIcons()
        this.setupNavList()
        this.setupSessionItems()
        this.setupForm()
        this.setupHelperFunctions()
    }

    setupElements() {
        // Header
        this.homeBtn = this.$('.home-btn')
        this.userSvg = this.$('.user-svg')

        // Nav
        this.navTitleIcon = this.$('.nav-gear')
        this.navUl = this.$('.navbar-ul')

        // Form
        this.seletorPredio = this.$("#predios")
        this.workplaceInput = this.$('#locais')
        this.submitBtn = this.$('.task-submit')

        // Tabela
        this.tbody = this.$(".table-body")
    }

    setupIcons() {
        // Adicionar Icones
        this.homeBtn.innerHTML = this.icons.homeIcon
        this.userSvg.innerHTML = this.icons.userIcon
        this.navTitleIcon.innerHTML = this.icons.gearIcon
    }

    setupNavList() {
        // Lista de objetos com informações para os botões
        const listBtns = [
            {
                title: 'Administradores',
                href: "#",
                selected: false,
            }, {
                title: 'Áreas',
                href: "#",
                selected: false,
            }, {
                title: 'Locais de Trabalho',
                href: "#",
                selected: true,
            }, {
                title: 'Habilidades',
                href: "#",
                selected: false,
            }, {
                title: 'Log',
                href: "#",
                selected: false,
            }, {
                title: 'Responsáveis',
                href: "#",
                selected: false,
            }
        ]

        listBtns.forEach(item => {

            // Cria Tag
            const a = document.createElement('a')

            // Adiciona Classes a Tag
            a.classList.add('nav-a')

            // Se o item estiver Selecionado receberá Classe para estilização posterior
            if (item.selected) {
                a.classList.add('selected')
            }

            a.textContent = item.title
            a.href = item.href;

            const li = document.createElement('li')
            li.classList.add("nav-li")

            li.appendChild(a)

            this.navUl.appendChild(li)
        })
    }

    setupSessionItems() {
        this.sessionStorage.arrLocaisTrabalho.forEach(obj => this.adicionarItemNaLista(obj))
    }

    setupForm() {
        // Onclick
        this.submitBtn.addEventListener('click', event => this.finalizarForm(event))

        // onEnter
        this.workplaceInput.addEventListener('keydown', event => {
            if (event.key === "Enter") {
                this.finalizarForm(event)
            }
        })
        this.seletorPredio.addEventListener('keydown', event => {
            if (event.key === "Enter") {
                this.finalizarForm(event)
            }
        })
    }

    finalizarForm(event) {
        event.preventDefault()

        // Parsear os dados a serem salvos
        const predio = [...this.seletorPredio.childNodes].filter(opt => opt.selected)[0].value // Devolve o Selecionado
        const local = this.workplaceInput.value

        try {
            // Chama o DAO para criar Novo Local
            const novoLocal = this.sessionStorage.adicionar(predio, local)

            // Cria novo TR
            this.adicionarItemNaLista(novoLocal)

            // Remove Mensagens de Erro
            this.workplaceInput.classList.remove("invalid-text")
            this.workplaceInput.placeholder = ""

        } catch (error) { // Se Erro for Levantado Lidará com o Erro
            this.workplaceInput.classList.add("invalid-text")
            this.workplaceInput.placeholder = error.message
        }

        this.workplaceInput.value = ""
    }

    adicionarItemNaLista({ predio, local, id }) {
        // Garante que od ID será em String
        id = typeof id === "Number" ? id.toString() : id

        // Cria Table Row
        const tr = document.createElement("tr")
        tr.classList.add("body-row")
        tr.setAttribute("id", `local-${id}`)

        // Td's
        const tdPredio = document.createElement('td')
        const tdLocal = document.createElement('td')
        const tdEditDelete = document.createElement('td')

        // Acerta Valores
        tdPredio.classList.add("td-predio")
        tdPredio.innerHTML = predio

        tdLocal.classList.add("td-local")
        tdLocal.innerHTML = local

        tdEditDelete.classList.add("td-EditDelete")
        tdEditDelete.innerHTML += this.icons.editIcon
        tdEditDelete.innerHTML += this.icons.trashIcon
        tdEditDelete.firstChild.setAttribute("id", `edit-${id}`);
        tdEditDelete.firstChild.onclick = event => this.editar(event) // Adiciona Event Listener de Edição
        tdEditDelete.lastChild.setAttribute("id", `delete-${id}`);
        tdEditDelete.lastChild.onclick = event => this.excluir(event) // Adiciona Event Listener de Exclusão

        tdPredio.ondblclick = event => this.editar(event)
        tdLocal.ondblclick = event => this.editar(event)

        tr.appendChild(tdPredio)
        tr.appendChild(tdLocal)
        tr.appendChild(tdEditDelete)

        this.tbody.appendChild(tr)
    }

    editar(event) {
        // Checa se o elemento clicado foi o Blobk do SVG ou o Path interno do SVG e retorna o id de maneira correta
        const id = this.helpers.getElementId(event)

        // Acessa os elementos para alterar
        const tdPredio = this.$(`#local-${id}`).childNodes[0]
        const tdLocais = this.$(`#local-${id}`).childNodes[1]
        const tdEditDelete = this.$(`#local-${id}`).childNodes[2]

        // Salva o valor anterior para o value do input
        const valorAnterior = tdLocais.innerHTML

        // Clona o input do formulario e adiciona classes e id necessario
        const seletorPredioClone = this.seletorPredio.cloneNode(true)
        seletorPredioClone.classList.add("tr-input")
        seletorPredioClone.classList.add("tr-select")
        seletorPredioClone.setAttribute("id", `locais-${id}-select`)

        // Clona o input do formulario e adiciona classes e id necessario
        const seletorLocalClone = this.workplaceInput.cloneNode(true)
        seletorLocalClone.classList.add("tr-input")
        seletorLocalClone.setAttribute("id", `locais-${id}-text`)
        seletorLocalClone.setAttribute("value", valorAnterior)

        // Troca os icones de Editar e deletar para Confirmar e cancelar respectivamente
        tdEditDelete.innerHTML = this.icons.checkIcon
        tdEditDelete.innerHTML += this.icons.xIcon

        /*
         * Usando os ids como ferramenta de acesso resultará em falhas de segurança, 
         * mas, por questão de tempo não vou implementar uma solução para isso
         */

        // Troca o inner HTML para os inputs
        tdPredio.innerHTML = seletorPredioClone.outerHTML

        tdLocais.innerHTML = seletorLocalClone.outerHTML

        // Ajusta o Foco para Edição Automaticamente para melhor usabilidade
        tdLocais.childNodes[0].focus()

        // // Acessa o botão de edição para adicionar eventListener
        const confirmBtn = tdEditDelete.childNodes[0]
        confirmBtn.setAttribute("id", `confirm-${id}`)

        const cancelBtn = tdEditDelete.childNodes[1]
        cancelBtn.setAttribute("id", `cancel-${id}`)


        // Setando os EventListeners
        confirmBtn.onclick = event => {
            // Checa se o elemento clicado foi o Block do SVG ou o Path interno do SVG e retorna o id de maneira correta
            this.confirmarEdicao(id)
        }

        tdPredio.childNodes[0].onkeydown = event => {
            if (event.key === "Enter") {
                this.confirmarEdicao(id)
            } else if (event.key === "ESC" || event.key === "Escape") {
                this.cancelaEdicao(id)
            }
        }

        tdLocais.childNodes[0].onkeydown = event => {
            if (event.key === "Enter") {
                this.confirmarEdicao(id)
            } else if (event.key === "ESC" || event.key === "Escape") {
                this.cancelaEdicao(id)
            }
        }

        cancelBtn.onclick = event => {
            this.cancelaEdicao(id)
        }
    }

    confirmarEdicao(id) {
        // Acessa os Inputs Corretos
        const seletorPredio = this.$(`#locais-${id}-select`)
        const inputLocal = this.$(`#locais-${id}-text`)

        // Acessa os valores
        const predioSelecionado = [...seletorPredio.childNodes].filter(opt => opt.selected)[0].value
        const local = inputLocal.value

        try {
            // Retorna Erro caso necessário
            this.sessionStorage.editarLocal(id, predioSelecionado, local)

            // Faz alterações na UI
            seletorPredio.parentNode.innerHTML = predioSelecionado
            inputLocal.parentNode.innerHTML = local

            this.helpers.adicionaBotoesDeEdicaoEDelecao(id)

        } catch (error) { // Lida Com os erros sem quebrar a aplicação
            inputLocal.classList.add("invalid-text")
            inputLocal.placeholder = `${error.message}: "${inputLocal.value}"`
            inputLocal.value = ""
        }
    }

    excluir(event) {
        // Checa se o elemento clicado foi o Block do SVG ou o Path interno do SVG e retorna o id de maneira correta
        const id = this.helpers.getElementId(event)

        this.sessionStorage.excluirLocal(id)

        const tr = this.$(`#local-${id}`)
        this.tbody.removeChild(tr)
    }

    cancelaEdicao(id) {
        try {
            const dados = this.sessionStorage.acessarPorId(id)

            // Acessa os Inputs Corretos
            const seletorPredio = this.$(`#locais-${id}-select`)
            const inputLocal = this.$(`#locais-${id}-text`)

            // Faz alterações na UI
            seletorPredio.parentNode.innerHTML = dados.predio
            inputLocal.parentNode.innerHTML = dados.local

            this.helpers.adicionaBotoesDeEdicaoEDelecao(id)

        } catch (error) {
            console.error(error);
        }
    }

    setupHelperFunctions() {
        this.helpers = {
            adicionaBotoesDeEdicaoEDelecao: id => {
                const tdEditDelete = this.$(`#local-${id}`).childNodes[2]

                tdEditDelete.innerHTML = this.icons.editIcon
                tdEditDelete.innerHTML += this.icons.trashIcon

                // Retorna para os ícones de Edição e exclusão
                const editBtn = tdEditDelete.childNodes[0]
                editBtn.setAttribute("id", `edit-${id}`)

                const deleteBtn = tdEditDelete.childNodes[1]
                deleteBtn.setAttribute("id", `delete-${id}`)

                // Seta novamente os eventListeners para editar e excluir
                editBtn.onclick = event => this.editar(event) // Adiciona Event Listener de Edição

                deleteBtn.onclick = event => this.excluir(event) // Adiciona Event Listener de Edição
            },
            getElementId: event => {
                // Expressão regular para encontrar apenas os numeros no ID
                const idRegex = /\d+/g

                // Checa se o elemento clicado foi o Blobk do SVG ou o Path interno do SVG e retorna o id de maneira correta
                const id = event.target.nodeName === "svg" ? idRegex.exec(event.target.id).join('') : idRegex.exec(event.target.parentNode.id).join('')

                return id
            }
        }
    }
}

module.exports = DOM