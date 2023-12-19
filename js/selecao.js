const btCarregar = document.querySelector("#btCarregar");
const selTopicos = document.querySelector("#selTopicos");
const opcoes = document.querySelectorAll("option");
const dvCards = document.querySelector("#dvCards");
let questoes;
let topico;

btCarregar.addEventListener("change", carregarQuestoes, false);
selTopicos.addEventListener("change", construirCard, false);

// incluir nas option spans para registrar contagem de selecionadas
for (let i = 1; i < opcoes.length; i++) {
    const span = document.createElement("span");
    span.setAttribute("id", opcoes[i].value);
    opcoes[i].appendChild(span);
}

function carregarQuestoes(e) {
    const arquivo = e.target.files[0];

    const leitor = new FileReader();
    leitor.readAsText(arquivo);

    leitor.onload = function() {
        const conteudo = leitor.result;
        questoes = JSON.parse(conteudo);
        opcoes[0].selected = true; // seleciona o tópico nenhum automaticamente
        dvCards.innerHTML = "";      

        contarQuestoesSelecionadas();     
    }
}

function construirCard() {
    dvCards.innerHTML = ""; // limpa os cards já carregados

    topico = opcoes[selTopicos.selectedIndex].value;

    // se selecionou algum tópico sem ter carregado questões
    if (topico != "nenhum" && questoes == undefined) {
        alert("Carregue um banco de questões cadastradas.");
        return;
    } else if (topico == "nenhum") { // se nenhum tópico válido foi selecionado
        return;
    }

    // se tem questões carregadas
    if (questoes != undefined) {
        if (topico == "nenhum") return; // se nenhum tópico válido foi selecionado 

        // se não existe o tópico ou ele existe e está vazio
        if (questoes[topico] == undefined || questoes[topico].length == 0) {
            return;
        }
    }

    for (let id = 0; id < questoes[topico].length; id++) { 
        const questao = questoes[topico][id];

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

        if (questoes[topico][id].selecionada) {
            card.style.backgroundColor = "#0fc";
        }
    
        dvCards.appendChild(card);
    }
    
    criarBotaoDeExportacao();
}

function selecionarCard(e) {
    const cardClicado = e.target;
    const id = cardClicado.id.substring(7);
    console.log(id)

    if (!questoes[topico][id].selecionada) {
        questoes[topico][id].selecionada = true;
        cardClicado.style.backgroundColor = "#0fc";
    } else {
        questoes[topico][id].selecionada = false;
        cardClicado.style.backgroundColor = "#fff";
    }

    contarQuestoesSelecionadas();
}

function contarQuestoesSelecionadas() {
    let numSelecionadas = 0;

    for (let i = 1; i < opcoes.length; i++) {
        const topico = opcoes[i].value;

        if (questoes[topico] == undefined) {
            opcoes[i].querySelector(`#${opcoes[i].value}`).innerText = "";
        } else {
            for (let j = 0; j < questoes[topico].length; j++) {
                if (questoes[topico][j].selecionada) {
                    numSelecionadas++;
                }        
            }
    
            opcoes[i].querySelector(`#${opcoes[i].value}`).innerText = ` (${numSelecionadas}/${questoes[topico].length})`;
            numSelecionadas = 0;
        }
    }
}

function criarBotaoDeExportacao() {
    const btExportar = document.createElement("button");
    btExportar.innerText = "Exportar (PDF)";

    btExportar.addEventListener("click", exportarPDF, false);

    dvCards.appendChild(btExportar);
}


function exportarPDF() {
    let texto = "";
    let respostas = "";
    let numeroDaQuestao = 1;

    for (let i = 0; i < questoes.length; i++) {
        if (questoes[topico][i].selecionada) {
            texto += `<strong>${numeroDaQuestao++})</strong> ${questoes[topico][i].texto}
                      <br>
                      <br>`;
            respostas += `<strong>${numeroDaQuestao++})</strong> ${questoes[topico][i].resolucao}
                         <br>
                         Resposta: ${questoes[topico][i].resposta}
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