const pCadastradas = document.querySelector("#pCadastradas");
const btCarregar = document.querySelector("#btCarregar");
const selTopicos = document.querySelector("#selTopicos");
const opcoes = document.querySelectorAll("option");
const txtQestao = document.querySelector("#txtQuestao");
const txtResolucao = document.querySelector("#txtResolucao");
const txtResposta = document.querySelector("#txtResposta");
const btCadastrar = document.querySelector("#btCadastrar");
const btSalvar = document.querySelector("#btSalvar");

let questoes = {};

btCarregar.addEventListener("change", carregarQuestoes, false);
btCadastrar.addEventListener("click", cadastrarQuestao, false);
btSalvar.addEventListener("click", salvarQuestoesComoJSON, false);

// incluir nas option spans para registrar contagem de cadastradas
for (let i = 1; i < opcoes.length; i++) {
    const span = document.createElement("span");
    span.setAttribute("id", opcoes[i].value);
    opcoes[i].appendChild(span);
}

function carregarQuestoes(e) {
    const arquivo = e.target.files[0];

    const leitor = new FileReader();
    leitor.readAsText(arquivo);

    leitor.onload = function () {
        const conteudo = leitor.result;
        questoes = JSON.parse(conteudo);
        opcoes[0].selected = true; // seleciona o tópico nenhum automaticamente       

        contarQuestoesCadastradas();
    }
}

function cadastrarQuestao() {
    if (opcoes[0].selected) {
        alert("Escolha um tópico para cadastrar a questão.");
        return;
    }

    const texto = txtQestao.value;
    const resolucao = txtResolucao.value;
    const resposta = txtResposta.value;

    const questao = { texto, resolucao, resposta };

    const topico = opcoes[selTopicos.selectedIndex].value;

    if (questoes[topico]) {
        questoes[topico].push(questao);
    } else {
        questoes[topico] = [];
        questoes[topico].push(questao);
    }

    txtQestao.value = "";
    txtResolucao.value = "";
    txtResposta.value = "";
}

function salvarQuestoesComoJSON() {
    const arquivo = new Blob([JSON.stringify(questoes)], { type: "text/plain" });

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(arquivo));
    link.setAttribute("download", "questoes.json");
    link.click();
}

function contarQuestoesCadastradas() {
    for (let i = 1; i < opcoes.length; i++) {
        const topico = opcoes[i].value;
    
        if (questoes[topico] == undefined) {
            opcoes[i].querySelector(`#${opcoes[i].value}`).innerText = "";
        } else {
            opcoes[i].querySelector(`#${opcoes[i].value}`).innerText = ` (${questoes[topico].length})`;
        }

    }
}