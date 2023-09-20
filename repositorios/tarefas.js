const validacaoTarefa = require('../validacoes/tarefas')

// Banco de dados em memória
let tarefas_db = [
    {
        nome: "programar",
        desc: "programar um software",
        status: "fazendo", 
        id: 1
    },{
        nome: "organizar casa",
        desc: "organizar a casa inteira",
        status: "a fazer", 
        id: 2
    }
]

let ultimo_id = 2

function transformarTarefaParaRetorno(tarefa){
    return {
        nome: tarefa.nome,
        desc: tarefa.desc,
        status: tarefa.status
    }
}

function buscarTarefa(id){
    // Verificar se o usuário existe
    // filtrei todos os usuarios que atendem ao id passado  
    const tarefas_filtradas = tarefas_db.filter(tarefa => {
        return tarefa.id == id
    })

    // pegar e devolver os dados sem a senha
    // peguei o primeiro usuario da lista
    if(tarefas_filtradas.length == 0){
        throw new Error(JSON.stringify({
            status: 404
        }))
    }

    return tarefas_filtradas[0]
}

const tarefas = () => {
    return {
        getById: (id) => {
            // Buscar usuário na base
            const tarefa = buscarTarefa(id)

            return transformarTarefaParaRetorno(tarefa)
        },
        getAll: (parametros) => {
            let tarefas_filtradas = tarefas_db
            // transformação dos dados para esconder atributos
            tarefas_filtradas = tarefas_db.map((tarefa) => transformarTarefaParaRetorno(tarefas))

            // filtragem pelos parâmetros se existirem
            const camposParaValidar = Object.keys(parametros)
            // [nome, login, email] => por exemplo

            // Se existe parâmetro enviado pelo cliente
            if(camposParaValidar.length > 0){
                tarefas_filtradas = tarefas_filtradas.filter(trf => {
                    let ehValido = true

                    camposParaValidar.forEach(campo => {
                        if(!trf[campo].includes(parametros[campo])){
                            ehValido = false
                        }
                    })

                    return ehValido
                })
            }

            // retorno do resultado
            return tarefas_filtradas
        },
        create: (dados) => {
            // Pego o último id inserido
            // Já tenho o último id sendo controlado por uma variável
            // Criar um usuário com os dados enviados
            const tarefa_nova = dados

            // Validar a tarefa criada
            validacaoTarefa(tarefa_nova)

            // Atribuir um id 
            tarefa_nova.id = ++ultimo_id

            // Salvar no banco de dados
            tarefas_db.push(tarefa_nova)

            // retornar o usuário salvo
            return tarefa_nova
        },
        update: (dados, id) => {
            // busca o usuário pelo ID
            const tarefa_cadastrada = buscarTarefa(id)

            // Validar dados enviados
            validacaoTarefa(dados)

            // atualiza os dados do usuário buscado
            tarefa_cadastrada.nome = dados.nome
            tarefa_cadastrada.desc = dados.desc
            tarefa_cadastrada.status = dados.status

            return tarefa_cadastrada
        },
        destroy: (id) => {
            // Verificando se o usuário existe.
            const tarefa = buscarTarefa(id)

            // cria um novo array sem o usuário que deve ser excluído
            tarefas_db = tarefas_db.filter(t => t.id != id)

            return true
        }
    }
}

module.exports = {
    tarefas,
    buscarTarefa
}