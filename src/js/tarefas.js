// Declaração de variáveis globais
let tarefa_input = document.getElementById('tarefa')
let adicionar = document.getElementById('adicionar')
let lista = document.getElementById('lista')

let modalEdit = document.getElementById('modal-edit')
let janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo')
let edicao = document.querySelector('#edicao')
let janelaEdicaoBtnFechar = document.querySelector('#fechar-edit')
let idTarefaEdicao = document.querySelector('#idTarefaEdicao')
let inputTarefaNomeEdicao = document.querySelector('#edit-tarefa')
let descricaoTarefa = document.getElementById('descricaoTarefa')
let btnAtualizarTarefa = document.querySelector('#concluir-edit')

const qtdIdsDisponiveis = Number.MAX_VALUE
let tarefas = []

// Chamadas automáticas das respectivas funcionalidades
obterTarefasLocalStorage()
redenrizarListaHTML()

// Adicionando itens à lista usando o teclado
tarefa_input.addEventListener('keypress', (tecla) => {
    if (tecla.key === 'Enter') {

        if (tarefa_input.value == '') {
            alert('Campo vazio não pode ser válido. Escreva algo!')

        } else {

            let tarefa = {
                tarefa_nome: tarefa_input.value, 
                id: gerarIdV2(),
                concluida: false,
                descricao: ''
            }

            adicionarTarefa(tarefa)
        }
    }
})

// Chamada do botão "adicionar"
adicionar.addEventListener('click', () => {
    if (tarefa_input.value == '') {
            alert('Campo vazio não pode ser válido. Escreva algo!')

        } else {
            
            let tarefa = {
                tarefa_nome: tarefa_input.value, 
                id: gerarIdV2(),
                concluida: false,
                descricao: ''
            }

            adicionarTarefa(tarefa)    
        }
})

// Funcionalidade de fechar o modal de edição
function fecharModal() {
    modalEdit.close()
    janelaEdicaoFundo.style.display = 'none'
    edicao.style.display = 'none'
}

janelaEdicaoBtnFechar.addEventListener('click', () => {
    fecharModal()
})
janelaEdicaoFundo.addEventListener('click', () => {
    fecharModal()
})

btnAtualizarTarefa.addEventListener('click', function salvar(e) {
    e.preventDefault()

    let idTarefa = idTarefaEdicao.innerHTML.replace('#', '')

    let tarefa = {
        tarefa_nome: inputTarefaNomeEdicao.value,
        id: idTarefa,
        descricao: descricaoTarefa.value
    }

    let tarefaAtual = document.getElementById('' + idTarefa + '')

    if(tarefaAtual) {
        if (tarefa.tarefa_nome != '') {
            const indiceTarefa = obterIndiceTarefaPorId(idTarefa)
            tarefas[indiceTarefa] = tarefa
            salvarTarefasLocalStorage()

            // Atualiza o texto da descrição diretamente na tarefa
            let descricaoSpan = tarefaAtual.querySelector('.descricao')
            descricaoSpan.textContent = tarefa.descricao
    
            let li = cunharTagLi(tarefa)
            lista.replaceChild(li, tarefaAtual)
            fecharModal()

        } else {
            alert('Campo vazio não pode ser válido. Escreva algo!')
        }

    }
})

// Apagando tudo de uma vez só
let apagarTudo = document.getElementById('apagarTudo')
apagarTudo.addEventListener('click', () => {

    let ok = confirm('Tem certeza que deseja apagar TODAS as tarefas da lista?')
    if (ok) {

        localStorage.removeItem("JSONsalvo")
        tarefas = []
        redenrizarListaHTML()
        
    }

})

// Geração de id para cada tag "li"
function gerarId() {
    return Math.floor(Math.random() * qtdIdsDisponiveis)
}

function gerarIdV2() {
    return gerarIdUnico()
}

function gerarIdUnico() {

    let itensDaLista = document.getElementById('lista').children
    let idsGerados = []

    for ( let i = 0 ; i < itensDaLista.length ; i++ ) {
        idsGerados.push(itensDaLista[i].id)
    }

    let contadorIds = 0
    let id = gerarId()

    while(contadorIds <= qtdIdsDisponiveis && 
        idsGerados.indexOf(id.toString()) > -1) {
            id = gerarId()
            contadorIds++

            if(contadorIds >= qtdIdsDisponiveis) {
                alert("Oops, ficamos sem IDS :/");
                throw new Error("Acabou os IDs :/");
            }
        }

    return id
}

// Adição da tarefa à lista
function adicionarTarefa(tarefa) {
    tarefas.push(tarefa)
    salvarTarefasLocalStorage(tarefas);
    redenrizarListaHTML();
}

function cunharTagLi(tarefa) {
    let li = document.createElement('li')
    li.id = tarefa.id

    let span_nome = document.createElement('span')
    span_nome.classList.add('nome')
    span_nome.textContent = tarefa.tarefa_nome

    let span_opc = document.createElement('span')
    span_opc.classList.add('opc')

    // Função de concluir e desconcluir tarefa
    let conclusao = document.createElement('button')
    conclusao.classList.add('conclusao')
    conclusao.innerHTML = `<i class="fa fa-check"></i>`
    conclusao.setAttribute("onclick", "concluirTarefa("+ tarefa.id +")")
    if (tarefa.concluida) {
        li.style.textDecoration = 'line-through'
        li.style.color = 'lightgray'
    }

    // Função de remover tarefa
    let remover = document.createElement('button')
    remover.classList.add('remover')
    remover.innerHTML = `<i class="fa fa-trash"></i>`
    remover.setAttribute("onclick", "removerTarefa("+ tarefa.id +")")

    // Função de editar tarefa
    let editar = document.createElement('button')
    editar.classList.add('editar')
    editar.innerHTML = `<i class="fa fa-pencil"></i>`
    editar.setAttribute("onclick", "editarTarefa("+ tarefa.id +")")

    // Adiciona um campo de descrição separado para cada tarefa
    let descricao = document.createElement('span')
    descricao.textContent = tarefa.descricao
    descricao.style.display = 'none' // Esconde por padrão
    descricao.className = 'descricao'
    
    
    // Colocando as filhas na mãe
    li.appendChild(span_nome)
    li.appendChild(span_opc)
    
    span_opc.appendChild(editar)
    span_opc.appendChild(conclusao)
    span_opc.appendChild(remover)
    span_opc.appendChild(descricao)

    return li
}

// Edição de tarefa
function editarTarefa(idTarefa) {
    // Especificidade da tarefa
    let li = document.getElementById(''+ idTarefa + '')
    if (li) {

        // Especificidade da edição da tarefa
        idTarefaEdicao.textContent = '#' + idTarefa

        // Mostra o nome da tarefa na caixa
        let nome = li.querySelector('.nome')
        inputTarefaNomeEdicao.value = nome.textContent

        // Mostra a descrição feita anteriormente na caixa
        let descricaoSpan = li.querySelector('.descricao')
        descricaoTarefa.value = descricaoSpan.textContent

        alternarJanelaEdicao()

    } else {
        alert('Elemento HTML não encontrado!');
    }
}

// Remoção de tarefa
function removerTarefa(idTarefa) {

    let ok = confirm('Tem certeza que deseja remover essa tarefa?')
    if (ok) {

        const indiceTarefa = obterIndiceTarefaPorId(idTarefa)
        tarefas.splice(indiceTarefa, 1)
        salvarTarefasLocalStorage()

        let li = document.getElementById(''+ idTarefa + '')
        if (li) {
            lista.removeChild(li)
        }

    }

}

// Conclusão de tarefa
function concluirTarefa(idTarefa) {

    const indiceTarefa = obterIndiceTarefaPorId(idTarefa)
    let li = document.getElementById(''+ idTarefa + '')

    if (li) {
        tarefas[indiceTarefa].concluida = !tarefas[indiceTarefa].concluida
        salvarTarefasLocalStorage()
        redenrizarListaHTML()
    }

}

// Função de abrir o modal de edição
function alternarJanelaEdicao() {
    modalEdit.show()
    edicao.style.display = 'block'
    janelaEdicaoFundo.style.display = 'block'
    
}



function obterIndiceTarefaPorId(idTarefa) {
    const indiceTarefa = tarefas.findIndex(t => t.id == idTarefa)

    if(indiceTarefa < 0) {
        throw new Error('Id da tarefa não encontrado: ', idTarefa)
    }

    return indiceTarefa
}

// Rendenrização da lista automática
function redenrizarListaHTML() {
    lista.textContent = ''

    if (tarefas.length === 0) {
        return
    }

    for ( let i = 0 ; i < tarefas.length ; i++ ) {
        let li = cunharTagLi(tarefas[i])
        lista.appendChild(li)
    }

    tarefa_input.value = ''
    tarefa_input.focus()
}

// Salvação das tarefas ao Local Storage
function salvarTarefasLocalStorage() {
    localStorage.setItem("JSONsalvo", JSON.stringify(tarefas))
}

// Obtenção da lista que já está no Local Storage
function obterTarefasLocalStorage() {
    if(localStorage.getItem("JSONsalvo")) {
        tarefas = JSON.parse(localStorage.getItem("JSONsalvo"))
    }  
}
