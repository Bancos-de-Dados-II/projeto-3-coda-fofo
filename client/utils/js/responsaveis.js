let responsaveis = [];
let responsavelParaExcluir = null;



const listaResponsaveis = document.getElementById('listaResponsaveis');
const modalResponsavel = document.getElementById('modalResponsavel');
const modalConfirmacao = document.getElementById('modalConfirmacao');
const formResponsavel = document.getElementById('formResponsavel');
const buscaResponsavel = document.getElementById('buscaResponsavel');
const btnBuscar = document.getElementById('btnBuscar');
const btnNovoResponsavel = document.getElementById('btnNovoResponsavel');
const btnCancelar = document.getElementById('btnCancelar');
const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
const modalTitulo = document.getElementById('modalTitulo');

document.addEventListener('DOMContentLoaded', carregarResponsaveis);
btnNovoResponsavel.addEventListener('click', mostrarModalNovoResponsavel);
btnCancelar.addEventListener('click', fecharModalResponsavel);
btnCancelarExclusao.addEventListener('click', fecharModalConfirmacao);
btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
formResponsavel.addEventListener('submit', salvarResponsavel);
btnBuscar.addEventListener('click', buscarResponsaveis);
buscaResponsavel.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarResponsaveis();
    }
});

async function carregarResponsaveis() {
    try {
        const response = await fetch('http://localhost:5000/responsaveis');
        if (!response.ok) throw new Error('Erro ao carregar responsáveis');
        
        responsaveis = await response.json();
        exibirResponsaveis(responsaveis);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar responsáveis');
    }
}

function exibirResponsaveis(responsaveis) {
    listaResponsaveis.innerHTML = '';
    
    if (responsaveis.length === 0) {
        listaResponsaveis.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum responsável encontrado</p>';
        return;
    }
    
    responsaveis.forEach(responsavel => {
        const responsavelElement = criarElementoResponsavel(responsavel);
        listaResponsaveis.appendChild(responsavelElement);
    });
}

function criarElementoResponsavel(responsavel) {
    const div = document.createElement('div');
    div.className = 'border-b pb-4 last:border-b-0';
    
    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h3 class="text-lg font-semibold text-gray-800">${responsavel.nome}</h3>
                <p class="text-gray-600">${responsavel.tipo} - ${responsavel.areaAtuacao}</p>
                <p class="text-gray-500">${responsavel.email} | ${responsavel.telefone}</p>
            </div>
            <div class="flex gap-2">
                <button class="editar-btn text-blue-600 hover:text-blue-800" data-id="${responsavel._id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="excluir-btn text-red-600 hover:text-red-800" data-id="${responsavel._id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Adicionar event listeners aos botões
    div.querySelector('.editar-btn').addEventListener('click', () => editarResponsavel(responsavel._id));
    div.querySelector('.excluir-btn').addEventListener('click', () => solicitarExclusao(responsavel._id));
    
    return div;
}

function mostrarModalNovoResponsavel() {
    modalTitulo.textContent = 'Novo Responsável';
    formResponsavel.reset();
    document.getElementById('responsavelId').value = '';
    modalResponsavel.classList.remove('hidden');
}

async function editarResponsavel(id) {
    try {
        const response = await fetch(`http://localhost:5000/responsaveis/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar responsável');
        
        const responsavel = await response.json();
        
        // Preencher o formulário
        document.getElementById('responsavelId').value = responsavel._id;
        document.getElementById('nome').value = responsavel.nome;
        document.getElementById('tipo').value = responsavel.tipo;
        document.getElementById('email').value = responsavel.email;
        document.getElementById('telefone').value = responsavel.telefone;
        document.getElementById('areaAtuacao').value = responsavel.areaAtuacao;
        
        modalTitulo.textContent = 'Editar Responsável';
        modalResponsavel.classList.remove('hidden');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar responsável para edição');
    }
}

function fecharModalResponsavel() {
    modalResponsavel.classList.add('hidden');
}

function solicitarExclusao(id) {
    responsavelParaExcluir = id;
    modalConfirmacao.classList.remove('hidden');
}

function fecharModalConfirmacao() {
    modalConfirmacao.classList.add('hidden');
    responsavelParaExcluir = null;
}

async function confirmarExclusao() {
    if (!responsavelParaExcluir) return;
    
    try {
        const response = await fetch(`http://localhost:5000/responsaveis/${responsavelParaExcluir}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao excluir responsável');
        
        alert('Responsável desativado com sucesso!');
        fecharModalConfirmacao();
        carregarResponsaveis();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao desativar responsável');
    }
}

async function salvarResponsavel(e) {
    e.preventDefault();
    
    const id = document.getElementById('responsavelId').value;
    const responsavelData = {
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        areaAtuacao: document.getElementById('areaAtuacao').value
    };
    
    try {
        let response;
        if (id) {
            // Editar responsável existente
            response = await fetch(`http://localhost:5000/responsaveis/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responsavelData)
            });
        } else {
            // Criar novo responsável
            response = await fetch('http://localhost:5000/responsaveis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responsavelData)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar responsável');
        }
        
        alert(`Responsável ${id ? 'atualizado' : 'criado'} com sucesso!`);
        fecharModalResponsavel();
        carregarResponsaveis();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao salvar responsável');
    }
}

async function buscarResponsaveis() {
    const termo = buscaResponsavel.value.trim();
    
    try {
        let url = 'http://localhost:5000/responsaveis';
        if (termo) {
            url += `?q=${encodeURIComponent(termo)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar responsáveis');
        
        const responsaveisEncontrados = await response.json();
        exibirResponsaveis(responsaveisEncontrados);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar responsáveis');
    }
};