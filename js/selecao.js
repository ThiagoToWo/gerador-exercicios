const btCarregar = document.querySelector("#btCarregar");
const container = document.querySelector("#tudo");
let questoes;

btCarregar.addEventListener("change", carregarQuestoes, false);

function carregarQuestoes(e) {
    const arquivo = e.target.files[0];

    const leitor = new FileReader();
    leitor.readAsText(arquivo);

    leitor.onload = function() {
        const conteudo = leitor.result;
        questoes = JSON.parse(conteudo);
        
        for (let i = 0; i < questoes.length; i++) {
            construirCard(questoes[i], i);
        }

        criarBotaoDeExportacao();
    }
}

function construirCard(questao, id) {
    const card = document.createElement("div");
    card.setAttribute("id", "questao" + id);
    card.setAttribute("class", "card");
    card.style.cursor = "pointer";
    card.style.userSelect = "none";
    card.innerHTML = `<strong>Questão ${id + 1}:</strong>
                      <br>
                      ${questao.texto}
                      <br>
                      <br>
                      <strong>Resolução:</strong>
                      <br>
                      ${questao.resolucao}
                      <br>
                      <br>
                      <strong>Resposta:</strong>
                      <br>
                      ${questao.resposta}
                      <br>
                      <br>`;
    
    card.addEventListener("click", selecionarCard, false);

    container.appendChild(card);
}

function criarBotaoDeExportacao() {
    const btExportar = document.createElement("button");
    btExportar.innerText = "Exportar (PDF)";

    btExportar.addEventListener("click", exportarPDF, false);

    container.appendChild(btExportar);
}

function selecionarCard(e) {
    const cardClicado = e.target;
    const id = cardClicado.id.substring(7);
    console.log(id)

    if (!questoes[id].selecionada) {
        questoes[id].selecionada = true;
        cardClicado.style.backgroundColor = "#0fc"
    } else {
        questoes[id].selecionada = false;
        cardClicado.style.backgroundColor = "#fff"
    }
}

function exportarPDF() {
    let texto = "";
    let respostas = "";
    let numeroDaQuestao = 1;

    for (let i = 0; i < questoes.length; i++) {
        if (questoes[i].selecionada) {
            texto += `<strong>${numeroDaQuestao++})</strong> ${questoes[i].texto}
                      <br>
                      <br>`;
            respostas += `<strong>${numeroDaQuestao++})</strong> ${questoes[i].resolucao}
                         <br>
                         Resposta: ${questoes[i].resposta}
                         <br>
                         <br>`;
        }
    }

    const lista = window.open();
    lista.document.write(texto);
    lista.print();
    const gabarito = window.open();
    gabarito.document.write(respostas);
    gabarito.print();
}