const validar = (tarefa) => {
    // nome, login, email e senha são obrigatórios
    // Validações
    const erros = []

    if(!tarefa.nome || tarefa.nome == ""){
        erros.push("Campo nome não pode ser vazio.")
    }

    if(!tarefas.desc || tarefas.desc == ""){
        erros.push("Campo login não pode ser vazio.");
    }

    if(!tarefa_nova.status || tarefa_nova.status == ""){
        erros.push("Campo status não pode ser vazio.")
    }else if(!tarefa_nova.status.includes("a fazer", "fazendo", "feito")){
        erros.push("Campo status deve conter apenas fazer, fazendo ou feito")
    }

    // Se existe campo inválido
    if(erros.length > 0){
        throw new Error(JSON.stringify({
            status: 400,
            erros
        }))
    }else{
        return true
    }
}

module.exports = validar