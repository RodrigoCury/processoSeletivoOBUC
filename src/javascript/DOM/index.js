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
            console.log(event);
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
        tdEditDelete.firstChild.setAttribute("id", id);
        tdEditDelete.firstChild.onclick = event => this.editar(event) // Adiciona Event Listener de Edição
        tdEditDelete.lastChild.setAttribute("id", id);
        tdEditDelete.lastChild.onclick = event => this.excluir(event) // Adiciona Event Listener de Exclusão

        tr.appendChild(tdPredio)
        tr.appendChild(tdLocal)
        tr.appendChild(tdEditDelete)

        this.tbody.appendChild(tr)
    }

    editar(event) {
        // Checa se o elemento clicado foi o Blobk do SVG ou o Path interno do SVG e retorna o id de maneira correta
        const id = event.target.nodeName === "svg" ? event.target.id : event.target.parentNode.id

        // Acessa os elementos para alterar
        const tdPredio = this.$(`#local-${id}`).childNodes[0]
        const tdLocais = this.$(`#local-${id}`).childNodes[1]

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

        /*
         * Usando os ids como ferramenta de acesso resultará em falhas de segurança, 
         * mas por questão de tempo não vou implementar uma solução para isso
         */

        // Troca o inner HTML para os inputs
        tdPredio.innerHTML = seletorPredioClone.outerHTML

        tdLocais.innerHTML = seletorLocalClone.outerHTML

        // Acessa o botão de edição para adicionar eventListener
        const editBtn = document.getElementById(id.toString())

        // Setando os EventListeners
        editBtn.onclick = event => {
            // Checa se o elemento clicado foi o Block do SVG ou o Path interno do SVG e retorna o id de maneira correta
            const id = event.target.nodeName === "svg" ? event.target.id : event.target.parentNode.id
            this.confirmarEdicao(id)
        }
        tdPredio.childNodes[0].onkeydown = event => {
            const id = event.target.parentNode.parentNode.lastChild.childNodes[0].id
            if (event.key === "Enter") {
                this.confirmarEdicao(id)
            }
        }
        tdLocais.childNodes[0].onkeydown = event => {
            const id = event.target.parentNode.parentNode.lastChild.childNodes[0].id
            if (event.key === "Enter") {
                this.confirmarEdicao(id)
            }
        }
    }

    confirmarEdicao(id) {
        // Acessa os Inputs Corretos
        const seletorPredio = this.$(`#locais-${id}-select`)
        const inputLocal = this.$(`#locais-${id}-text`)

        // Acessa os valores
        const predioSelecionado = [...seletorPredio.childNodes].filter(opt => opt.selected)[0].value
        const local = inputLocal.value

        // Acessa o botão pra setar o eventListener
        const editBtn = document.getElementById(id.toString())

        try {
            // Retorna Erro caso necessário
            this.sessionStorage.editarLocal(id, predioSelecionado, local)

            // Faz alterações na UI
            seletorPredio.parentNode.innerHTML = predioSelecionado
            inputLocal.parentNode.innerHTML = local

            // Setar o Event Listener
            editBtn.onclick = event => this.editar(event)

        } catch (error) { // Lida Com os erros sem quebrar a aplicação
            inputLocal.classList.add("invalid-text")
            inputLocal.placeholder = error.message
        }


    }

    excluir(event) {
        // Checa se o elemento clicado foi o Block do SVG ou o Path interno do SVG e retorna o id de maneira correta
        const id = event.target.nodeName === "svg" ? event.target.id : event.target.parentNode.id

        this.sessionStorage.excluirLocal(id)

        const tr = this.$(`#local-${id}`)
        this.tbody.removeChild(tr)
    }
}

module.exports = DOM