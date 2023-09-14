// Importação do Express
const express = require("express")

// Definição da porta
const porta = 3124

// Banco de dados em memória
let usuarios_db = [
    {
        nome: "marcos",
        login: "marcosantonio",
        senha: "123456",
        email: "marcosantonio@univas.edu.br",
        id: 1
    },
    {
        nome: "João da Silva",
        login: "joaosilva",
        senha: "654321",
        email: "joaosilva@univas.edu.br",
        id: 2
    }
]


//
//


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

// TODO: status tem que ser validado "a fazer", "fazendo" ou "feito"



// Instanciando a aplicação
const app = express()

// Definir que os dados enviados serão no formato json no corpo da requisição
app.use(express.json())

// rota raiz
app.get("/", (req, res) => {
    res.send("API executando...")
})

// rota de obter tarefas
app.get("/tarefas", (req, res) => {
    // criando novo array com as tarefas 
    const tarefas_processadas = tarefas_db.map((tarefa) => {
        return {
            nome: tarefa.nome,
            desc: tarefa.desc,
            status: tarefa.status,
            id: tarefa.id
        }
    })

    // enviando os usuarios
    res.send(tarefas_processadas)
})

// rota para obter um unico usuario pelo id
app.get("/tarefas/:id", (req, res) => {
    // capturei o parametro enviado na requisição
    const id = req.params.id

    // filtrei todos os usuarios que atendem ao id passado
    const tarefas_processadas = tarefas_db.filter(tarefa => {
        return tarefa.id == id
    })

    if(tarefas_processadas.length == 0){
        return res.status(404).send()
    }

    // peguei o primeiro usuario da lista
    const tarefa = tarefas_processadas[0]

    // enviei como resposta um objeto sem a senha do usuario
    res.send({
        nome: tarefa.nome,
        desc: tarefa.desc,
        status: tarefa.status,
        id: tarefa.id
    })
})

// rota para criar uma nova tarefa
app.post("/tarefas", (req, res) => {
    // buscar o último id criado
    const ultimo_id = tarefas_db.reduce((anterior, proximo) => {
        if(proximo.id > anterior){
            return proximo.id
        }else{
            return anterior
        }
    }, 0)

    // criar uma nova tarefa
    const tarefa_nova = req.body

    // nome, desc e status são obrigatórios
    // Validações:
    const erros = []

    if(!tarefa_nova.nome || tarefa_nova.nome == ""){
        erros.push("Campo nome não pode ser vazio.")
    }

    if(!tarefa_nova.desc || tarefa_nova.desc == ""){
        erros.push("Campo desc não pode ser vazio.");
    }

    if(!tarefa_nova.status || tarefa_nova.status == ""){
        erros.push("Campo status não pode ser vazio.")
    }else if(!tarefa_nova.status.includes("a fazer", "fazendo", "feito")){
        erros.push("Campo status deve conter apenas fazer, fazendo ou feito")
    }

    // Se existe campo inválido
    if(erros.length > 0){
        return res.status(400).send(erros)
    }

    // inserir o novo id a tarefa criada
    tarefa_nova.id = ultimo_id + 1

    // inserir a tarefa no array
    tarefas_db.push(tarefa_nova)

    // enviar a resposta
    res.send(tarefa_nova)
})

// rota para atualizar os dados de um usuário PUT
app.put("/tarefas/:id", (req, res) => {
    // obtendo o parametro id enviado por meio de uma desestruturação
    const {id} = req.params

    // busca o usuário pelo ID
    const tarefas_processadas = tarefas_db.filter(t =>{
        return t.id == id
    })

    // Verifica se o usuário existe
    if(tarefas_processadas.length == 0){
        // Se não existir devolve erro 404
        return res.status(404).send()
    }

    // atualiza os dados do usuário buscado
    const tarefa = tarefas_processadas[0]
    tarefa.nome = req.body.nome
    tarefa.desc = req.body.desc
    tarefa.status = req.body.status

    // retorna com sucesso
    return res.send(tarefa)

})

// rota para atualizar os dados de um usuário, considerando apenas os que foram enviados
app.patch("/tarefas/:id", (req, res) => {
    // obtendo o parametro id enviado por meio de uma desestruturação
    const {id} = req.params

    // busca o usuário pelo ID
    const tarefas_processadas = tarefas_db.filter(t =>{
        return t.id == id
    })

    // Verifica se o usuário existe
    if(tarefas_processadas.length == 0){
        // Se não existir devolve erro 404
        return res.status(404).send()
    }

    // atualiza os dados do usuário buscado
    const tarefa = tarefas_processadas[0]
    tarefa.nome = req.body.nome ?? tarefa.nome
    tarefa.desc = req.body.desc ?? tarefa.desc
    tarefa.status = req.body.status ?? tarefa.status

    // retorna com sucesso
    return res.send(tarefa)
})

// rota para excluir um usuário da base DELETE
app.delete("/tarefas/:id", (req, res) => {
    // obtendo parametro id enviado por meio de desestruturação
    const {id} = req.params

    // obtendo o usuário pelo ID
    const tarefas_processadas = tarefas_db.filter(t => t.id == id)

    // verificando se o usuário existe
    if(tarefas_processadas.length == 0){
        // se não existir, devolve um erro 404 pro cliente.
        return res.status(404).send()
    }

    // cria um novo array sem o usuário que deve ser excluído
    tarefas_db = tarefas_db.filter(t => t.id != id)

    return res.status(200).send()
})

// Iniciando aplicação
app.listen(porta, (err) => {
    if(err){
        console.log("Erro ao subir aplicação")
    }else{
        console.log(`Aplicação executando na porta ${porta}`)
    }
})