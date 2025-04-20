// Funções relacionadas ao carregamento de modelos

// Carregar modelos por marca
async function loadModelos(marcaId) {
    try {
        console.log(`Carregando modelos para marca ID: ${marcaId}`);
        const modeloSelect = document.getElementById('configuradorModelo');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
        } else {
            console.error('Elemento select de modelo não encontrado');
            return;
        }
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/public/by-marca/${marcaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`Falha ao carregar modelos: ${response.status} ${response.statusText}`);
        }
        const modelos = await response.json();
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        if (Array.isArray(modelos)) {
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            if (modelos.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhum modelo disponível";
                modeloSelect.appendChild(option);
            }
        } else {
            modeloSelect.innerHTML = '<option value="">Formato de resposta inválido</option>';
        }
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        const modeloSelect = document.getElementById('configuradorModelo');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
        }
    }
}

window.loadModelos = loadModelos;
