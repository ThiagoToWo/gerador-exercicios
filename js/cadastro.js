const txtQestao = document.querySelector("#txtQuestao");
const txtResolucao = document.querySelector("#txtResolucao");
const txtResposta = document.querySelector("#txtResposta");
const btCadastrar = document.querySelector("#btCadastrar");
const btSalvar = document.querySelector("#btSalvar");

const dados = localStorage.getItem("questoes-cadastradas");
let questoes;

if (dados != null) {
    questoes = JSON.parse(dados);
} else {
    questoes = [];
}

btCadastrar.addEventListener("click", cadastrarQuestao, false);
btSalvar.addEventListener("click", salvarQuestoesComoJSON, false);

function cadastrarQuestao() {
    const texto = txtQestao.value;
    const resolucao = txtResolucao.value;
    const resposta = txtResposta.value;

    const questao = {texto, resolucao, resposta};

    questoes.push(questao);
    localStorage.setItem("questoes-cadastradas", JSON.stringify(questoes));

    txtQestao.value = "";
    txtResolucao.value = "";
    txtResposta.value = "";
}

function salvarQuestoesComoJSON() {
    const arquivo = new Blob([JSON.stringify(questoes)], {type: "text/plain"});

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(arquivo));
    link.setAttribute("download", "questoes.json");
    link.click();
}