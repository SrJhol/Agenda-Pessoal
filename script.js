// Seleciona os elementos do DOM
const form = document.getElementById("form-compromisso");
const lista = document.getElementById("lista-compromissos");
const contador = document.getElementById("contador");

//Recupera os compromissos salvos no localStorage (ou inicia com array vazio)
let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

//Armazena o ID que está sendo editado(caso precise)
let editandoId = null;

// Salva os compromissos no LocalStorage e atualiza a lista
function salvarLocalStorage(){
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
  atualizarLista();
}

// Atualiza a lista de exibição na tela 
function atualizarLista() {
  lista.innerHTML = "";

  //Agrupa os compromissos pela data 
  const agrupado = compromissos.reduce((acc, item) => {
    acc[item.data] = acc[item.data] || [];
    acc[item.data].push(item);
    return acc;
  }, {});

  // Ordena as datas em ordem crescente
   const datas = Object.keys(agrupado).sort();


   //Para cada data cria um grupo de compromissos
   datas.forEach(data => {
    const grupo = document.createElement("div");
    grupo.innerHTML = `<h3>${data || "Sem data"}</h3>`;

    //Cria um bloco para cada data
    agrupado[data].forEach((c) => {
      const div = document.createElement("div");
      div.className = "compromisso";
      div.innerHTML = `
        <div class="compromisso-header">
          <strong>${c.titulo}</strong>
          <div>
            <button onclick="editar(${c.id})">✏️</button>
            <button onclick="excluir(${c.id})">🗑️</button>
          </div>
        </div>
        <p>Horário: ${c.hora || "-"}</p>
        <p>Local: ${c.local || "-"}</p>
        <p>Obs: ${c.obs || "-"}</p>
      `;
      grupo.appendChild(div);
    });

    lista.appendChild(grupo);
  });

  //Atualiza o contador
  contador.innerText = compromissos.length;
}

//Acionado a enviar o formulario 
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Coleta e trata os dados do formulário
  const titulo = document.getElementById("titulo").value.trim();
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const local = document.getElementById("local").value.trim();
  const obs = document.getElementById("obs").value.trim();

  // Validação: título é obrigatório
  if (!titulo) {
    alert("O título é obrigatório.");
    return;
  }
   // Cria o objeto do novo compromisso (ou editado)
  const novoCompromisso = {
    id: editandoId || Date.now(), // Usa o ID anterior se estiver editando
    titulo,
    data,
    hora,
    local,
    obs
  };

  // Verifica se é edição ou novo compromisso
  if (editandoId) {
    compromissos = compromissos.map(c => c.id === editandoId ? novoCompromisso : c);
    editandoId = null;
  } else {
    compromissos.push(novoCompromisso);
  }

  // Limpa o formulário e salva os dados
  form.reset();
  salvarLocalStorage();

});

function excluir(id) {
  if (confirm("Tem certeza que deseja excluir este compromisso?")) {
    // Remove o compromisso com o ID correspondente
    compromissos = compromissos.filter(c => c.id !== id);
    salvarLocalStorage(); // Atualiza o localStorage e a lista na tela
  }
}

function editar(id) {
  const compromisso = compromissos.find(c => c.id === id);
  if (!compromisso) return;

  // Preenche os campos do formulário com os dados do compromisso
  document.getElementById("titulo").value = compromisso.titulo;
  document.getElementById("data").value = compromisso.data;
  document.getElementById("hora").value = compromisso.hora;
  document.getElementById("local").value = compromisso.local;
  document.getElementById("obs").value = compromisso.obs;

  // Marca que estamos editando este ID
  editandoId = id;
}