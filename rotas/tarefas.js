const express = require('express')
const { buscarTarefa, tarefas } = require('../repositorios/tarefas')
const router = express.Router()

const tarefas_repositorio = tarefas()

// Criando função para criar as rotas e retornar o router
const rotas_tarefas = () => {
    // rota de obter usuarios
    router.get("/tarefas", (req, res) => {

        const {nome, desc, status} = req.query

        const parametros = {
            nome: "",
            desc: "",
            status: ""
        } // trf

        if(nome){
            parametros.nome = nome
        }

        if(desc){
            parametros.desc = desc
        }

        if(status){
            parametros.status = status
        }

        const tarefas = tarefas_repositorio.getAll(parametros)

        // enviando os usuarios
        res.send(tarefas)
    })

    // rota para obter um unico usuario pelo id
    router.get("/tarefas/:id", (req, res) => {
        try{
            // capturei o parametro enviado na requisição
            const id = req.params.id
            const tarefa = tarefas_repositorio.getById(id)
            // enviei como resposta um objeto devolvido pelo repositório
            res.send(tarefa)
        }catch(error){
            // Capturei o erro enviado
            console.log(error.message)
            const conteudo_erro = JSON.parse(error.message)

            // Retornando os erros e status correto
            return res.status(conteudo_erro.status).send()
        }
    })

    // rota para criar um usuário novo
    router.post("/tarefas", (req, res) => {
        try{
            const tarefa_nova = tarefas_repositorio.create(req.body)
            // enviar a resposta
            res.send(tarefa_nova)
        }catch(error){
            // Capturei o erro enviado
            const conteudo_erro = JSON.parse(error.message)

            // Retornando os erros e status correto
            return res.status(conteudo_erro.status).send(conteudo_erro.erros)
        }
    })

    // rota para atualizar os dados de um usuário PUT
    router.put("/tarefas/:id", (req, res) => {
        try{
            // obtendo o parametro id enviado por meio de uma desestruturação
            const {id} = req.params 
            
            // Solicitando ao repositorio para atualizar os dados do usuario
            const tarefa = tarefas_repositorio.update(req.body, id)

            // retorna com sucesso
            return res.send(tarefa)
        }catch(error){
            // Capturei o erro enviado
            const conteudo_erro = JSON.parse(error.message)

            // Retornando os erros e status correto
            return res.status(conteudo_erro.status).send(conteudo_erro.erros)
        }

    })

    // rota para atualizar os dados de um usuário, considerando apenas os que foram enviados
    router.patch("/tarefas/:id", (req, res) => {
        // obtendo o parametro id enviado por meio de uma desestruturação
        const {id} = req.params 

        const tarefa_cadastrada = buscarTarefa(id)

        // atualiza os dados do usuário buscado
        tarefa_cadastrada.nome = req.body.nome ?? tarefa_cadastrada.nome
        tarefa_cadastrada.desc = req.body.desc ?? tarefa_cadastrada.desc
        tarefa_cadastrada.status = req.body.status ?? tarefa_cadastrada.status

        const tarefa = tarefas_repositorio.update(tarefa_cadastrada, id)

        // retorna com sucesso
        return res.send(tarefa)
    })

    // rota para excluir um usuário da base DELETE
    router.delete("/tarefas/:id", (req, res) => {
        // obtendo parametro id enviado por meio de desestruturação
        const {id} = req.params

        // Executando a exclusão do usuário
        tarefas_repositorio.destroy(id)

        return res.status(200).send()
    })

    return router
}


module.exports = rotas_tarefas