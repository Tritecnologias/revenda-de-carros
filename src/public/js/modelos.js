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
        
        // URLs para tentar carregar modelos
        const apiUrls = [
            `/api/veiculos/modelos/public/by-marca/${marcaId}`,
            `http://localhost:3000/api/veiculos/modelos/public/by-marca/${marcaId}`,
            `http://69.62.91.195:3000/api/veiculos/modelos/public/by-marca/${marcaId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}`);
                    break; // Sair do loop se a resposta for bem-sucedida
                } else {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                    response = null; // Resetar resposta para tentar próxima URL
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se todas as URLs falharam
        if (!response || !response.ok) {
            throw new Error(`Falha ao carregar modelos: ${lastError}`);
        }
        
        // Processar resposta bem-sucedida
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
