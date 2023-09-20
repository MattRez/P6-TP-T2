require('dotenv').config()
// Importação do Express
const express = require("express")
// Definição da porta
const porta = process.env.PORTA

// importando rotas de usuários
const rotas_tarefas = require('./rotas/tarefas')

// Instanciando a aplicação
const app = express()

// Definir que os dados enviados serão no formato json no corpo da requisição
app.use(express.json())

// configurando as rotas importadas dentro do app
// chamando a função injetando uma dependência
app.use(rotas_tarefas())

// rota raiz
app.get("/", (req, res) => {
    res.send("API executando...")
})

// Iniciando aplicação
app.listen(porta, (err) => {
    if(err){
        console.log("Erro ao subir aplicação")
    }else{
        console.log(`Aplicação executando na porta ${porta}`)
    }
})